import { PrismaClient } from '@prisma/client';
import { seedCategories } from './seeds/categories.seed';
import { seedFoodTypes } from './seeds/food-types.seed';
import { seedUsers } from './seeds/users.seed';
import { seedDishes } from './seeds/dishes.seed';
import { seedOrders } from './seeds/orders.seed';
import { seedNotifications } from './seeds/notifications.seed';
import { seedConversations } from './seeds/conversations.seed';
import { seedSubscriptions } from './seeds/subscriptions.seed';
import { seedCartAndFavorites } from './seeds/cart-favorites.seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');
  
  const startTime = Date.now();
  
  try {
    // First seed users (including chefs)
    console.log('👥 Seeding users...');
    await seedUsers(prisma);
    
    // Then seed categories and food types (dishes depend on these)
    console.log('\n📁 Seeding categories...');
    await seedCategories(prisma);
    
    console.log('\n🍽️ Seeding food types...');
    await seedFoodTypes(prisma);
    
    // Seed dishes (depends on users, categories, and food types)
    console.log('\n🍱 Seeding dishes...');
    await seedDishes(prisma);

    // Add cart and favorites (depends on users and dishes)
    console.log('\n🛒 Seeding carts and favorites...');
    await seedCartAndFavorites(prisma);

    // Seed orders (depends on users and dishes)
    console.log('\n📦 Seeding orders...');
    await seedOrders(prisma);

    // Seed notifications (depends on users and orders)
    console.log('\n🔔 Seeding notifications...');
    await seedNotifications(prisma);

    // Seed conversations (depends on users)
    console.log('\n💬 Seeding conversations...');
    await seedConversations(prisma);
    
    // Seed subscriptions (depends on users and cook profiles)
    console.log('\n🔔 Seeding subscriptions...');
    await seedSubscriptions(prisma);
    
    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n✅ All seeds completed successfully in ${duration.toFixed(2)}s!`);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(() => {
    console.log('\n👋 Seeding process completed');
  });
