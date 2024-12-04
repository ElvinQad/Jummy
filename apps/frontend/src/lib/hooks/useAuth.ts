import { useState, useEffect } from 'react';
import { api } from '../lib/axios';

interface UserRoles {
  isAdmin: boolean;
  isChef: boolean;
}

export const useAuth = () => {
  const [roles, setRoles] = useState<UserRoles>({ isAdmin: false, isChef: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkRoles = async () => {
      try {
        // Extract userId from the stored user object
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userId = user.id;

        const [adminResponse, chefResponse] = await Promise.all([
          api.get(`/users/${userId}/is-admin`),
          api.get(`/users/${userId}/is-chef`)
        ]);

        setRoles({
          isAdmin: adminResponse.data.isAdmin,
          isChef: chefResponse.data.isChef
        });
      } catch (err) {
        setError('Failed to verify user roles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkRoles();
  }, []);

  return { roles, loading, error };
};
