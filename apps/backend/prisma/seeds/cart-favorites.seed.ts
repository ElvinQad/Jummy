import type { PrismaClient } from '@prisma/client';

// Helper function to generate random future date (within next 7 days)
function getRandomFutureDate(): Date {
  const now = new Date();
  const futureDate = new Date(now);
  futureDate.setDate(now.getDate() + Math.floor(Math.random() * 7) + 1); // Random date within next 7 days
  futureDate.setHours(Math.floor(Math.random() * 14) + 8); // Random hour between 8 AM and 10 PM
  futureDate.setMinutes(0);
  futureDate.setSeconds(0);
  futureDate.setMilliseconds(0);
  return futureDate;
}

export async function seedCartAndFavorites(prisma: PrismaClient): Promise<void> {
  console.log('Starting to seed carts and favorites...');
  const results = { success: 0, failed: 0 };

  try {
    // Get all regular users (non-chefs, non-admins)
    const users = await prisma.user.findMany({
      where: {
        isChef: false,
        isAdmin: false,
      },
      select: {
        id: true,
        email: true,
      }
    });

    if (!users.length) {
      console.warn('⚠️ No regular users found to seed carts and favorites');
      return;
    }

    // Get all available dishes
    const dishes = await prisma.dish.findMany({
      select: {
        id: true,
        price: true,
        cookId: true,
      }
    });

    if (!dishes.length) {
      console.warn('⚠️ No dishes found to seed carts and favorites');
      return;
    }

    // Process each user
    for (const user of users) {
      try {
        // Clear existing cart items and favorites first
        await prisma.$transaction([
          prisma.cartItem.deleteMany({
            where: { cart: { userId: user.id } }
          }),
          prisma.userFavorite.deleteMany({ // Changed from favorite to userFavorite
            where: { userId: user.id }
          })
        ]);

        // Select random dishes for cart (1-3 items)
        const cartDishes = getRandomItems(dishes, Math.floor(Math.random() * 3) + 1);
        
        // Create cart if doesn't exist
        const cart = await prisma.cart.upsert({
          where: { userId: user.id },
          create: { userId: user.id },
          update: {},
        });

        // Add items to cart
        await prisma.cartItem.createMany({
          data: cartDishes.map(dish => ({
            cartId: cart.id,
            dishId: dish.id,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: dish.price,
            scheduledFor: getRandomFutureDate(), // Add scheduled delivery time
          }))
        });

        // Select random dishes for favorites (2-5 items)
        const favoriteDishes = getRandomItems(dishes, Math.floor(Math.random() * 4) + 2);
        
        // Create favorites using userFavorite model
        await prisma.userFavorite.createMany({ // Changed from favorite to userFavorite
          data: favoriteDishes.map(dish => ({
            userId: user.id,
            dishId: dish.id,
          })),
          skipDuplicates: true,
        });

        console.log(`✓ Created cart (${cartDishes.length} items) and favorites (${favoriteDishes.length} items) for user: ${user.email}`);
        results.success++;
      } catch (error) {
        console.error(`❌ Error processing user ${user.email}:`, error);
        results.failed++;
      }
    }
  } catch (error) {
    console.error('❌ Fatal error during cart and favorites seeding:', error);
    throw error;
  }

  console.log(`\nCart and favorites seeding completed!
    ✅ Successful: ${results.success}
    ❌ Failed: ${results.failed}`);
}

// Helper function to get random items from array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
