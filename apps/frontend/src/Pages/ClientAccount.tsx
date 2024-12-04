'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Settings, History, Heart, LogOut, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import useAuthStore from '../components/auth/authStore';
import { useToast } from '../components/ui/use-toast'
import { api } from '../lib/axios'

interface Address {
  title: string;
  city: string;
  district: string;
  addressLine: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function ClientAccountPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Get user data from local storage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const [formData, setFormData] = useState({
    phone: userData?.phone || '',
  });

  const [addresses, setAddresses] = useState<Address[]>(
    userData?.profile?.addresses || []
  );
  const [newAddress, setNewAddress] = useState<Address>({
    title: '',
    city: '',
    district: '',
    addressLine: '',
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const { clearAuth } = useAuthStore();
  
  const handleSignOut = async () => {
    setIsLoading(true);
    await clearAuth();
    navigate('/');
    setIsLoading(false);
  }

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.patch(`/users/${userData.id}`, {
        phone: formData.phone,
        profile: {
          firstName: userData.profile.firstName,
          lastName: userData.profile.lastName,
          avatar: userData.profile.avatar,
          addresses: addresses
        }
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      
      toast({
        title: "Profile updated successfully",
      });

      setIsEditing(false);
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
      });
      
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    if (!newAddress.title || !newAddress.city || !newAddress.district || !newAddress.addressLine) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill all address fields",
      });
      return;
    }
    setAddresses([...addresses, newAddress]);
    setNewAddress({ title: '', city: '', district: '', addressLine: '' });
    setIsAddingAddress(false);
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  return (
    <div className="container px-4 md:px-6 py-6 md:py-12 space-y-6 md:space-y-8">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="text-center space-y-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foodred-600">My Account</h1>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="grid gap-6"
      >
        <motion.div variants={item}>
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-16 w-16 md:h-20 md:w-20">
                  <AvatarImage src={userData.profile.avatar} alt={`${userData.profile.firstName} ${userData.profile.lastName}`} />
                  <AvatarFallback>{userData.profile.firstName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <CardTitle className="text-2xl">{`${userData.profile.firstName} ${userData.profile.lastName}`}</CardTitle>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                </div>
                <div className="w-full sm:w-auto flex justify-center sm:justify-end gap-2 mt-4 sm:mt-0">
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      className="gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="gap-2"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                      <Button 
                        variant="default" 
                        className="gap-2"
                        onClick={handleSave}
                        disabled={isLoading}
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Addresses</h3>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingAddress(!isAddingAddress)}
                      >
                        {isAddingAddress ? 'Cancel' : 'Add Address'}
                      </Button>
                    </div>

                    {isAddingAddress && (
                      <Card className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Address Title</label>
                            <Input
                              value={newAddress.title}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Home, Work, etc."
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">City</label>
                            <Input
                              value={newAddress.city}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="City"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">District</label>
                            <Input
                              value={newAddress.district}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, district: e.target.value }))}
                              placeholder="District"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Address Line</label>
                            <Input
                              value={newAddress.addressLine}
                              onChange={(e) => setNewAddress(prev => ({ ...prev, addressLine: e.target.value }))}
                              placeholder="Address"
                            />
                          </div>
                        </div>
                        <Button
                          className="mt-4 w-full sm:w-auto"
                          onClick={handleAddAddress}
                        >
                          Add Address
                        </Button>
                      </Card>
                    )}

                    <div className="grid gap-4">
                      {addresses.map((address, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{address.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {address.city}, {address.district}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.addressLine}
                              </p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveAddress(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-foodred-600" />
                  Favorite Meals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Your favorite meals will appear here</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-foodred-600" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Your order history will appear here</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item} className="flex justify-center pt-4">
          <Button 
            variant="destructive" 
            className="gap-2" 
            onClick={handleSignOut}
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4" />
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
