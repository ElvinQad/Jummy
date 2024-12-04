import type { PrismaClient } from '@prisma/client';

const dishes = [
  // Italian Cuisine
  {
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with San Marzano tomatoes, fresh mozzarella, and basil',
    price: 15.99,
    preparationTime: 30,
    images: ['margherita-pizza.jpg'],
    maxDailyQuantity: 20,
    categories: ['pizza', 'italian-cuisine'],
    foodTypes: ['main-course'],
    cookEmail: 'chef@jummy.com'
  },
  // Asian Cuisine
  {
    name: 'Sushi Roll Set',
    description: 'Assorted fresh sushi rolls with wasabi and pickled ginger',
    price: 24.99,
    preparationTime: 40,
    images: ['sushi-set.jpg'],
    maxDailyQuantity: 15,
    categories: ['japanese', 'asian-cuisine'],
    foodTypes: ['main-course'],
    cookEmail: 'asian.chef@jummy.com'
  },
  // Mediterranean Cuisine
  {
    name: 'Greek Mezze Platter',
    description: 'Selection of hummus, tzatziki, olives, and pita bread',
    price: 19.99,
    preparationTime: 25,
    images: ['greek-mezze.jpg'],
    maxDailyQuantity: 18,
    categories: ['greek', 'mediterranean-cuisine'],
    foodTypes: ['appetizers'],
    cookEmail: 'med.chef@jummy.com'
  },
  // Additional Italian Dishes
  {
    name: 'Pasta Carbonara',
    description: 'Classic Roman pasta with eggs, pecorino cheese, guanciale, and black pepper',
    price: 18.99,
    preparationTime: 25,
    images: ['https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&w=1080&q=80'],
    maxDailyQuantity: 25,
    categories: ['pasta', 'italian-cuisine'],
    foodTypes: ['main-course'],
    cookEmail: 'chef@jummy.com'
  },
  {
    name: 'Tiramisu',
    description: 'Traditional Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 12.99,
    preparationTime: 20,
    images: ['https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&w=1080&q=80'],
    maxDailyQuantity: 30,
    categories: ['italian-desserts', 'italian-cuisine'],
    foodTypes: ['desserts'],
    cookEmail: 'chef@jummy.com'
  },

  // Additional Asian Dishes
  {
    name: 'Ramen Bowl',
    description: 'Rich pork bone broth with fresh noodles, chashu pork, and seasonal vegetables',
    price: 16.99,
    preparationTime: 35,
    images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&w=1080&q=80'],
    maxDailyQuantity: 20,
    categories: ['japanese', 'asian-cuisine'],
    foodTypes: ['main-course'],
    cookEmail: 'asian.chef@jummy.com'
  },
  {
    name: 'Mochi Ice Cream',
    description: 'Japanese rice cake filled with various ice cream flavors',
    price: 8.99,
    preparationTime: 15,
    images: ['https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&w=1080&q=80'],
    maxDailyQuantity: 40,
    categories: ['japanese', 'asian-cuisine'],
    foodTypes: ['desserts'],
    cookEmail: 'asian.chef@jummy.com'
  },

  // Additional Mediterranean Dishes
  {
    name: 'Moussaka',
    description: 'Traditional Greek casserole with layers of eggplant, spiced ground meat, and béchamel sauce',
    price: 21.99,
    preparationTime: 45,
    images: ['https://images.unsplash.com/photo-1594978583693-8dde1d59d290?auto=format&w=1080&q=80'],
    maxDailyQuantity: 15,
    categories: ['greek', 'mediterranean-cuisine'],
    foodTypes: ['main-course'],
    cookEmail: 'med.chef@jummy.com'
  },
  {
    name: 'Baklava',
    description: 'Sweet dessert made of layers of filo pastry, filled with chopped nuts and sweetened with syrup',
    price: 9.99,
    preparationTime: 20,
    images: ['https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&w=1080&q=80'],
    maxDailyQuantity: 35,
    categories: ['greek', 'mediterranean-cuisine'],
    foodTypes: ['desserts'],
    cookEmail: 'med.chef@jummy.com'
  }
];

export async function seedDishes(prisma: PrismaClient): Promise<void> {
  console.log('Starting to seed dishes...');
  let totalProcessed = 0;

  for (const dishData of dishes) {
    try {
      // Get cook profile ID based on email
      const cook = await prisma.user.findUnique({
        where: { email: dishData.cookEmail },
        include: { cookProfile: true }
      });

      if (!cook?.cookProfile?.id) {
        console.warn(`⚠️ Cook not found for email: ${dishData.cookEmail}`);
        continue;
      }

      // Get category IDs
      const categories = await prisma.category.findMany({
        where: { slug: { in: dishData.categories } }
      });

      // Get food type IDs
      const foodTypes = await prisma.foodType.findMany({
        where: { slug: { in: dishData.foodTypes } }
      });

      // Create or update dish
      await prisma.dish.upsert({
        where: {
          id: BigInt(0) // This will force create as it won't match
        },
        update: {},
        create: {
          name: dishData.name,
          description: dishData.description,
          price: dishData.price,
          preparationTime: dishData.preparationTime,
          images: dishData.images,
          maxDailyQuantity: dishData.maxDailyQuantity,
          cookId: cook.cookProfile.id,
          categories: {
            create: categories.map(category => ({
              category: { connect: { id: category.id } }
            }))
          },
          foodTypes: {
            create: foodTypes.map(foodType => ({
              foodType: { connect: { id: foodType.id } }
            }))
          }
        }
      });

      console.log(`✓ Processed dish: ${dishData.name}`);
      totalProcessed++;
    } catch (error) {
      console.warn(`⚠️ Error processing dish ${dishData.name}:`, error);
    }
  }

  console.log(`\nDishes seeding completed! Processed ${totalProcessed} dishes.`);
}
