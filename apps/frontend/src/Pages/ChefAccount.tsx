'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar'
import { Settings, History, LogOut, ChefHat, UtensilsCrossed, Star, Users, Loader2, Check, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../lib/stores/authStore';
import { useState, useEffect } from 'react';
import { fadeIn, container, item } from '../utils/animations'
import { useToast } from '../components/ui/use-toast'
import { api } from '../lib/axios'

export default function ChefAccountPage() {
  const [userData, setUserData] = useState<Chef | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const navigate = useNavigate()
  const { clearAuth } = useAuthStore()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: '',
    specialties: [] as string[],
    phone: ''
  })

  useEffect(() => {
    try {
      const data = localStorage.getItem('user')
      if (data) {
        const parsed = JSON.parse(data)
        setUserData(parsed)
        setFormData({
          name: parsed.name || '',
          specialties: parsed.specialties || [],
          phone: parsed.phone || ''
        })
      }
    } catch {
      setError('Failed to load user data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.patch(`/users/${userData?.id}`, {
        name: formData.name,
        phone: formData.phone,
        specialties: formData.specialties
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      setUserData(response.data);
      
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

  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>
  }

  if (isLoading || !userData) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-foodred-600" />
      </div>
    )
  }

  const handleSignOut = async () => {
    setIsLoading(true);
    await clearAuth();
    navigate('/');
    setIsLoading(false);
  };
  return (
    <div className="container px-4 md:px-6 py-6 md:py-12 space-y-6 md:space-y-8">
      <motion.div
        initial="initial"
        animate="animate"
        variants={fadeIn}
        className="text-center space-y-6"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-foodred-600">Chef Dashboard</h1>
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
                  <AvatarImage src={userData?.avatar} alt={userData?.name} />
                  <AvatarFallback>{userData?.name?.[0] || 'C'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left">
                  <CardTitle className="text-xl md:text-2xl">{userData?.name}</CardTitle>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{userData?.rating} Rating</span>
                  </div>
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
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Specialties (comma-separated)</label>
                    <Input
                      value={formData.specialties.join(', ')}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        specialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      }))}
                      placeholder="Italian, Asian, Desserts"
                    />
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-foodred-600" />
                  Total Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userData.totalOrders}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-foodred-600" />
                  Followers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{userData.followers}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-foodred-600" />
                  Specialties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {(userData.specialties ?? []).map((specialty) => (
                    <span key={specialty} className="bg-foodred-100 text-foodred-600 px-2 py-1 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-foodred-600" />
                  My Menu Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Your menu items will appear here</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={item}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-foodred-600" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Recent orders will appear here</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item} className="flex justify-center pt-4">
          <Button 
            variant="destructive" 
            className="gap-2 w-full sm:w-auto" 
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
