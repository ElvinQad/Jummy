import { PrismaClient } from '@prisma/client';

const conversations = [
  {
    participants: ['user1@jummy.com', 'chef@jummy.com'],
    messages: [
      {
        senderEmail: 'user1@jummy.com',
        receiverEmail: 'chef@jummy.com',
        content: 'Hi, I have a question about my order'
      },
      {
        senderEmail: 'chef@jummy.com',
        receiverEmail: 'user1@jummy.com',
        content: 'Hello! How can I help you?'
      }
    ]
  },
  {
    participants: ['user2@jummy.com', 'asian.chef@jummy.com'],
    messages: [
      {
        senderEmail: 'user2@jummy.com',
        receiverEmail: 'asian.chef@jummy.com',
        content: 'Do you offer vegetarian sushi options?'
      }
    ]
  },
  {
    participants: ['user1@jummy.com', 'french.chef@jummy.com'],
    messages: [
      {
        senderEmail: 'user1@jummy.com',
        receiverEmail: 'french.chef@jummy.com',
        content: 'Do you have any special menu for this weekend?'
      },
      {
        senderEmail: 'french.chef@jummy.com',
        receiverEmail: 'user1@jummy.com',
        content: 'Yes! We have a special tasting menu featuring classic French dishes.'
      },
      {
        senderEmail: 'user1@jummy.com',
        receiverEmail: 'french.chef@jummy.com',
        content: 'That sounds great! What are the serving sizes?'
      }
    ]
  }
];

export async function seedConversations(prisma: PrismaClient) {
  console.log('Starting to seed conversations...');
  const results = { success: 0, failed: 0 };

  for (const convData of conversations) {
    try {
      // Find participants
      const users = await prisma.user.findMany({
        where: {
          email: { in: convData.participants }
        }
      });

      if (users.length !== convData.participants.length) {
        console.warn('⚠️ Some users not found');
        continue;
      }

      // Create conversation
      const conversation = await prisma.conversation.create({
        data: {
          users: {
            connect: users.map(user => ({ id: user.id }))
          }
        }
      });

      // Add messages
      for (const msgData of convData.messages) {
        const sender = users.find(u => u.email === msgData.senderEmail);
        const receiver = users.find(u => u.email === msgData.receiverEmail);

        if (!sender || !receiver) {
          console.warn('⚠️ Message sender or receiver not found');
          continue;
        }

        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: sender.id,
            receiverId: receiver.id,
            content: msgData.content
          }
        });
      }

      console.log(`✓ Created conversation with ${convData.messages.length} messages`);
      results.success++;
    } catch (error) {
      results.failed++;
      console.error('❌ Error creating conversation:', error);
    }
  }

  console.log(`\nConversations seeding completed!
    ✅ Successful: ${results.success}
    ❌ Failed: ${results.failed}`);
}
