import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import {  RegisterFormData, CountryCode } from "@jummy/shared-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import useAuthStore from './authStore';
import { PasswordInput } from './PasswordInput';
import { useToast } from "../ui/use-toast";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const COUNTRY_CODES: CountryCode[] = [
  { value: "+994", label: "AZ", id: "az" },
  { value: "+995", label: "GE", id: "ge" },
  { value: "+7", label: "RU", id: "ru" },
];

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess?: () => void;
}

export function Register({ onSwitchToLogin, onRegisterSuccess }: RegisterProps) {
  const [loading, setLoading] = useState(false);
  const registerUser = useAuthStore(state => state.register);
  const googleAuth = useAuthStore(state => state.googleAuth);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+994");
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch("password");

  const formatPhoneNumber = (value: string) => {
    let formattedValue = value.replace(/^0+/, '');
    return formattedValue.slice(0, 9);
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      const { confirmPassword, ...formDataWithoutConfirm } = data;
      const formData = {
        ...formDataWithoutConfirm,
        phone: `${selectedCountryCode}${formatPhoneNumber(data.phone)}`
      };

      await registerUser(formData, onRegisterSuccess);
    } catch (err: any) {
      const errorData = err.response?.data;
      toast({
        variant: "destructive",
        title: errorData?.error || "Error",
        description: errorData?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setLoading(true);
      await googleAuth(credentialResponse.credential || '', false, onRegisterSuccess);
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: error.response.data.message || "Account already exists. Please login instead.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Google Registration Failed",
          description: "Failed to register with Google. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast({
      variant: "destructive",
      title: "Google Registration Failed",
      description: "Failed to register with Google. Please try again.",
    });
  };

  return (
    <div className="w-full mb-20">
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-2.5">
        <div className="space-y-2">
          <div className="space-y-0.5">
            <Label htmlFor="register-name" className="text-xs text-gray-700 dark:text-gray-300">Name</Label>
            <Input
              {...register("name", { required: "Name is required" })}
              id="register-name"
              aria-describedby={errors.name ? "name-error" : undefined}
              placeholder="Enter your name"
              className="h-10 bg-input-light dark:bg-input-dark border-gray-200 dark:border-gray-800 rounded-lg 
                transition-input duration-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500
                dark:focus:ring-red-400/20 dark:focus:border-red-400"
            />
            {errors.name?.message && (
              <p id="name-error" className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="phone" className="text-xs text-gray-700 dark:text-gray-300">Phone Number</Label>
            <div className="flex gap-2">
              <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                <SelectTrigger className="w-[90px] h-9 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
                  <SelectValue placeholder="Code" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-950 dark:border-gray-800">
                  {COUNTRY_CODES.map((code) => (
                    <SelectItem key={code.id} value={code.value}>
                      {code.label} {code.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                {...register("phone", {
                  required: "Phone required",
                  pattern: {
                    value: /^[0-9]{6,9}$/,
                    message: "Invalid number"
                  },
                  onChange: (e) => {
                    e.target.value = formatPhoneNumber(e.target.value);
                  }
                })}
                type="tel"
                className="h-9 flex-1 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                placeholder="Phone number"
                maxLength={9}
              />
            </div>
            {errors.phone?.message && (
              <p className="text-red-500 text-xs">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-0.5">
            <Label htmlFor="register-email" className="text-xs text-gray-700 dark:text-gray-300">Email</Label>
            <Input
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email"
                }
              })}
              id="register-email"
              aria-describedby={errors.email ? "register-email-error" : undefined}
              type="email"
              placeholder="Enter your email"
              className="h-9 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
            />
            {errors.email?.message && (
              <p id="register-email-error" className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <PasswordInput
            id="register-password"
            label="Password"
            register={register("password", {
              required: "Password required",
              minLength: {
                value: 6,
                message: "Min 6 characters"
              }
            })}
            error={errors.password?.message}
            placeholder="Enter your password"
          />

          <PasswordInput
            id="register-confirm-password"
            label="Confirm Password"
            register={register("confirmPassword", {
              required: "Please confirm your password",
              validate: value => value === password || "Passwords do not match"
            })}
            error={errors.confirmPassword?.message}
            placeholder="Confirm your password"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full h-10 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg
            transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
            disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none
            shadow-lg hover:shadow-red-600/25"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-950">
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
            text="signup_with"
            shape="rectangular"
          />
        </div>

        <div className="mt-1">
          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
              onClick={onSwitchToLogin}
            >
              Login Here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

