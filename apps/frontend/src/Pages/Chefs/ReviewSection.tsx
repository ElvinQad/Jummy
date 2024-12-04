import React from "react";
import { Star, ChefHat, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
  dishName?: string;
  chefName?: string;
  orderId?: string;
  verified?: boolean;
}

interface ReviewSectionProps {
  reviews: Review[];
  title?: string;
  type: 'dish' | 'chef';
  className?: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ 
  reviews,
  title,
  type,
  className
}) => {
  if (!reviews.length) return null;

  const defaultTitle = type === 'chef' ? "Chef Reviews" : "Food Reviews";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("w-full", className)}
    >
      <div className="text-center space-y-4 mb-12">
        <h3 className="text-2xl font-semibold flex items-center justify-center gap-2">
          {type === 'chef' ? (
            <ChefHat className="w-6 h-6 text-foodred-500" />
          ) : (
            <Utensils className="w-6 h-6 text-foodred-500" />
          )}
          {title || defaultTitle}
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {type === 'chef' 
            ? "What customers say about this chef's service and food quality"
            : "Customer experiences with this dish"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/45",
              "p-6 rounded-xl",
              "border border-border",
              "shadow-sm hover:shadow-lg transition-all duration-300",
              "hover:border-primary/20",
              "relative overflow-hidden",
              "border-l-4 border-l-primary" // Removed type condition to apply to both
            )}
          >
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={review.avatar} 
                alt={`${review.user}'s avatar`} 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-offset-2 ring-foodred-100 dark:ring-foodred-800"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{review.user}</h4>
                  {review.verified && (
                    <span className="text-xs bg-foodred-50 text-foodred-600 dark:bg-foodred-900/30 
                      dark:text-foodred-400 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-foodred-500 rounded-full"></span>
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < review.rating 
                          ? "fill-foodred-500 text-foodred-500" 
                          : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"
                      )}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {review.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {type === 'dish' && review.dishName && (
              <div className="text-sm text-foodred-600 dark:text-foodred-400 font-medium mb-2">
                Ordered: {review.dishName}
              </div>
            )}

            {type === 'chef' && review.orderId && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Order #{review.orderId}
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {review.comment}
            </p>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(review.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
              {type === 'chef' && review.chefName && (
                <span className="text-sm text-foodred-600 dark:text-foodred-400 font-medium">
                  Chef: {review.chefName}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ReviewSection;
