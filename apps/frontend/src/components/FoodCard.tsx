import { Star, ShoppingCart, Focus, Home } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from 'framer-motion';
import { FoodItem } from '../types/kitchen';


interface FoodCardProps {
  item: FoodItem;
  variant?: 'popular' | 'default';
  hideAuthor?: boolean;
}

const FoodCard: React.FC<FoodCardProps> = ({ 
  item, 
  variant = "popular", 
  hideAuthor = false 
}) => {
  const isPopular: boolean = variant === "popular";

  const renderRating = (rating: number): JSX.Element => (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1 px-2 py-1 rounded-full bg-background/95 shadow-lg"
    >
      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      <span className="font-medium text-foreground">{rating}</span>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group overflow-hidden border-none shadow-lg hover:shadow-xl bg-background">
        <div className="relative">
          {/* Image Container with Hover Animation */}
          <motion.div 
            className={`relative overflow-hidden ${isPopular ? "h-64" : "h-56"}`}
            whileHover="hover"
          >
            <motion.img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover"
              variants={{
                hover: {
                  scale: 1.1,
                  transition: { duration: 0.4 }
                }
              }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent dark:from-black/80"
              variants={{
                hover: {
                  opacity: 0.8,
                  transition: { duration: 0.2 }
                }
              }}
            />
          </motion.div>

          {/* Animated Badges */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Badge className="bg-white text-foodred-600 hover:bg-white/90">
                ${item.price}
              </Badge>
            </motion.div>
            {renderRating(item.rating)}
          </div>
        </div>

        <CardContent className="p-4">
          {!hideAuthor && (
            <motion.div 
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-background shadow-md"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img 
                  src={item.authorImage} 
                  alt="author" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h3 
                  className="font-semibold text-lg text-foreground truncate"
                  whileHover={{ color: 'hsl(var(--primary))' }}
                >
                  {item.title}
                </motion.h3>
                <p className="text-sm text-muted-foreground">
                  Available on <span className="text-foodred-500">{item.availability}</span>
                </p>
              </div>
            </motion.div>
          )}

          {hideAuthor && (
            <motion.div 
              className="mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.h3 
                className="font-semibold text-lg text-foreground"
                whileHover={{ color: 'hsl(var(--primary))' }}
              >
                {item.title}
              </motion.h3>
              <p className="text-sm text-muted-foreground">
                Available on <span className="text-foodred-500">{item.availability}</span>
              </p>
            </motion.div>
          )}

          {/* Animated Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.div className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="default" 
                className="w-full bg-foodred-500 hover:bg-foodred-600 text-white"
              >
                Order Now
              </Button>
            </motion.div>
            {!isPopular && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  size="icon" 
                  variant="secondary"
                  className="bg-background hover:bg-accent border border-border"
                >
                  <ShoppingCart size={18} className="text-foreground" />
                </Button>
              </motion.div>
            )}
          </div>

          {/* Animated Footer Info */}
          <motion.div 
            className="flex items-center justify-between mt-4 pt-4 border-t border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center text-sm text-muted-foreground"
              whileHover={{ scale: 1.05 }}
            >
              <Focus size={15} className="mr-1.5" />
              <span>{item.servings} Servings</span>
            </motion.div>
            {!hideAuthor && (
              <motion.div 
                className="flex items-center text-sm text-muted-foreground"
                whileHover={{ scale: 1.05 }}
              >
                <Home size={15} className="mr-1.5" />
                <span>{item.location}</span>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FoodCard;
