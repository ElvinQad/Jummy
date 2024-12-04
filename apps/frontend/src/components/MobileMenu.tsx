import React, { useState } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ThemeToggle } from './ThemeToggle'

interface MenuItem {
  title: string;
  path?: string;
  submenu?: MenuItem[];
}

const menuAnimation = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: { type: "spring", damping: 25, stiffness: 500 }
  }
};

const submenuAnimation = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: "auto", 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

const menuItems: MenuItem[] = [
  {
    title: 'Home',
    path: '/'
  },
  {
    title: 'About us',
    path: '/about'
  },
  {
    title: 'Contact',
    path: '/contact'
  },
  {
    title: 'Chefs',
    path: '/chefs',
    submenu: [
      { title: 'All Chefs', path: '/chefs' },
      { title: 'Featured Chefs', path: '/chefs/featured' }
    ]
  },
  {
    title: 'Dishes',
    path: '/dishes',
    submenu: [
      { title: 'All Dishes', path: '/dishes' },
      { title: 'By Category', path: '/dishes/category/all' },
      { title: 'Popular Dishes', path: '/dishes/category/popular' }
    ]
  }
];

const MobileMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeMenus, setActiveMenus] = useState<string[]>([]);
  

  const toggleMenu = (index: string): void => {
    if (activeMenus.includes(index)) {
      setActiveMenus(activeMenus.filter(item => item !== index));
    } else {
      setActiveMenus([...activeMenus, index]);
    }
  };

  const renderMenuItem = (item: MenuItem, index: string, depth: number = 0): React.ReactNode => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = activeMenus.includes(index);

    return (
      <motion.li
        key={index}
        initial={false}
        className="border-b border-border/10 last:border-none"
      >
        <motion.div
          whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
          className={`flex items-center justify-between p-4 
            ${depth > 0 ? 'pl-8' : ''} 
            ${isActive ? 'text-foodred-500' : ''}
            transition-all duration-200`}
          onClick={() => hasSubmenu && toggleMenu(index)}
        >
          {item.path ? (
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex items-center space-x-2 font-medium tracking-wide w-full
                ${isActive ? 'text-foodred-500' : 'hover:text-foodred-500'}
              `}
            >
              {item.title}
            </NavLink>
          ) : (
            <span className="font-medium tracking-wide cursor-pointer w-full">
              {item.title}
            </span>
          )}
          {hasSubmenu && (
            <motion.span
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          )}
        </motion.div>
        <AnimatePresence>
          {hasSubmenu && isActive && (
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={submenuAnimation}
              className="bg-muted/30 overflow-hidden"
            >
              {item.submenu?.map((subItem, subIndex) =>
                renderMenuItem(subItem, `${index}-${subIndex}`, depth + 1)
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.li>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={menuAnimation}
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[110]"
        >
          <div className="h-full flex flex-col">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-border/10">
                {menuItems.map((item, index) => renderMenuItem(item, index.toString()))}
              </ul>
            </div>

            <div className="border-t p-4 space-y-4 bg-background/80 backdrop-blur-sm">
              <div className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search Here..."
                  className="pr-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-foodred-500"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 text-muted-foreground hover:text-foodred-500"
                >
                  <Search size={18} />
                </Button>
              </div>
              <div className="flex gap-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;