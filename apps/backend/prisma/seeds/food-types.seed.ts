import { PrismaClient, Prisma } from '@prisma/client';

const foodTypes = [
  {
    name: 'Main Course',
    slug: 'main-course',
    description: 'Primary dishes including pizzas, pastas, and other entrées',
    image: 'main-course.jpg',
  },
  {
    name: 'Appetizers',
    slug: 'appetizers',
    description: 'Light starters and mezze platters',
    image: 'appetizers.jpg',
  },
  {
    name: 'Sushi & Sashimi',
    slug: 'sushi-sashimi',
    description: 'Fresh Japanese sushi and sashimi',
    image: 'sushi.jpg',
  },
  {
    name: 'Desserts',
    slug: 'desserts',
    description: 'Sweet treats including cakes, ice cream, and pastries',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&w=1080&q=80',
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Refreshing drinks, cocktails, and non-alcoholic options',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&w=1080&q=80',
  },
  {
    name: 'Salads',
    slug: 'salads',
    description: 'Fresh salads with various dressings and toppings',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&w=1080&q=80',
  },
  {
    name: 'Side Dishes',
    slug: 'side-dishes',
    description: 'Complementary dishes like fries, rice, and vegetables',
    image: 'https://images.unsplash.com/photo-1618332366145-9c2b5954718d?auto=format&w=1080&q=80',
  },
];

export async function seedFoodTypes(prisma: PrismaClient) {
  console.log('Starting to seed food types...');
  const results = { success: 0, skipped: 0, failed: 0 };
  
  for (const foodType of foodTypes) {
    try {
      if (!foodType.slug || !foodType.name) {
        console.warn(`⚠️ Skipping invalid food type: ${foodType.name || 'unnamed'}`);
        results.skipped++;
        continue;
      }

      await prisma.foodType.upsert({
        where: { slug: foodType.slug },
        update: foodType,
        create: foodType,
      });
      
      results.success++;
    } catch (error) {
      results.failed++;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.warn(`⚠️ Error with ${foodType.name}: ${error.message}`);
      } else {
        console.error(`❌ Unexpected error with ${foodType.name}:`, error);
      }
    }
  }
  
  console.log(`\nFood types seeding completed!
    ✅ Successful: ${results.success}
    ⚠️ Skipped: ${results.skipped}
    ❌ Failed: ${results.failed}`);
}

