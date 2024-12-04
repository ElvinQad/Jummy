import type { PrismaClient } from '@prisma/client';

const subscriptions = [
  {
    userEmail: 'user1@jummy.com',
    chefEmail: 'chef@jummy.com'
  },
  {
    userEmail: 'user1@jummy.com',
    chefEmail: 'french.chef@jummy.com'
  },
  {
    userEmail: 'user2@jummy.com',
    chefEmail: 'asian.chef@jummy.com'
  }
];

export async function seedSubscriptions(prisma: PrismaClient) {
  console.log('Starting to seed subscriptions...');
  const results = { success: 0, failed: 0 };

  for (const subData of subscriptions) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: subData.userEmail }
      });

      const chef = await prisma.user.findUnique({
        where: { email: subData.chefEmail },
        include: { cookProfile: true }
      });

      if (!user || !chef?.cookProfile) {
        console.warn('⚠️ User or chef not found');
        continue;
      }

      await prisma.subscription.upsert({
        where: {
          userId_cookId: {
            userId: user.id,
            cookId: chef.cookProfile.id
          }
        },
        update: {},
        create: {
          userId: user.id,
          cookId: chef.cookProfile.id
        }
      });

      console.log(`✓ Created/Updated subscription: ${subData.userEmail} -> ${subData.chefEmail}`);
      results.success++;
    } catch (error) {
      results.failed++;
      console.error('❌ Error creating subscription:', error);
    }
  }

  console.log(`\nSubscriptions seeding completed!
    ✅ Successful: ${results.success}
    ❌ Failed: ${results.failed}`);
}
