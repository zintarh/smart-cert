import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  unijos: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'john.doe@unijos.edu',
    name: 'John Doe',
    unijos: 'Unijos of Technology',
    password: 'password123', // In real app, this would be hashed
  },
  {
    id: '2',
    email: 'jane.smith@college.ac.uk',
    name: 'Jane Smith',
    unijos: 'College of Sciences',
    password: 'password456', // In real app, this would be hashed
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          await new Promise(resolve => setTimeout(resolve, 1500));

          const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
          
          if (!user) {
            return {
              success: false,
              message: 'No account found with this email address'
            };
          }

          // Check password match
          if (user.password !== password) {
            return {
              success: false,
              message: 'Incorrect password. Please try again.'
            };
          }

          // Remove password from user object before storing
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password: _, ...userWithoutPassword } = user;

          set({
            user: userWithoutPassword,
            isAuthenticated: true,
            isLoading: false,
          });

          return {
            success: true,
            message: 'Login successful!'
          };
        } catch {
          set({ isLoading: false });
          return {
            success: false,
            message: 'An unexpected error occurred. Please try again.'
          };
        }
      },

      resetPassword: async (newPassword: string) => {
        set({ isLoading: true });

        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500));
          if (newPassword.length < 8) {
            return {
              success: false,
              message: 'Password must be at least 8 characters long'
            };
          }

          set({ isLoading: false });

          return {
            success: true,
            message: 'Password reset successfully! You can now log in with your new password.'
          };
        } catch {
          set({ isLoading: false });
          return {
            success: false,
            message: 'An unexpected error occurred. Please try again.'
          };
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
