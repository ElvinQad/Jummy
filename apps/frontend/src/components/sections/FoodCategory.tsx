import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { api } from "../../lib/axios";

interface FoodType {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string;
}

interface FoodTypesResponse {
  data: FoodType[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
}

const FoodCategory: React.FC = () => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [itemsToShow, setItemsToShow] = useState<number>(4);
  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFoodTypes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<FoodTypesResponse>('/food-types');
      setFoodTypes(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load food categories');
      console.error('Error fetching food types:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getItemsToShow = (): number => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      if (window.innerWidth < 1280) return 3;
      return 4;
    }
    return 4;
  };

  useEffect(() => {
    const handleResize = (): void => setItemsToShow(getItemsToShow());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchFoodTypes();
  }, []);

  const visibleCategories = useMemo(() => {
    if (foodTypes.length === 0) return [];
    const totalCategories = foodTypes.length;
    return Array.from({ length: itemsToShow }, (_, index) => {
      const actualIndex = ((startIndex + index) % totalCategories + totalCategories) % totalCategories;
      return foodTypes[actualIndex];
    });
  }, [startIndex, itemsToShow, foodTypes]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const swipeThreshold = 50;
    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0) {
        setStartIndex((prev) => (prev - 1 + foodTypes.length) % foodTypes.length);
      } else {
        setStartIndex((prev) => (prev + 1) % foodTypes.length);
      }
    }
  };

  if (isLoading) {
    return (
      <section className="w-full py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <Card className="p-4 md:p-8">
            <div className="text-center">Loading food categories...</div>
          </Card>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <Card className="p-4 md:p-8">
            <div className="text-center text-red-500">{error}</div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-6 md:py-12 bg-gradient-to-b from-background via-background/50 to-foodred-50/10 dark:from-dark-background dark:via-dark-primary dark:to-dark-background">
      <div className="container px-4 md:px-6">
        <Card className="p-4 md:p-8 backdrop-blur-sm dark:bg-dark-card/50 dark:border-dark-border">
          <div className="text-center space-y-4 mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter sm:text-5xl dark:text-white">
              Browse Food Category
            </h2>
            <p className="mx-auto max-w-[800px] text-gray-500 dark:text-gray-400 text-base md:text-lg lg:text-xl">
              Completely network impactful users whereas next-generation applications engage out thinking via tactical action.
            </p>
          </div>

          <div className="relative px-8 md:px-12">
            <motion.div 
              className="flex items-center gap-4 md:gap-6 lg:gap-8"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            >
              <AnimatePresence mode="popLayout">
                {visibleCategories.map((category, index) => (
                  <motion.div
                    key={`${category.id}-${index}`}
                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    whileTap={{ scale: 0.95 }} // Add feedback on tap
                  >
                    <Card
                      className={cn(
                        "group cursor-pointer",
                        "border-none shadow-md hover:shadow-xl",
                        "bg-gradient-to-br from-foodred-50 to-foodred-100",
                        "dark:from-dark-accent dark:to-dark-primary dark:hover:shadow-dark-accent/20",
                        "transition-all duration-300 transform hover:-translate-y-2"
                      )}
                    >
                      <motion.div 
                        className="p-6 md:p-8 text-center space-y-4 md:space-y-5"
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-foodred-100 to-foodred-200 dark:from-dark-muted dark:to-dark-primary p-3">
                          <motion.div 
                            className="w-full h-full rounded-full overflow-hidden relative bg-white dark:bg-dark-accent shadow-inner"
                            whileHover={{ scale: 1.05 }}
                          >
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 dark:filter dark:brightness-90"
                            />
                          </motion.div>
                        </div>
                        <p className="font-semibold text-base md:text-lg lg:text-xl text-foodred-900 group-hover:text-foodred-600 dark:text-gray-200 dark:group-hover:text-white transition-colors">
                          {category.name}
                        </p>
                        {category.description && (
                          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400">
                            {category.description}
                          </p>
                        )}
                      </motion.div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <Button
              variant="outline"
              size="icon"
              className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full hidden md:flex w-12 h-12 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-accent"
              onClick={() => setStartIndex((prev) => (prev - 1 + foodTypes.length) % foodTypes.length)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full hidden md:flex w-12 h-12 dark:border-dark-border dark:bg-dark-card dark:hover:bg-dark-accent"
              onClick={() => setStartIndex((prev) => (prev + 1) % foodTypes.length)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default FoodCategory;