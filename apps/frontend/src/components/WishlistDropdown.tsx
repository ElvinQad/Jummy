import React from 'react';
import { motion } from 'framer-motion';
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, Heart } from "lucide-react";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface WishlistDropdownProps {
  wishlistItems: WishlistItem[];
  setWishlistOpen: (open: boolean) => void;
}

const dropdownAnimation = {
  hidden: { opacity: 0, y: -5 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2 }
  }
};

const WishlistDropdown: React.FC<WishlistDropdownProps> = ({ wishlistItems, setWishlistOpen }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={dropdownAnimation}
    className="relative w-full sm:w-[400px]"
  >
    <Card className="w-full shadow-xl p-4 bg-light-background/98 dark:bg-dark-background/98 backdrop-blur-sm border-foodred-100 dark:border-dark-border relative z-[100]">
      <div className="flex justify-between items-center mb-4 border-b border-foodred-100 dark:border-dark-border pb-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-foodred-500" />
          <h3 className="font-semibold text-gray-800 dark:text-light-foreground">Wishlist ({wishlistItems.length})</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setWishlistOpen(false)}
          className="hover:text-foodred-500 hover:bg-foodred-50 dark:hover:bg-dark-hover transition-colors"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-foodred-200 dark:scrollbar-thumb-dark-muted scrollbar-track-transparent">
        {wishlistItems.map((item) => (
          <div key={item.id} className="flex items-center gap-4 py-3 border-b border-foodred-50 dark:border-dark-border group hover:bg-foodred-50/50 dark:hover:bg-dark-hover transition-colors px-2 rounded-lg">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-800 dark:text-light-foreground truncate">{item.name}</h4>
              <p className="text-sm text-foodred-500 dark:text-foodred-400 font-semibold mt-1">
                ${item.price.toFixed(2)}
              </p>
              <Button 
                size="sm" 
                variant="outline"
                className="mt-2 w-full hover:bg-foodred-100 dark:hover:bg-dark-hover hover:text-foodred-500"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  </motion.div>
);

export default WishlistDropdown;
