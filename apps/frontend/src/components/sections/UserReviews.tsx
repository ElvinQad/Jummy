import  { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from "../ui/card";
import { cn } from "../../lib/utils";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  image: string;
  role: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "The homemade pasta was absolutely divine! Every bite was bursting with authentic flavors. The chef's attention to detail and use of fresh ingredients made this a memorable dining experience.",
    image: "../../assets/images/reviews/user1.jpg",
    role: "Culinary Enthusiast"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    comment: "I ordered their signature dish for a family gathering and it exceeded all expectations. The portions were generous, flavors were perfectly balanced, and the presentation was restaurant-quality!",
    image: "../../assets/images/reviews/user2.jpg",
    role: "Home Dining Connoisseur"
  },
  {
    id: 3,
    name: "Emily Williams",
    rating: 5,
    comment: "What a delightful culinary experience! The fusion of traditional and modern flavors was exceptional. The chef's passion for cooking truly shines through in every dish.",
    image: "../../assets/images/reviews/user3.jpg",
    role: "Gourmet Food Blogger"
  }
];

const UserReviews = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number): number => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number): void => {
    setCurrentIndex((prevIndex) => (
      (prevIndex + newDirection + reviews.length) % reviews.length
    ));
  };

  const renderStars = (rating: number): JSX.Element[] => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={cn(
          "w-5 h-5",
          index < rating ? "text-yellow-400" : "text-gray-300"
        )}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-b from-foodred-50/20 to-background dark:from-dark-primary/20 dark:to-dark-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl font-bold text-spice-700 dark:text-foodred-300">
            Delighted Diners Share Their Experience
          </h2>
          <p className="text-spice-600 dark:text-foodred-100 max-w-2xl mx-auto">
            Discover what our valued guests have to say about their culinary journey with us
          </p>
        </motion.div>

        <div className="relative h-[450px] max-w-4xl mx-auto overflow-hidden">
          <AnimatePresence initial={false} custom={currentIndex}>
            <motion.div
              key={currentIndex}
              custom={currentIndex}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              className="absolute w-full"
            >
              <Card className="bg-white/95 dark:bg-dark-primary/95 backdrop-blur-sm p-8 shadow-lg border-foodred-200 dark:border-dark-border">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-foodred-300 dark:border-foodred-600">
                    <img
                      src={reviews[currentIndex].image}
                      alt={reviews[currentIndex].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex space-x-1 mb-4">
                    {renderStars(reviews[currentIndex].rating)}
                  </div>
                  <p className="text-lg text-spice-700 dark:text-foodred-100 mb-6 italic leading-relaxed">
                    "{reviews[currentIndex].comment}"
                  </p>
                  <h4 className="font-semibold text-spice-800 dark:text-foodred-200">
                    {reviews[currentIndex].name}
                  </h4>
                  <p className="text-sm text-spice-600 dark:text-foodred-400">
                    {reviews[currentIndex].role}
                  </p>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 pb-4">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  currentIndex === index
                    ? "bg-primary dark:bg-foodred-500 w-6"
                    : "bg-primary/20 dark:bg-foodred-500/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserReviews;
