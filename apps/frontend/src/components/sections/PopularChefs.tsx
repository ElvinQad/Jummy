import React from "react";
import ChefCard from "../ChefCard";
import { Chef } from "../../types/kitchen";

const chefs: Chef[] = [
  {
    id: 1,
    name: "Sanzida laila Trisha",
    image: "assets/images/kitchen/1.png",
    authorImage: "assets/images/chef/author/happyportrait.png",
    avatar: "assets/images/chef/author/happyportrait.png",
    earned: "290.00",
    menuCount: 96,
    recipeCount: 33,
    rating: 4.8,
    location: "Dhaka, Bangladesh",
    speciality: "Bengali Cuisine"
  },
  {
    id: 2,
    name: "Jinnat Raihun Sumi",
    image: "assets/images/kitchen/2.png",
    authorImage: "assets/images/chef/author/happyw.png",
    avatar: "assets/images/chef/author/happyw.png",
    earned: "290.00",
    menuCount: 96,
    recipeCount: 33,
    rating: 4.9,
    location: "Chittagong, Bangladesh",
    speciality: "Street Food"
  },
  {
    id: 3,
    name: "Shahana Anam Khan",
    image: "assets/images/kitchen/3.png",
    authorImage: "assets/images/chef/author/smilewomen.png",
    avatar: "assets/images/chef/author/smilewomen.png",
    earned: "290.00",
    menuCount: 96,
    recipeCount: 33,
    rating: 4.7,
    location: "Sylhet, Bangladesh",
    speciality: "Desserts"
  },
];

const PopularChef: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-background/50 to-foodred-50/10 dark:from-dark-background dark:via-dark-primary/50 dark:to-dark-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center space-y-5 mb-16">
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foodred-600 to-foodred-500 bg-clip-text text-transparent">
            Popular HomeChef
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg dark:text-gray-400">
            Completely network impactful users whereas next-generation
            applications engage out thinking via tactical action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12">
          {chefs.map((chef) => (
            <ChefCard key={chef.id} chef={chef} variant="popular" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularChef;
