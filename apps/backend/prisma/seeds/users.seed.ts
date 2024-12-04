import { type PrismaClient,  OnlineStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const users = [
  {
    email: 'admin@jummy.com',
    password: 'admin123',
    isAdmin: true,
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&w=200&q=80',
      phone: '+1234567890'
    }
  },
  {
    email: 'chef@jummy.com',
    password: 'chef123',
    isChef: true,
    profile: {
      firstName: 'Marco',
      lastName: 'Rossi',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&w=200&q=80',
      phone: '+1234567891',
      addresses: [
        {
          title: 'Restaurant',
          addressLine1: '123 Italian Street',
          city: 'New York',
          district: 'Manhattan',
          latitude: 40.7505,
          longitude: -73.9934,
          isDefault: true
        }
      ]
    },
    cookProfile: {
      businessName: 'La Cucina Italiana',
      description: 'Authentic Italian cuisine from Rome with over 20 years of experience',
      cuisineTypes: ['italian', 'mediterranean'],
      rating: 4.8,
      minOrderAmount: 50,
      maxOrdersPerSlot: 5,
      location: { address: '123 Italian Street, NY 10001', coordinates: { lat: 40.7505, lng: -73.9934 } },
      operatingHours: {
        monday: { open: '10:00', close: '22:00' },
        tuesday: { open: '10:00', close: '22:00' },
        wednesday: { open: '10:00', close: '22:00' },
        thursday: { open: '10:00', close: '22:00' },
        friday: { open: '10:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '11:00', close: '21:00' }
      }
    }
  },
  {
    email: 'asian.chef@jummy.com',
    password: 'chef123',
    isChef: true,
    profile: {
      firstName: 'Hiroshi',
      lastName: 'Tanaka',
      avatar: 'chef-hiroshi.jpg',
      addresses: [
        {
          title: 'Restaurant',
          addressLine1: '789 Sushi Lane',
          city: 'New York',
          district: 'Manhattan',
          latitude: 40.7614,
          longitude: -73.9776,
          isDefault: true
        }
      ]
    },
    cookProfile: {
      businessName: 'Sushi Master',
      description: 'Traditional Japanese cuisine',
      cuisineTypes: ['japanese', 'asian'],
      rating: 4.7,
      minOrderAmount: 40,
      maxOrdersPerSlot: 6,
    }
  },
  {
    email: 'med.chef@jummy.com',
    password: 'chef123',
    isChef: true,
    profile: {
      firstName: 'Elena',
      lastName: 'Papadopoulos',
      avatar: 'chef-elena.jpg',
      addresses: [
        {
          title: 'Restaurant',
          addressLine1: '456 Mediterranean Ave',
          city: 'New York',
          district: 'Queens',
          latitude: 40.7282,
          longitude: -73.7949,
          isDefault: true
        }
      ]
    },
    cookProfile: {
      businessName: 'Mediterranean Delights',
      description: 'Authentic Mediterranean flavors',
      cuisineTypes: ['greek', 'mediterranean'],
      rating: 4.6,
      minOrderAmount: 45,
      maxOrdersPerSlot: 4,
    }
  },
  {
    email: 'french.chef@jummy.com',
    password: 'chef123',
    isChef: true,
    profile: {
      firstName: 'Pierre',
      lastName: 'Dubois',
      avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&w=200&q=80',
      phone: '+1234567894',
      addresses: [
        {
          title: 'Restaurant',
          addressLine1: '456 French Avenue',
          city: 'New York',
          district: 'Manhattan',
          latitude: 40.7589,
          longitude: -73.9851,
          isDefault: true
        }
      ]
    },
    cookProfile: {
      businessName: 'Le Petit Bistro',
      description: 'Classic French cuisine with a modern twist',
      cuisineTypes: ['french', 'european'],
      rating: 4.9,
      minOrderAmount: 60,
      maxOrdersPerSlot: 4,
      location: '456 French Avenue, NY 10002',
      operatingHours: {
        tuesday: { open: '17:00', close: '23:00' },
        wednesday: { open: '17:00', close: '23:00' },
        thursday: { open: '17:00', close: '23:00' },
        friday: { open: '17:00', close: '00:00' },
        saturday: { open: '17:00', close: '00:00' }
      }
    }
  },
  {
    email: 'user1@jummy.com',
    password: 'user123',
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&w=200&q=80',
      phone: '+1234567895',
      addresses: [
        {
          title: 'Home',
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          city: 'New York',
          district: 'Manhattan',
          latitude: 40.7128,
          longitude: -74.0060,
          isDefault: true
        },
        {
          title: 'Office',
          addressLine1: '456 Business Ave',
          city: 'New York',
          district: 'Manhattan',
          latitude: 40.7589,
          longitude: -73.9851,
          isDefault: false
        }
      ]
    },
  },
  {
    email: 'user2@jummy.com',
    password: 'user123',
    profile: {
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&w=200&q=80',
      phone: '+1234567896',
      addresses: [
        {
          title: 'Home',
          addressLine1: '789 Residential Lane',
          city: 'New York',
          district: 'Brooklyn',
          latitude: 40.6782,
          longitude: -73.9442,
          isDefault: true
        }
      ]
    }
  },
  {
    email: 'user3@jummy.com',
    password: 'user123',
    profile: {
      firstName: 'Michael',
      lastName: 'Johnson',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&w=200&q=80',
      phone: '+1234567897',
      addresses: [
        {
          title: 'Home',
          addressLine1: '321 Queens Blvd',
          city: 'New York',
          district: 'Queens',
          latitude: 40.7282,
          longitude: -73.7949,
          isDefault: true
        }
      ]
    },

    settings: {
      emailNotifications: true,
      pushNotifications: false,
      orderUpdates: true,
      marketingEmails: true,
      language: 'en',
      currency: 'USD'
    }
  },
  {
    email: 'user4@jummy.com',
    password: 'user123',
    profile: {
      firstName: 'Sarah',
      lastName: 'Williams',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&w=200&q=80',
      phone: '+1234567898',
      addresses: [
        {
          title: 'Home',
          addressLine1: '567 Bronx St',
          addressLine2: 'Unit 3C',
          city: 'New York',
          district: 'Bronx',
          latitude: 40.8448,
          longitude: -73.8648,
          isDefault: true
        },
        {
          title: 'Work',
          addressLine1: '890 Madison Ave',
          city: 'New York',
          district: 'Manhattan',
          latitude: 40.7736,
          longitude: -73.9566,
          isDefault: false
        }
      ]
    }
  }
];

// Helper function to get random online status
function getRandomOnlineStatus(): OnlineStatus {
  const statuses = [OnlineStatus.ONLINE, OnlineStatus.AWAY, OnlineStatus.OFFLINE];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

// Helper function to get random platform
function getRandomPlatform(): string {
  const platforms = ['web', 'mobile-ios', 'mobile-android', 'tablet'];
  return platforms[Math.floor(Math.random() * platforms.length)];
}

export async function seedUsers(prisma: PrismaClient): Promise<void> {
  console.log('Starting to seed users...');
  const results = { success: 0, failed: 0 };

  for (const userData of users) {
    try {
      const { profile, cookProfile, settings, ...userInfo } = userData;
      const hashedPassword = await bcrypt.hash(userInfo.password, 10);
      const { phone, addresses, ...profileData } = profile;

      // Generate random online status and last seen data
      const onlineStatus = getRandomOnlineStatus();
      const lastSeenData = {
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)), // Random time within last 24h
        platform: getRandomPlatform(),
        deviceId: `device-${Math.random().toString(36).substr(2, 9)}`,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
      };

      // Create or update user with addresses
       await prisma.user.upsert({
        where: { email: userInfo.email },
        update: {
          ...userInfo,
          phone,
          password: hashedPassword,
          onlineStatus,
          lastSeen: {
            upsert: {
              create: lastSeenData,
              update: lastSeenData,
            }
          },
          profile: {
            upsert: {
              create: {
                ...profileData,
                addresses: {
                  create: addresses || []
                }
              },
              update: {
                ...profileData,
                addresses: {
                  deleteMany: {},
                  create: addresses || []
                }
              },
            }
          },
          cookProfile: cookProfile ? {
            upsert: {
              create: cookProfile,
              update: cookProfile,
            }
          } : undefined,
        },
        create: {
          ...userInfo,
          phone,
          password: hashedPassword,
          onlineStatus,
          lastSeen: {
            create: lastSeenData
          },
          profile: {
            create: {
              ...profileData,
              addresses: {
                create: addresses || []
              }
            }
          },
          cookProfile: cookProfile ? {
            create: cookProfile
          } : undefined,
        },
      });

      console.log(`✓ Processed user: ${userInfo.email}`);
      results.success++;
    } catch (error) {
      results.failed++;
      console.error(`❌ Error processing user ${userData.email}:`, error);
    }
  }

  console.log(`\nUsers seeding completed!
    ✅ Successful: ${results.success}
    ❌ Failed: ${results.failed}`);
}
