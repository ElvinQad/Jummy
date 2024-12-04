import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useForm } from "react-hook-form";
import { LoginFormData } from "../../../../../packages/shared-types/auth";
import useAuthStore from './authStore';
import { PasswordInput } from './PasswordInput';
import { useToast } from "../ui/use-toast";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface LoginProps {
  onSwitchToRegister: () => void;
  onLoginSuccess?: () => void;
}

export function Login({ onSwitchToRegister, onLoginSuccess }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const googleAuth = useAuthStore(state => state.googleAuth);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { toast } = useToast();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      await login(data, onLoginSuccess);
    } catch (err: any) {
      const errorData = err.response?.data;
      toast({
        variant: "destructive",
        title: errorData?.error || "Error",
        description: errorData?.message || "Login failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      await googleAuth(credentialResponse.credential || '', true, onLoginSuccess);
    } catch (error: any) {
      const errorMessage = error.description || error.message || "Failed to login with Google. Please try again.";
      toast({
        variant: "destructive",
        title: "Google Login Failed",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast({
      variant: "destructive",
      title: "Google Login Failed",
      description: "Failed to login with Google. Please try again.",
    });
  };

  return (
    <div className="w-full space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-login-email" className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</Label>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              id="auth-login-email"
              type="email"
              placeholder="Enter your email"
              className="h-10 bg-input-light dark:bg-input-dark border-gray-200 dark:border-gray-800 rounded-lg transition-input duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 dark:focus:ring-red-400/20 dark:focus:border-red-400 shadow-input-light dark:shadow-input-dark"
            />
            {errors.email?.message && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <PasswordInput
            id="password"
            label="Password"
            register={register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            error={errors.password?.message}
            placeholder="Enter your password"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full h-10 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-red-600/25">
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            "Login"
          )}
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950">
              or continue with
            </span>
          </div>
        </div>

        <div className={`w-full ${loading ? 'opacity-50 pointer-events-none cursor-wait' : ''}`}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            width="100%"
            text="continue_with"
            shape="rectangular"
          />
        </div>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          New to our platform?{" "}
          <button
            type="button"
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-200"
            onClick={onSwitchToRegister}
          >
            Sign Up Now
          </button>
        </p>
      </form>
    </div>
  );
}
