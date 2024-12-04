import { useEffect } from "react";
import useAuthStore from '../../lib/stores/authStore';


// Function to check if a token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const expiry = decodedPayload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (e) {
    console.error("Failed to parse token", e);
    return true; // Treat invalid or malformed token as expired
  }
};

const useAuthSync = () => {
  const { setIsAuthenticated, setUser, refreshToken } = useAuthStore();

  // Initialize state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("access_token");
      const userStr = localStorage.getItem("user");

      if (accessToken) {
        if (isTokenExpired(accessToken)) {
          try {
            await refreshToken();
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Token refresh failed during initialization", error);
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
          }
        } else {
          setIsAuthenticated(true);
        }
      } else {
        setIsAuthenticated(false);
      }

      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUser(user);
        } catch (e) {
          console.error("Failed to parse user from localStorage");
          setUser(null);
        }
      }
    };

    initializeAuth();
  }, [refreshToken, setIsAuthenticated, setUser]);

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === "access_token") {
        const newToken = e.newValue;
        if (newToken) {
          if (isTokenExpired(newToken)) {
            try {
              await refreshToken();
              setIsAuthenticated(true);
            } catch (error) {
              console.error("Token refresh failed during storage event", error);
              setIsAuthenticated(false);
              setUser(null);
              localStorage.removeItem("access_token");
              localStorage.removeItem("refresh_token");
              localStorage.removeItem("user");
            }
          } else {
            setIsAuthenticated(true);
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } else if (e.key === "user") {
        try {
          const user = e.newValue ? JSON.parse(e.newValue) : null;
          setUser(user);
        } catch (e) {
          console.error("Failed to parse user from storage event");
          setUser(null);
        }
      } else if (e.key === null) {
        // Storage was cleared
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshToken, setIsAuthenticated, setUser]);

  useEffect(() => {
    const handleTokenRefresh = async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error("Token refresh failed", error);
        // Optionally, handle token refresh failure
      }
    };

    window.addEventListener("token:refresh", handleTokenRefresh);

    return () => {
      window.removeEventListener("token:refresh", handleTokenRefresh);
    };
  }, [refreshToken]);
};

export default useAuthSync;
