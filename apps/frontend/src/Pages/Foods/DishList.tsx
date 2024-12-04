import React, { useState, useCallback, useEffect } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Search, 
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import FoodCard from "../../components/FoodCard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  containerVariants, 
  itemVariants, 
  fadeInVariants,
  filterItems,
  getPaginationData
} from "../../lib/utils";
import { FilterSheet, type FilterOption } from "../../components/ui/filter-sheet";
import ReviewSection from "../Chefs/ReviewSection";

const ITEMS_PER_PAGE = 9;

const DishList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleLoadingState = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Your filtering logic here
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    handleLoadingState();
  }, [searchQuery, selectedCategory, handleLoadingState]);

  const categories = [
    { id: "all", name: "All Foods" },
    { id: "plov", name: "Plov" },
    { id: "kebab", name: "Kebab" },
    { id: "dolma", name: "Dolma" },
    { id: "qutab", name: "Qutab" },
    { id: "desserts", name: "Desserts" },
  ];

  const foods = [
    {
      id: 1,
      title: "Shah Plov",
      image: "/assets/images/foods/plov.png",
      authorImage: "/assets/images/chef/author/1.png",
      price: 15.99,
      rating: 4.8,
      availability: "Daily",
      servings: 4,
      location: "Baku",
      category: "plov"
    },
    {
      id: 2,
      title: "Lula Kebab",
      image: "/assets/images/foods/kebab.png",
      authorImage: "/assets/images/chef/author/2.png",
      price: 12.99,
      rating: 4.7,
      availability: "Daily",
      servings: 2,
      location: "Ganja",
      category: "kebab"
    },
    {
      id: 3,
      title: "Grape Dolma",
      image: "/assets/images/foods/dolma.png",
      authorImage: "/assets/images/chef/author/3.png",
      price: 13.99,
      rating: 4.9,
      availability: "Daily",
      servings: 3,
      location: "Sheki",
      category: "dolma"
    },
    {
      id: 4,
      title: "Meat Qutab",
      image: "/assets/images/foods/qutab.png",
      authorImage: "/assets/images/chef/author/4.png",
      price: 8.99,
      rating: 4.6,
      availability: "Daily",
      servings: 2,
      location: "Baku",
      category: "qutab"
    },
    {
      id: 5,
      title: "Pakhlava",
      image: "/assets/images/foods/pakhlava.png",
      authorImage: "/assets/images/chef/author/5.png",
      price: 10.99,
      rating: 4.8,
      availability: "Daily",
      servings: 4,
      location: "Ganja",
      category: "desserts"
    }
  ];

  const filteredFoods = filterItems(foods, {
    searchFields: ['title', 'category'],
    searchQuery,
    filters: {
      category: selectedCategory === 'all' ? '' : selectedCategory
    }
  });

  const { pages, startIndex, endIndex } = getPaginationData({
    currentPage,
    totalItems: filteredFoods.length,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const totalPages = pages.length;
  const paginatedFoods = filteredFoods.slice(startIndex, endIndex);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  const [filters, setFilters] = useState({
    sort: 'all',
    priceRange: 0, // Change initial value to 0
    category: 'all',
  });

  const filterOptions: FilterOption[] = [
    {
      id: 'sort',
      label: 'Sort By',
      type: 'select',
      options: [
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'rating', label: 'Highest Rated' },
      ],
      value: filters.sort,
      defaultValue: 'all',  // Explicitly set defaultValue
    },
    {
      id: 'priceRange',
      label: 'Price Range',
      type: 'slider',
      range: { min: 0, max: 100, step: 1 },
      value: filters.priceRange,
      defaultValue: 100,  // Add defaultValue for slider
    },
  ];

  const handleFilterChange = useCallback((filterId: string, value: string | number) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
    if (filterId === 'category') {
      setSelectedCategory(value as string);
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters({
      sort: 'all',
      priceRange: 0,
      category: 'all',
    });
    setSelectedCategory('all');
    setSearchQuery('');
    setCurrentPage(1); // Reset to first page
  }, []);

  // Add reviews data
  const reviews = [
    {
      user: "John Doe",
      rating: 5,
      comment: "Amazing food and great service!",
      date: "2021-09-01",
      avatar: "/assets/images/user/johndoe.png",
    },
    // Add more reviews as needed
  ];

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-b from-gradient-light dark:from-gradient-dark to-gradient-lightEnd dark:to-gradient-darkEnd py-20"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-5 mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foodred-600 to-foodred-500 bg-clip-text text-transparent dark:from-foodred-500 dark:to-foodred-400">
            Explore Delicious Homemade Foods
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg dark:text-gray-400">
            Discover authentic homemade dishes from talented home chefs in your area
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap gap-3 mb-8 justify-center"
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Badge
                className={`px-4 py-2 text-sm cursor-pointer transition-all ${
                  selectedCategory === category.id
                    ? "bg-foodred-500 text-white hover:bg-foodred-600 dark:hover:bg-foodred-700"
                    : "bg-background text-foreground hover:bg-accent dark:bg-dark-primary dark:text-gray-200 dark:hover:bg-dark-hover"
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search foods by name..."
              className="pl-10 bg-background dark:bg-dark-primary dark:text-gray-200 dark:border-dark-border dark:focus:border-foodred-500"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <FilterSheet
              filters={filterOptions}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                className="hover:bg-accent dark:hover:bg-dark-hover dark:text-gray-200" 
                onClick={() => setSearchQuery("")}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-muted-foreground dark:text-gray-400"
        >
          Found {filteredFoods.length} dishes {searchQuery && `for "${searchQuery}"`}
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              variants={fadeInVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center h-64 gap-4"
            >
              <Loader2 className="w-8 h-8 animate-spin text-foodred-500 dark:text-foodred-400" />
              <p className="text-muted-foreground dark:text-gray-400">Loading dishes...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {paginatedFoods.map((food) => (
                <motion.div 
                  key={food.id} 
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <FoodCard item={food} variant="default" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredFoods.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-24">
            <Button 
              variant="outline" 
              className="border-border hover:bg-accent dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-hover"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {pages.map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  className={page === currentPage 
                    ? "bg-foodred-500 dark:bg-foodred-600 hover:bg-foodred-600 dark:hover:bg-foodred-700" 
                    : "border-border hover:bg-accent dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-hover"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="border-border hover:bg-accent dark:border-dark-border dark:text-gray-200 dark:hover:bg-dark-hover"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

       
        <ReviewSection 
          reviews={reviews} 
          title="Last reviews" 
          type="dish"
        />
      </div>
    </motion.div>
  );
};
export default DishList;