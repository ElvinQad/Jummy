'use client'

import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ChefAccountPage from './ChefAccount'
import ClientAccountPage from './ClientAccount'
import { Loader2 } from 'lucide-react'
import useAuthStore from '../lib/stores/authStore';

export default function AccountPage() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-foodred-600" />
      </div>
    )
  }

  return user.isChef ? <ChefAccountPage /> : <ClientAccountPage />
}
