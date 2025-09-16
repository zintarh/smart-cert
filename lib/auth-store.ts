'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  image?: string
  role?: string
  unijos?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  resetPassword: () => Promise<{ success: boolean; message: string }>
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      resetPassword: async () => {
        // Mock implementation - in real app, this would call an API
        return { success: true, message: 'Password reset successfully' }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
