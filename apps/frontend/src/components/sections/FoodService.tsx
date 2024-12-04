import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from "../ui/card"
import { cn } from "../../lib/utils"

interface ServiceItem {
  step: string;
  image: string;
  title: string;
  color: string;
}

const FoodService: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const sequence: number[] = serviceItems.map((_, i) => i);
    let currentIndex = 0;

    const animateNext = (): void => {
      if (currentIndex >= sequence.length) {
        setIsAnimating(false);
        setHoveredIndex(null);
        return;
      }

      setHoveredIndex(sequence[currentIndex]);
      setTimeout(() => {
        setHoveredIndex(null);
        currentIndex++;
        setTimeout(animateNext, 300); // Delay before next card
      }, 1500); // Duration of hover effect
    };

    animateNext();
  }, [isAnimating]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startAnimation();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [startAnimation]);


  const serviceItems: ServiceItem[] = [
    {
      step: "01",
      image: "../../assets/images/service/01.png",
      title: "Choose Your Favorite",
      color: "from-orange-400 to-red-500"
    },
    {
      step: "02",
      image: "../../assets/images/service/02.png", 
      title: "HomeChef Will Cook",
      color: "from-red-400 to-pink-500"
    },
    {
      step: "03",
      image: "../../assets/images/service/03.png",
      title: "We Deliver Your Meals",
      color: "from-pink-400 to-purple-500"
    },
    {
      step: "04",
      image: "../../assets/images/service/04.png",
      title: "Eat And Enjoy",
      color: "from-purple-400 to-indigo-500"
    }
  ];

  const renderConnector = (index: number): React.ReactNode => {
    if (index < serviceItems.length - 1) {
      return (
        <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 items-center">
          <img 
            src={`../../assets/images/service/shape/0${index + 1}.png`} 
            className="w-18 h-8 animate-pulse" 
            alt={`Shape ${index + 1}`}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <section 
      ref={sectionRef} 
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-background via-background/50 to-foodred-50/10 dark:from-dark-background dark:via-dark-primary/50 dark:to-dark-background"
    >
      <div className="container mx-auto px-4">
        <div className={cn(
          "text-center mb-8 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4",
          isVisible ? 'animate-in fade-in-50 duration-500' : 'opacity-0'
        )}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How it Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            Completely network impactful users whereas next-generation applications engage out thinking via tactical action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16 relative">
          {serviceItems.map((item, index) => (
            <div key={index} className="relative flex justify-center">
              <Card 
                className={cn(
                  "aspect-square w-[200px] sm:w-[240px] lg:w-[280px] rounded-full overflow-hidden transition-all duration-300 border-0",
                  "bg-gradient-to-br from-white to-gray-50/80 dark:from-dark-primary dark:to-dark-secondary",
                  hoveredIndex === index && "translate-y-[-0.5rem] scale-105",
                  isVisible ? 'animate-in fade-in-50 slide-in-from-bottom-5 duration-500' : 'opacity-0'
                )}
                style={{ 
                  animationDelay: `${Math.min(index * 150, 450)}ms`,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
                onMouseEnter={() => !isAnimating && setHoveredIndex(index)}
                onMouseLeave={() => !isAnimating && setHoveredIndex(null)}
              >
                <div className={cn(
                  "relative h-full w-full",
                  hoveredIndex === index && "transform scale-105"
                )}>
                  <img 
                    src={item.image} 
                    alt={`Step ${item.step}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r",
                    item.color,
                    "transition-opacity duration-300",
                    hoveredIndex === index ? 'opacity-60 dark:opacity-70' : 'opacity-0'
                  )} />
                  
                  <div className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center",
                    "bg-black/40 dark:bg-black/60",
                    "transition-opacity duration-300",
                    hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  )}>
                    <div className={cn(
                      "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full text-white flex items-center justify-center",
                      "font-bold text-lg sm:text-xl mb-2 sm:mb-4 border-2 border-white",
                      `bg-gradient-to-r ${item.color}`
                    )}>
                      {item.step}
                    </div>
                    <h6 className="text-lg sm:text-xl font-bold text-white px-4 text-center">
                      {item.title}
                    </h6>
                  </div>
                </div>
              </Card>
              {renderConnector(index)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FoodService;