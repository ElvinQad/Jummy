import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Heart, Bell, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import MenuItem from '../components/CartMenuItem';
import { ThemeToggle } from '../components/ThemeToggle';
import { BottomNav } from '../components/auth/BottomNav';
import { WishlistItem } from '../components/WishlistDropdown';
import { Button } from "../components/ui/button";
import WishlistDropdown from '../components/WishlistDropdown';
import CartDropdown, { type CartItem } from '../components/CartDropdown';
import { AuthDialog } from '../components/auth/AuthDialog';
import NotificationModal from '../components/NotificationModal';
import useAuthStore from '../lib/stores/authStore';
import { useNotificationStore } from '../lib/stores/notificationStore';
// Add this import
import { api } from '../lib/axios';

const Header: React.FC = () => {
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  // Replace the static state with dynamic state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
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
    },
    {
      title: 'Contact',
      path: '/contact'
    },
  ];

  const { 
    isAuthenticated, 
    setShowAuthModal, 
    setAuthMode, 
    clearAuth, 
  } = useAuthStore();
  const navigate = useNavigate();
  const { 
    notifications, 
    conversations, 
    unreadCount, 
    unreadMessagesCount,
    startPolling,
    stopPolling,
    fetchUserStatus,
    fetchAll  // Add this
  } = useNotificationStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserStatus();
      startPolling();
    } else {
      stopPolling();
    }
    
    return () => {
      stopPolling();
    };
  }, [isAuthenticated, startPolling, stopPolling, fetchUserStatus]);

  // Add new effect to fetch data
  useEffect(() => {
    if (isAuthenticated) {
      const user = localStorage.getItem('user'); // Assuming you store userId
      const userId = user ? JSON.parse(user).id : null;
      api.get(`/users/${userId}/items-and-counts`)
        .then(response => {
          setCartItems(response.data.cartItems);
          setWishlistItems(response.data.favorites);
        })
        .catch(error => console.error('Failed to fetch user items:', error));
    }
  }, [isAuthenticated]);

  const handleFeatureClick = (action: () => void) => {
    action();
  };

  const handleSignIn = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const goToAccount = () => {
    if (isAuthenticated) {
      navigate('/account');
    } else {
      handleSignIn();
    }
  };

  // Add this function
  const handleNotificationHover = () => {
    if (isAuthenticated) {
      fetchAll();
    }
  };

  return (
    <>
      <header className="hidden xl:block border-b sticky top-0 z-50 backdrop-blur-md bg-background/95 dark:bg-background/95 border-border transition-all duration-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0 transition-transform hover:scale-105 mt-6">
              <Link to="/" className="text-2xl font-bold text-foreground">
                <img src="src/assets/yammi.shop logo.svg" alt="logo" className="h-40" />
              </Link>
            </div>

            {/* Main Menu */}
            <nav className="hidden xl:flex space-x-2 text-foreground z-100">
              {menuItems.map((item, index) => (
                <MenuItem key={index} item={item} />
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4 relative z-10">
              <div className="flex items-center space-x-2">
                <ThemeToggle />
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFeatureClick(() => setWishlistOpen(!wishlistOpen))}
                    className="relative hover:bg-accent/80 transition-colors duration-200 rounded-full"
                  >
                    <Heart className="w-5 h-5 text-foreground" />
                    {isAuthenticated && wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-foodred-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFeatureClick(() => setCartOpen(!cartOpen))}
                    className="relative hover:bg-accent/80 transition-colors duration-200 rounded-full"
                  >
                    <ShoppingCart className="w-5 h-5 text-foreground" />
                    {isAuthenticated && cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-foodred-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleFeatureClick(() => setNotificationOpen(!notificationOpen))}
                    onMouseEnter={handleNotificationHover}  // Add this line
                    className="relative hover:bg-accent/80 transition-colors duration-200 rounded-full"
                  >
                    <Bell className="w-5 h-5 text-foreground" />
                    {isAuthenticated && (unreadCount + unreadMessagesCount) > 0 && (
                      <span className="absolute -top-1 -right-1 bg-foodred-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount + unreadMessagesCount}
                      </span>
                    )}
                  </Button>
                </div>

                {isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                      onClick={goToAccount}
                    >
                      <User className="w-5 h-5" />
                      <span>Account</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="hover:bg-accent/80 transition-colors duration-200 rounded-full"
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="default"
                    onClick={handleSignIn}
                    className="flex items-center space-x-2"
                  >
                    <User className="w-5 h-5" />
                    <span>Sign In</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Move the wishlist dropdown outside of the header */}
      <AnimatePresence>
        {wishlistOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
              onClick={() => setWishlistOpen(false)}
            />
            <div className="fixed right-0 top-20 z-[110]">
              <WishlistDropdown
                wishlistItems={wishlistItems}
                setWishlistOpen={setWishlistOpen}
              />
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Move the cart dropdown outside of the header */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
              onClick={() => setCartOpen(false)}
            />
            <div className="fixed right-0 top-20 z-[110]">
              <CartDropdown
                cartItems={cartItems}
                setCartOpen={setCartOpen}
              />
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notificationOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
              onClick={() => setNotificationOpen(false)}
            />
            <div className="fixed right-0 top-20 z-[110]">
              <NotificationModal
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
              />
            </div>
          </>
        )}
      </AnimatePresence>

      <BottomNav 
        cartItems={cartItems} 
        wishlistItems={wishlistItems}
      />

  
        <AuthDialog 
        />
    </>
  );
};

export default Header;