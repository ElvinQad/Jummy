import type { NotificationType, PrismaClient } from '@prisma/client';

const notifications = [
  {
    userEmail: 'user1@jummy.com',
    type: 'ORDER_STATUS',
    title: 'Order Delivered',
    message: 'Your order has been delivered successfully!',
    data: { orderId: 1 }
  },
  {
    userEmail: 'chef@jummy.com',
    type: 'NEW_MESSAGE',
    title: 'New Message',
    message: 'You have a new message from a customer',
    data: { conversationId: 1 }
  },
  {
    userEmail: 'user2@jummy.com',
    type: 'SUBSCRIPTION',
    title: 'New Menu Items',
    message: 'Chef Marco has added new dishes to their menu!',
    data: { chefId: 1 }
  },
  {
    userEmail: 'chef@jummy.com',
    type: 'REVIEW',
    title: 'New Review',
    message: 'You received a 5-star review!',
    data: { orderId: 1, rating: 5 }
  },
  {
    userEmail: 'user2@jummy.com',
    type: 'SYSTEM',
    title: 'Welcome to Jummy',
    message: 'Thank you for joining our platform!',
    data: { type: 'welcome' }
  },
  {
    userEmail: 'french.chef@jummy.com',
    type: 'ORDER_STATUS',
    title: 'New Order',
    message: 'You have received a new order',
    data: { orderId: 2 }
  }
];

export async function seedNotifications(prisma: PrismaClient): Promise<void> {
  console.log('Starting to seed notifications...');
  const results = { success: 0, failed: 0 };

  for (const notifData of notifications) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: notifData.userEmail }
      });

      if (!user) {
        console.warn(`⚠️ User not found: ${notifData.userEmail}`);
        continue;
      }

      await prisma.notification.create({
        data: {
          userId: user.id,
          type: notifData.type as NotificationType,
          title: notifData.title,
          message: notifData.message,
          data: notifData.data
        }
      });

      console.log(`✓ Created notification for ${notifData.userEmail}`);
      results.success++;
    } catch (error) {
      results.failed++;
      console.error(`❌ Error creating notification for ${notifData.userEmail}:`, error);
    }
  }

  console.log(`\nNotifications seeding completed!
    ✅ Successful: ${results.success}
    ❌ Failed: ${results.failed}`);
}
