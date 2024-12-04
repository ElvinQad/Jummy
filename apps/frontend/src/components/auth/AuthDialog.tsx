import { AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Login } from "./Login";
import { Register } from "./Register";
import useAuthStore from '../../lib/stores/authStore';

export function AuthDialog() {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
  } = useAuthStore();

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {authMode === 'login' ? "Welcome Back!" : "Join Us Today"}
          </DialogTitle>
          <DialogDescription>
            {authMode === 'login'
              ? "Login to access your account"
              : "Create your account to get started"}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {authMode === 'login' ? (
            <Login 
              onSwitchToRegister={() => setAuthMode('register')} 
            />
          ) : (
            <Register 
              onSwitchToLogin={() => setAuthMode('login')} 
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
