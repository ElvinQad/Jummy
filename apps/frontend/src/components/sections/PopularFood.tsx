import React from 'react';
import FoodCard from '../FoodCard';

interface FoodItem {
  id: number;
  image: string;
  authorImage: string;
  price: number;
  title: string;
  availability: string;
  rating: number;
  servings: number;
  location: string;
}

const foodItems: FoodItem[] = [
  {
    id: 1,
    image: "assets/images/food/1.png",
    authorImage: "assets/images/chef/author/happyportrait.png",
    price: 20.99,
    title: "Veggie Tagliatelle Bolognese",
    availability: "Everyday",
    rating: 4,
    servings: 1.1,
    location: "6th Avenue New York"
  },
  {
    id: 2,
    image: "assets/images/food/5.png",
    authorImage: "assets/images/chef/author/grievechef.png",
    price: 20.99,
    title: "Chicken Biryani Special",
    availability: "Everyday",
    rating: 4,
    servings: 1.1,
    location: "6th Avenue New York"
  },
  {
    id: 3,
    image: "assets/images/food/3.png",
    authorImage: "assets/images/chef/author/chef.png",
    price: 20.99,
    title: "Mexican Green Wave Pizza",
    availability: "Everyday",
    rating: 4,
    servings: 1.1,
    location: "6th Avenue New York"
  },
  {
    id: 4,
    image: "assets/images/food/4.png",
    authorImage: "assets/images/chef/author/happyw.png",
    price: 20.99,
    title: "Spicy Thai Noodle Bowl",
    availability: "Everyday",
    rating: 4,
    servings: 1.1,
    location: "6th Avenue New York"
  },
  {
    id: 5,
    image: "assets/images/food/5.png",
    authorImage: "assets/images/chef/author/smilewomen.png",
    price: 20.99,
    title: "Mediterranean Salad Bowl",
    availability: "Everyday",
    rating: 4,
    servings: 1.1,
    location: "6th Avenue New York"
  },
  {
    id: 6,
    image: "assets/images/food/6.png",
    authorImage: "assets/images/chef/author/menchef.png",
    price: 20.99,
    title: "Japanese Sushi Platter",
    availability: "Everyday",
    rating: 4,
    servings: 1.1,
    location: "6th Avenue New York"
  }
];

const PopularFoods: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-foodred-50/5 dark:from-dark-background dark:to-dark-primary/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            Most Popular Foods
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Completely network impactful users whereas next-generation applications engage out thinking via tactical action.
          </p>
        </div>

        {/* Popular Foods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {foodItems.slice(0, 3).map((item) => (
            <FoodCard key={item.id} item={item} variant="popular" />
          ))}
        </div>

        {/* List View Foods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodItems.slice(3).map((item) => (
            <FoodCard key={item.id} item={item} variant="default" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularFoods;