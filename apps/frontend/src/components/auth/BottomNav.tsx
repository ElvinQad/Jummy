import { useState } from 'react';
import { Heart, Menu, ShoppingCart, User, Bell } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "../ui/button";
import { AnimatePresence, motion } from 'framer-motion';
import CartDropdown, { CartItem } from '../CartDropdown';
import WishlistDropdown, { WishlistItem } from '../WishlistDropdown';
import MobileMenu from '../MobileMenu';
import { cn } from '../../lib/utils';
import NotificationModal from '../NotificationModal';
import useAuthStore from '../../lib/stores/authStore';
import {AuthDialog} from './AuthDialog';
import { useNotificationStore } from '../../lib/stores/notificationStore';

// New interfaces
interface NavItem {
  icon: typeof Heart;
  label: string;
  path?: string;
  requiresAuth: boolean;
  badge?: number;
  action?: () => void;
}

interface BottomNavProps {
  cartItems: CartItem[];
  wishlistItems: WishlistItem[];
}

// Navigation items configuration
const NAV_ITEMS: NavItem[] = [
  { 
    icon: Heart, 
    label: 'Wishlist', 
    path: '/wishlist',
    requiresAuth: true,
  },
  { 
    icon: Bell, 
    label: 'Notifications', 
    path: '/notifications',
    requiresAuth: true,
  },
  { 
    icon: ShoppingCart, 
    label: 'Cart', 
    path: '/cart',
    requiresAuth: true,
  },
  { 
    icon: Menu, 
    label: 'Menu',
    requiresAuth: false,
  },
  { 
    icon: User, 
    label: 'Account', 
    path: '/account',
    requiresAuth: false, // Changed to false to allow access to login/register
  },
];

// Animation variants
const bottomNavVariants = {
  hidden: { y: 0, opacity: 0 },
  visible: { 
    y: 0,
    opacity: 1,
    transition: { 
      duration: 0.2
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export const BottomNav: React.FC<BottomNavProps> = ({ 
  cartItems,
  wishlistItems,
}) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const location = useLocation();
  const { isAuthenticated, setShowAuthModal, setAuthMode } = useAuthStore();
  const navigate = useNavigate();
  const { 
    notifications, 
    conversations, 
    unreadCount, 
    unreadMessagesCount,
    fetchAll  // Add this
  } = useNotificationStore();

  const getBadgeCount = (label: string): number | undefined => {
    switch (label) {
      case 'Cart':
        return cartItems?.length;
      case 'Wishlist':
        return wishlistItems?.length;
      case 'Notifications':
        return unreadCount + unreadMessagesCount;
      default:
        return undefined;
    }
  };

  const handleNavClick = (item: NavItem) => {
    if (item.requiresAuth && !isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    switch (item.label) {
      case 'Wishlist':
        setWishlistOpen(prev => !prev);
        setCartOpen(false);
        setNotificationOpen(false);
        setMenuOpen(false);
        break;
      case 'Cart':
        setCartOpen(prev => !prev);
        setWishlistOpen(false);
        setNotificationOpen(false);
        setMenuOpen(false);
        break;
      case 'Notifications':
        // Fetch notifications data when clicking the notifications button
        if (isAuthenticated) {
          fetchAll();
        }
        setNotificationOpen(prev => !prev);
        setWishlistOpen(false);
        setCartOpen(false);
        setMenuOpen(false);
        break;
      case 'Menu':
        setMenuOpen(prev => !prev);
        setWishlistOpen(false);
        setCartOpen(false);
        setNotificationOpen(false);
        break;
      case 'Account':
        if (isAuthenticated) {
          navigate('/account');
        } else {
          setAuthMode('login');
          setShowAuthModal(true);
        }
        break;
    }
  };

  return (
    <>
      <motion.div
        variants={bottomNavVariants}
        initial="hidden"
        animate="visible"
        className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm xl:hidden z-50 w-full safe-area-bottom pb-safe overflow-x-hidden"
      >
        <nav className="flex justify-around items-center h-16 mx-auto px-2 max-w-screen-xl">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const badgeCount = getBadgeCount(item.label);

            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                disabled={item.requiresAuth && !isAuthenticated}
                className={cn(
                  "flex flex-col items-center gap-0.5 relative p-1 h-auto rounded-none",
                  "transition-colors duration-200",
                  isActive && "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                )}
                onClick={() => handleNavClick(item)}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {badgeCount !== undefined && badgeCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-foodred-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    {badgeCount}
                  </motion.span>
                )}
                <span className={cn(
                  "text-[10px] leading-none",
                  isActive && "text-primary",
                  "transition-colors duration-200"
                )}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </nav>
      </motion.div>

      <AnimatePresence>
        {(wishlistOpen || cartOpen || notificationOpen) && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[45]"
            onClick={() => {
              setWishlistOpen(false);
              setCartOpen(false);
              setNotificationOpen(false);
            }}
          />
        )}
        {wishlistOpen && (
          <motion.div
            key="wishlist-dropdown"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed inset-x-0 bottom-[4.5rem] z-[110] px-4"
          >
            <div className="mx-auto max-w-screen-xl">
              <div className="max-h-[50vh] overflow-y-auto rounded-lg">
                <WishlistDropdown wishlistItems={wishlistItems} setWishlistOpen={setWishlistOpen} />
              </div>
            </div>
          </motion.div>
        )}
        {cartOpen && (
          <motion.div
            key="cart-dropdown"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed inset-x-0 bottom-[4.5rem] z-[110] px-4"
          >
            <div className="mx-auto max-w-screen-xl">
              <div className="max-h-[50vh] overflow-y-auto rounded-lg">
                <CartDropdown cartItems={cartItems} setCartOpen={setCartOpen} />
              </div>
            </div>
          </motion.div>
        )}
        {notificationOpen && (
          <motion.div
            key="notification-modal"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed inset-x-0 bottom-[4.5rem] z-[110] px-4"
          >
            <NotificationModal 
              isOpen={notificationOpen}
              onClose={() => setNotificationOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

     
        <AuthDialog 
        />
      
    </>
  );
};
