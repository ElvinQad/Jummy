import type { PrismaClient } from '@prisma/client';


const cuisineCategories = [
  {
    name: 'Italian Cuisine',
    slug: 'italian-cuisine',
    description: 'Traditional Italian dishes and recipes',
    image: 'italian-cuisine.jpg',
    subcategories: [
      { name: 'Pizza', slug: 'pizza', description: 'Traditional and modern pizzas', image: 'pizza.jpg' },
      { name: 'Pasta', slug: 'pasta', description: 'Fresh and dried pasta dishes', image: 'pasta.jpg' },
      { name: 'Risotto', slug: 'risotto', description: 'Creamy Italian rice dishes', image: 'risotto.jpg' },
      { name: 'Italian Desserts', slug: 'italian-desserts', description: 'Sweet Italian treats', image: 'italian-desserts.jpg' }
    ],
  },
  {
    name: 'Asian Cuisine',
    slug: 'asian-cuisine',
    description: 'Diverse Asian culinary traditions',
    image: 'asian-cuisine.jpg',
    subcategories: [
      { name: 'Japanese', slug: 'japanese', description: 'Traditional Japanese dishes', image: 'japanese.jpg' },
      { name: 'Chinese', slug: 'chinese', description: 'Authentic Chinese specialties', image: 'chinese.jpg' },
      { name: 'Thai', slug: 'thai', description: 'Spicy Thai favorites', image: 'thai.jpg' },
      { name: 'Korean', slug: 'korean', description: 'Korean classic dishes', image: 'korean.jpg' }
    ],
  },
  {
    name: 'Mediterranean Cuisine',
    slug: 'mediterranean-cuisine',
    description: 'Healthy Mediterranean dishes',
    image: 'mediterranean-cuisine.jpg',
    subcategories: [
      { name: 'Greek', slug: 'greek', description: 'Traditional Greek dishes', image: 'greek.jpg' },
      { name: 'Turkish', slug: 'turkish', description: 'Turkish delights and meals', image: 'turkish.jpg' },
      { name: 'Lebanese', slug: 'lebanese', description: 'Lebanese specialties', image: 'lebanese.jpg' }
    ],
  },
  {
    name: 'American Cuisine',
    slug: 'american-cuisine',
    description: 'Classic American comfort food',
    image: 'american-cuisine.jpg',
    subcategories: [
      { name: 'Burgers', slug: 'burgers', description: 'Gourmet and classic burgers', image: 'burgers.jpg' },
      { name: 'BBQ', slug: 'bbq', description: 'Smoked and grilled specialties', image: 'bbq.jpg' },
      { name: 'Tex-Mex', slug: 'tex-mex', description: 'Texan-Mexican fusion', image: 'tex-mex.jpg' }
    ],
  }
];

export async function seedCategories(prisma: PrismaClient): Promise<void> {
  try {
    console.log('Starting to seed categories...');
    let totalProcessed = 0;

    for (const cuisine of cuisineCategories) {
      // Upsert main cuisine category
      const mainCategory = await prisma.category.upsert({
        where: { slug: cuisine.slug },
        update: {
          name: cuisine.name,
          description: cuisine.description,
          image: cuisine.image,
        },
        create: {
          name: cuisine.name,
          slug: cuisine.slug,
          description: cuisine.description,
          image: cuisine.image,
        },
      });

      totalProcessed++;

      // Upsert subcategories
      for (const sub of cuisine.subcategories) {
        await prisma.category.upsert({
          where: { slug: sub.slug },
          update: {
            name: sub.name,
            description: sub.description,
            image: sub.image,
            parentId: mainCategory.id,
          },
          create: {
            name: sub.name,
            slug: sub.slug,
            description: sub.description,
            image: sub.image,
            parentId: mainCategory.id,
          },
        });

        totalProcessed++;
      }

      console.log(`✓ Processed ${cuisine.name} with ${cuisine.subcategories.length} subcategories`);
    }

    console.log(`\nCategories seeding completed! Processed ${totalProcessed} categories in total.`);
  } catch (error) {
    console.error('\n❌ Error during category seeding:', error);
    throw error;
  }
}
