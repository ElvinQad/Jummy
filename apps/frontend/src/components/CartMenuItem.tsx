import { ChevronDown} from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
interface MenuItem {
    title: string;
    path: string;
    submenu?: MenuItem[];
  }
  
  interface MenuItemProps {
    item: MenuItem;
  }
  
  const dropdownAnimation = {
    hidden: { opacity: 0, y: -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.2 }
    }
  };
  
  const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
    const location = useLocation();
    const isActive = location.pathname === item.path;
  
    if (item.submenu) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center space-x-2 px-4 py-2 font-medium tracking-wide ${
                isActive ? 'text-foodred-500' : 'text-gray-800 dark:text-light-foreground'
              }`}
            >
              {item.title}
              <motion.span
                animate={{ rotate: isActive ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 ml-1" />
              </motion.span>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dark:bg-dark-background dark:border-dark-border">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={dropdownAnimation}
            >
              {item.submenu.map((subitem, index) => (
                subitem.submenu ? (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger className="flex items-center justify-between w-full px-2 py-1.5 text-sm text-gray-800 hover:text-foodred-500 dark:text-light-foreground dark:hover:text-foodred-400">
                      {subitem.title}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" sideOffset={-5} className="dark:bg-dark-background dark:border-dark-border">
                      {subitem.submenu.map((nestedItem, idx) => (
                        <DropdownMenuItem key={idx} asChild>
                          <Link to={nestedItem.path} className="text-gray-800 hover:text-foodred-500 dark:text-light-foreground dark:hover:text-foodred-400">
                            {nestedItem.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <DropdownMenuItem key={index} asChild>
                    <Link to={subitem.path} className="text-gray-800 hover:text-foodred-500 dark:text-light-foreground dark:hover:text-foodred-400">
                      {subitem.title}
                    </Link>
                  </DropdownMenuItem>
                )
              ))}
            </motion.div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <NavLink
          to={item.path}
          className={({ isActive }) => `
            flex items-center space-x-2 px-4 py-2 font-medium tracking-wide
            ${isActive ? 'text-foodred-500' : 'text-gray-800 hover:text-foodred-500 dark:text-light-foreground dark:hover:text-foodred-400'}
          `}
        >
          {item.title}
        </NavLink>
      </motion.div>
    );
  };
  export default MenuItem;