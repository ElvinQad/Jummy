import React from "react";
import { UserIcon, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Chef } from "../types/kitchen";

interface ChefCardProps {
  chef: Chef;
  variant?: 'popular' | 'default';
}

const ChefCard: React.FC<ChefCardProps> = ({ chef, variant = "popular" }) => {
  const isPopular = variant === "popular";

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1.5 absolute top-4 right-4 bg-background/95 px-4 py-1.5 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="text-foreground font-semibold">{rating}</span>
      </div>
    );
  };

  return (
    <Card className={`border-none shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 group ${
      isPopular ? "bg-background/95 backdrop-blur-md" : "bg-background"
    }`}>
      <CardHeader className="p-0">
        <div className={`w-full overflow-hidden rounded-t-xl relative ${
          isPopular ? "h-64 lg:h-72" : "h-56"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
          <img
            src={isPopular ? chef.image : chef.image}
            alt={chef.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {!isPopular && chef.rating && renderRating(chef.rating)}
        </div>
      </CardHeader>
      
      <CardContent className={`relative ${isPopular ? "p-8 pt-24" : "p-7 pt-20"}`}>
        {/* Avatar Section */}
        <div className={`absolute ${
          isPopular 
            ? "-top-16 left-1/2 transform -translate-x-1/2" 
            : "-top-14 left-7"
        } z-20`}>
          <div className={`overflow-hidden border-[5px] border-background shadow-xl rounded-full group-hover:border-foodred-300 transition-all duration-300 ${
            isPopular ? "w-32 h-32" : "w-28 h-28"
          }`}>
            <img
              src={isPopular ? chef.authorImage : chef.avatar}
              alt={chef.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        <div className={isPopular ? "text-center space-y-6" : "space-y-5"}>
          {/* Chef Info */}
          <div className="space-y-2.5">
            <h3 className={`font-bold ${
              isPopular 
                ? "text-2xl hover:text-foodred-600 text-foreground" 
                : "text-xl text-foreground group-hover:text-foodred-600"
            }`}>
              <a href={`/chef/${chef.id}`} className="transition-colors duration-300">
                {chef.name}
              </a>
            </h3>
            {!isPopular && (
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin className="w-4 h-4 text-foodred-500" />
                <span>{chef.location}</span>
              </div>
            )}
          </div>

          {/* Speciality/Status */}
          {isPopular ? (
            <p className="text-muted-foreground text-lg font-medium">
              Month Top{" "}
              <a href="#" className="text-foodred-600 hover:text-foodred-700 font-semibold">
                Homechef
              </a>
            </p>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 bg-accent text-foodred-600 rounded-full text-sm font-semibold">
                {chef.speciality}
              </span>
            </div>
          )}

          {/* Action Button */}
          <Button
            className={`w-full ${
              isPopular 
                ? "max-w-[240px] mx-auto py-6 text-lg" 
                : "py-5 font-semibold"
            } bg-foodred-500 hover:bg-foodred-600 shadow-lg hover:shadow-foodred-500/25 transition-all duration-300`}
          >
            <UserIcon className={`${isPopular ? "w-5 h-5" : "w-4 h-4"} mr-2`} />
            {isPopular ? "Follow Chef" : "View Profile"}
          </Button>

          {/* Stats Section */}
          <div className={`${
            isPopular 
              ? "grid grid-cols-3 border-t border-border pt-7 mt-7" 
              : "grid grid-cols-2 gap-6 border-t border-border pt-5"
          }`}>
            <div className={`${
              isPopular 
                ? "text-center group/stat hover:scale-105 flex flex-col"  
                : "flex flex-col"
            } transition-transform duration-300`}>
              <span className="font-bold text-foodred-700 text-xl mb-1">
                ${chef.earned}
              </span>
              <span className="text-sm text-muted-foreground font-medium">earned</span>
            </div>
            <div className={`${
              isPopular 
                ? "text-center border-x border-foodred-100/50 dark:border-gray-700 group/stat hover:scale-105 flex flex-col" 
                : "flex flex-col"
            } transition-transform duration-300`}>
              <span className="font-bold text-foodred-700 text-xl mb-1">
                {chef.menuCount}
              </span>
              <span className="text-sm text-gray-600 font-medium">menu items</span>
            </div>
            {isPopular && (
              <div className="text-center group/stat hover:scale-105 transition-transform duration-300 flex flex-col">
                <span className="font-bold d-block text-foodred-700 text-xl mb-1">
                  {chef.recipeCount}
                </span>
                <span className="text-sm text-gray-600 font-medium">Recipes</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChefCard;
