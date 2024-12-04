import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';

interface AnimatedPageProps {
  children: ReactNode;
}

const AnimatedPage: FC<AnimatedPageProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
