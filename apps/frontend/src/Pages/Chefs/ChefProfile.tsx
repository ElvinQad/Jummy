import React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { UserIcon, Star, Share2, Mail } from "lucide-react";
import FoodCard from "../../components/FoodCard";
import ReviewSection from "./ReviewSection";

interface Dish {
  title: string;
  rating: number;
  price: number;
  image: string;
  authorImage: string;
  availability: string;
  servings: number;
  location: string;
}

interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

interface Chef {
  name: string;
  banner: string;
  avatar: string;
  bio: string;
  earned: string;
  menuCount: number;
  recipeCount: number;
  followers: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  topDishes: Dish[];
  reviews: Review[];
}

const ChefProfile: React.FC = () => {
  const chefAvatar: string = "public/assets/images/chef/author/happyportrait.png";
  
  const chef: Chef = {
    name: "Sanzida laila Trisha",
    banner: "public/assets/images/kitchen/1.png",
    avatar: chefAvatar,
    bio: "Passionate home chef specializing in authentic Bengali cuisine with a modern twist. Creating memorable dining experiences from my kitchen to your table.",
    earned: "2,890.00",
    menuCount: 96,
    recipeCount: 33,
    followers: "2.3K",
    rating: 4.8,
    reviewCount: 156, // Changed from reviews to reviewCount
    specialties: ["Bengali Cuisine", "Street Food", "Desserts"],
    topDishes: [
      {
        title: "Kacchi Biryani",
        rating: 4.9,
        price: 12.99,
        image: "public/assets/images/food/biryani.jpg",
        authorImage: chefAvatar,
        availability: "Weekends",
        servings: 2,
        location: "Dhaka",
      },
      {
        title: "Beef Bhuna",
        rating: 4.7,
        price: 10.99,
        image: "public/assets/images/food/bhuna.jpg",
        authorImage: chefAvatar,
        availability: "Daily",
        servings: 1,
        location: "Dhaka",
      },
    ],
    reviews: [
      { 
        user: "John Doe",
        rating: 5,
        comment: "Amazing food and service!",
        date: "2024-01-15",
        avatar: "public/assets/images/users/user1.jpg"
      },
      // Add more reviews...
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/5 mb-32">
      {/* Banner Section */}
      <div className="relative h-[350px] lg:h-[450px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
        <img
          src={chef.banner}
          alt="Chef Kitchen"
          className="w-full h-full object-cover transform scale-105 hover:scale-100 transition-transform duration-700"
        />
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 max-w-7xl -mt-40 relative z-20">
        <Card className="border-none shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
          <CardContent className="p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
              {/* Avatar */}
              <div className="w-48 h-48 rounded-full overflow-hidden border-8 border-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src={chef.avatar}
                  alt={chef.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center lg:text-left space-y-8">
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-foodred mb-4 tracking-tight">
                    {chef.name}
                  </h1>
                  <p className="text-muted-foreground text-lg leading-relaxed">{chef.bio}</p>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Button className="bg-foodred hover:bg-foodred-600 text-foodred-foreground">
                    <UserIcon className="w-5 h-5 mr-2" />
                    Follow Chef
                  </Button>
                  <Button variant="outline" className="border-foodred-200 hover:bg-foodred-50/50">
                    <Mail className="w-5 h-5 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" className="border-foodred-200 hover:bg-foodred-50/50">
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                {/* Specialties */}
                <div className="flex gap-3 flex-wrap justify-center lg:justify-start">
                  {chef.specialties.map((specialty, index) => (
                    <span key={index} className="px-4 py-1.5 bg-foodred-50/50 text-foodred-600 rounded-full text-sm font-medium hover:bg-foodred-100/50">
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { label: "Total Earned", value: `$${chef.earned}` },
                    { label: "Food Menu", value: chef.menuCount },
                    { label: "Recipes", value: chef.recipeCount },
                    { label: "Followers", value: chef.followers },
                    { label: "Reviews", value: chef.rating, icon: Star }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-4 rounded-xl bg-foodred-50/30 hover:bg-foodred-50/50 backdrop-blur-sm">
                      <div className="font-semibold text-2xl text-foodred-600 flex items-center justify-center gap-1">
                        {stat.value}
                        {stat.icon && <stat.icon className="w-5 h-5 text-foodred-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="w-full justify-start bg-background/90 backdrop-blur border-b rounded-none px-4">
              <TabsTrigger value="menu" className="flex-1 sm:flex-none text-lg">Menu</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 sm:flex-none text-lg">Reviews</TabsTrigger>
              <TabsTrigger value="about" className="flex-1 sm:flex-none text-lg">About</TabsTrigger>
            </TabsList>
            
            <TabsContent value="menu" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chef.topDishes.map((dish, index) => (
                  <FoodCard key={index} item={dish} variant="default" hideAuthor={true} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <ReviewSection 
                reviews={chef.reviews.map(review => ({
                  ...review,
                  verified: true,
                  orderId: `#${Math.random().toString(36).substr(2, 9)}`,
                  chefName: chef.name
                }))}
                type="chef"
                title="What People Say"
                className="mt-0"
              />
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card className="p-6 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
                <h3 className="text-xl font-semibold mb-4 text-foreground">About {chef.name}</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="whitespace-pre-line">{chef.bio}</p>
                  <div className="pt-4 border-t border-border">
                    <h4 className="font-medium mb-2 text-foreground">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {chef.specialties.map((specialty, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-foodred-50/30 text-foodred-600 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ChefProfile;
