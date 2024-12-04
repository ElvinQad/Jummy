import type { OrderStatus, PaymentProvider, PaymentStatus, PrismaClient } from '@prisma/client';

const orders = [
  {
    customerEmail: 'user1@jummy.com',
    items: [
      {
        dishName: 'Margherita Pizza',
        quantity: 2
      },
      {
        dishName: 'Tiramisu',
        quantity: 1
      }
    ],
    status: 'DELIVERED',
    scheduledFor: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    deliveryDetails: {
      address: '123 Main St, New York, NY 10001',
      phone: '+1234567890',
      notes: 'Please ring the doorbell'
    }
  },
  {
    customerEmail: 'user2@jummy.com',
    items: [
      {
        dishName: 'Sushi Roll Set',
        quantity: 1
      }
    ],
    status: 'PREPARING',
    scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    deliveryDetails: {
      address: '456 Park Ave, New York, NY 10022',
      phone: '+1234567891',
      notes: 'Leave with doorman'
    }
  },
  {
    customerEmail: 'user1@jummy.com',
    items: [
      { dishName: 'Pasta Carbonara', quantity: 1 },
      { dishName: 'Tiramisu', quantity: 2 }
    ],
    status: 'DELIVERED',
    scheduledFor: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    deliveryDetails: {
      address: '789 Broadway, New York, NY 10003',
      phone: '+1234567892',
      notes: 'No contact delivery'
    },
    payment: {
      provider: 'STRIPE',
      status: 'COMPLETED',
      transactionId: 'tx_' + Math.random().toString(36).substr(2, 9)
    },
    review: {
      rating: 5,
      comment: 'Excellent food and service!',
      metrics: {
        taste: 5,
        presentation: 5,
        value: 4
      }
    }
  }
];

export async function seedOrders(prisma: PrismaClient) {
  console.log('Starting to seed orders...');
  const results = { success: 0, failed: 0 };

  for (const orderData of orders) {
    try {
      // Find customer
      const customer = await prisma.user.findUnique({
        where: { email: orderData.customerEmail }
      });

      if (!customer) {
        console.warn(`⚠️ Customer not found: ${orderData.customerEmail}`);
        continue;
      }

      // Find dishes and calculate total
      let totalAmount = 0;
      const orderItems = [];

      for (const item of orderData.items) {
        const dish = await prisma.dish.findFirst({
          where: { name: item.dishName },
          include: { cook: true }
        });

        if (!dish) {
          console.warn(`⚠️ Dish not found: ${item.dishName}`);
          continue;
        }

        const itemTotal = dish.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          dishId: dish.id,
          cookId: dish.cookId,
          quantity: item.quantity,
          unitPrice: dish.price,
          totalPrice: itemTotal
        });
      }

      // Create order with payment and review
      await prisma.order.create({
        data: {
          customerId: customer.id,
          status: orderData.status as OrderStatus,
          totalAmount,
          deliveryDetails: orderData.deliveryDetails,
          scheduledFor: orderData.scheduledFor,
          items: {
            create: orderItems
          },
          statusHistory: {
            create: {
              status: orderData.status as OrderStatus,
              comment: 'Initial status'
            }
          },
          payment: orderData.payment ? {
            create: {
              amount: totalAmount,
              status: orderData.payment.status as PaymentStatus,
              provider: orderData.payment.provider as PaymentProvider,
              transactionId: orderData.payment.transactionId,
              providerResponse: { success: true }
            }
          } : undefined,
          review: orderData.review && orderData.status === 'DELIVERED' ? {
            create: {
              customerId: customer.id,
              cookId: orderItems[0].cookId, // Assuming single cook per order
              rating: orderData.review.rating,
              comment: orderData.review.comment,
              metrics: orderData.review.metrics
            }
          } : undefined
        }
      });

      console.log(`✓ Created order for ${orderData.customerEmail}`);
      results.success++;
    } catch (error) {
      results.failed++;
      console.error(`❌ Error creating order for ${orderData.customerEmail}:`, error);
    }
  }

  console.log(`\nOrders seeding completed!
    ✅ Successful: ${results.success}
    ❌ Failed: ${results.failed}`);
}
