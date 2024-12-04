import { Chef } from "../../types/kitchen";
import React, { useState, useCallback } from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { 
  Search, 
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import ChefCard from "../../components/ChefCard";
import { 
  containerVariants, 
  itemVariants, 
  fadeInVariants,
  filterItems,
  getPaginationData
} from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { FilterSheet, type FilterOption } from "../../components/ui/filter-sheet";
import ReviewSection from "./ReviewSection";

// ...existing imports...

interface Review {
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

// Modify the Filters interface to match the filter options
interface Filters {
  speciality: string;  // Changed from 'cuisine' to match filterOptions
  rating: number;
  location: string;

}

const ITEMS_PER_PAGE = 9;

const ChefList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Update the initial filters state
  const [filters, setFilters] = useState<Filters>({
    speciality: 'all',  // Changed from 'cuisine' to match filterOptions
    rating: 0,
    location: 'all'
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isLoading = false;
  
  const chefs: Chef[] = [
    {
      id: 1,
      name: "Sanzida Laila Trisha",
      image: "assets/images/kitchen/1.png",
      avatar: "assets/images/chef/author/happyportrait.png",
      authorImage: "assets/images/chef/author/happyportrait.png",
      location: "Dhaka, Bangladesh",
      speciality: "Bengali Cuisine",
      rating: 4.8,
      earned: "2,890.00",
      menuCount: 96,
      recipeCount: 45
    },
    {
      id: 2,
      name: "Maria Rodriguez",
      image: "assets/images/kitchen/2.png",
      avatar: "assets/images/chef/author/2.png",
      authorImage: "assets/images/chef/author/2.png",
      location: "Delhi, India",
      speciality: "Indian Cuisine",
      rating: 4.9,
      earned: "3,200.00",
      menuCount: 78,
      recipeCount: 52
    },
    {
      id: 3,
      name: "Li Wei",
      image: "assets/images/kitchen/3.png",
      avatar: "assets/images/chef/author/3.png",
      authorImage: "assets/images/chef/author/3.png",
      location: "Beijing, China",
      speciality: "Chinese Cuisine",
      rating: 4.7,
      earned: "2,750.00",
      menuCount: 85,
      recipeCount: 38
    },
    {
      id: 4,
      name: "Ahmed Hassan",
      image: "assets/images/kitchen/4.png",
      avatar: "assets/images/chef/author/4.png",
      authorImage: "assets/images/chef/author/4.png",
      location: "Cairo, Egypt",
      speciality: "Bengali Cuisine",
      rating: 4.6,
      earned: "2,450.00",
      menuCount: 62,
      recipeCount: 33
    },
    {
      id: 5,
      name: "Sarah Johnson",
      image: "assets/images/kitchen/5.png",
      avatar: "assets/images/chef/author/5.png",
      authorImage: "assets/images/chef/author/5.png",
      location: "New York, USA",
      speciality: "Indian Cuisine",
      rating: 4.9,
      earned: "3,500.00",
      menuCount: 92,
      recipeCount: 48
    }
  ];

  const reviews: Review[] = [
    {
      user: "John Doe",
      rating: 5,
      comment: "Amazing food!",
      date: "2021-09-01",
      avatar: "assets/images/user/johndoe.png",
    },
    
  ];

  // Update the filterItems call to use the correct filter keys
  const filteredChefs = filterItems(chefs, {
    searchFields: ['name', 'speciality', 'location'],
    searchQuery,
    filters: {
      speciality: filters.speciality === 'all' ? '' : filters.speciality,
      rating: filters.rating,
      location: filters.location
    }
  });

  const { pages, startIndex, endIndex } = getPaginationData({
    currentPage,
    totalItems: filteredChefs.length,
    itemsPerPage: ITEMS_PER_PAGE
  });

  const paginatedChefs = filteredChefs.slice(startIndex, endIndex);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  }, []);

  // Update filterOptions to explicitly type the id field
const filterOptions: FilterOption<keyof Filters>[] = [
  {
    id: 'speciality', // TypeScript will ensure this matches keyof Filters
    label: 'Cuisine Type',
    type: 'select',
    options: [
      { value: 'Bengali Cuisine', label: 'Bengali' },
      { value: 'Indian Cuisine', label: 'Indian' },
      { value: 'Chinese Cuisine', label: 'Chinese' },
    ],
    value: filters.speciality,
    defaultValue: 'all',
  },
  {
    id: 'rating', // TypeScript will ensure this matches keyof Filters
    label: 'Minimum Rating',
    type: 'slider',
    range: { min: 0, max: 5, step: 0.5 },
    value: filters.rating,
    defaultValue: 0,
  },
];

  // Update handleFilterChange to include type safety
  const handleFilterChange = useCallback((filterId: keyof Filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [filterId]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  // Update handleResetFilters to reset all filters
  const handleResetFilters = useCallback(() => {
    setFilters({
      speciality: 'all',
      rating: 0,
      location: 'all',
    });
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  // Add error handling for empty states
  if (!chefs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No chefs available at the moment.</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen relative bg-background py-20"
    >
           <div className="absolute left-0 top-0 w-auto h-[21rem] md:h-[24rem] pointer-events-none -z-10">
        <img src="assets/images/banner/shape/02.png" alt="decorative shape" className="w-full h-full object-fit" />
      </div>
      <div className="absolute right-0 bottom-0 w-auto h-[21rem] md:h-[24rem] pointer-events-none -z-10">
        <img src="assets/images/banner/shape/01.png" alt="decorative shape" className="w-full h-full object-fit" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-5 mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            Explore Our Home Chefs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Discover talented home chefs in your area and experience authentic homemade cuisine
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search chefs by name or cuisine..."
              className="pl-10 bg-background border-border"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <FilterSheet<keyof Filters>
              filters={filterOptions}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                onClick={() => setSearchQuery("")}
                className="hover:bg-accent"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6 text-muted-foreground">
          Found {filteredChefs.length} chefs {searchQuery && `for "${searchQuery}"`}
        </div>

        {/* Chefs Grid */}
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
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading chefs...</p>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {paginatedChefs.map((chef) => (
              <motion.div 
                key={`chef-${chef.id}`} 
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="bg-card rounded-lg shadow-lg"
              >
                <ChefCard chef={chef} variant="default" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

        {/* Pagination */}
        {filteredChefs.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-24">
            <Button 
              variant="outline" 
              className="border-border hover:bg-accent"
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
                    ? "bg-primary text-primary-foreground" 
                    : "border-border hover:bg-accent"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="border-border hover:bg-accent"
              disabled={currentPage === pages.length}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Reviews Section */}
        <ReviewSection reviews={reviews} title="Last reviews" type="chef"/>
      </div>
    </motion.div>
  );
};

export default ChefList;
