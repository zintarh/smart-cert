'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Edit, Flag } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/Button'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

const settingsSchema = z.object({
  adminName: z.string().min(1, 'Admin name is required'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  universityName: z.string().min(1, 'University name is required'),
  publicVerificationKey: z.string().min(1, 'Public verification key is required'),
  password: z.string().optional(),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export default function SettingsPage() {
  const [, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('/api/placeholder/100/100')
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const { data: session, status } = useSession()

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      adminName: session?.user?.name || '',
      email: session?.user?.email || '',
      phoneNumber: '',
      universityName: session?.user?.university || '',
      publicVerificationKey: '',
      password: '',
    },
  })

  useEffect(() => {
    const loadUserProfile = async () => {
      if (status === 'loading') {
        return // Wait for session to load
      }
      
      if (session?.user?.id) {
        try {
          setIsProfileLoading(true)
          const response = await api.getUserProfile(session.user.id)
          if (response.success && response.data) {
            const data = response.data as {
              name?: string;
              email?: string;
              phoneNumber?: string;
              university?: string;
              publicVerificationKey?: string;
              image?: string;
            };
            reset({
              adminName: data.name || session.user.name || '',
              email: data.email || session.user.email || '',
              phoneNumber: data.phoneNumber || '',
              universityName: data.university || session.user.university || '',
              publicVerificationKey: data.publicVerificationKey || '',
            })
            if (data.image) {
              setAvatarPreview(data.image)
            }
          } else {
            // Fallback to session data if API fails
            reset({
              adminName: session.user.name || '',
              email: session.user.email || '',
              phoneNumber: '',
              universityName: session.user.university || '',
              publicVerificationKey: '',
            })
          }
        } catch (error) {
          console.error('Error loading user profile:', error)
          // Fallback to session data if API fails
          reset({
            adminName: session.user.name || '',
            email: session.user.email || '',
            phoneNumber: '',
            universityName: session.user.university || '',
            publicVerificationKey: '',
          })
        } finally {
          setIsProfileLoading(false)
        }
      } else {
        setIsProfileLoading(false)
      }
    }
    loadUserProfile()
  }, [session, status, reset])

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const onProfileSubmit = async (data: SettingsFormData) => {
    if (!session?.user?.id) return

    setIsProfileSaving(true)
    try {
      const response = await api.updateUserProfile(session.user.id, {
        name: data.adminName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        university: data.universityName,
        publicVerificationKey: data.publicVerificationKey,
      })

      if (response.success) {
        toast.success('Profile updated successfully!')
        // Optionally refresh session or user context
      } else {
        toast.error(response.message || 'Failed to update profile.')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('An error occurred while updating profile.')
    } finally {
      setIsProfileSaving(false)
    }
  }


  // Show loading state while session is loading
  if (status === 'loading' || isProfileLoading) {
    return (
      <DashboardLayout title="Settings">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-96"></div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-96"></div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-64"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Show error state if not authenticated
  if (status === 'unauthenticated') {
    return (
      <DashboardLayout title="Settings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600">Please log in to access settings.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

        {/* Single Form with Light Blue Border */}
        <div className="bg-white rounded-lg border-2 border-blue-200 p-8">
          <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-8">
            {/* Profile Picture Section */}
            <div className="flex items-start space-x-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100">
                  <Image
                    src={avatarPreview}
                    alt="Admin Avatar"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 w-10 h-10 bg-smart-blue rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors shadow-lg"
                >
                  <Camera className="w-5 h-5 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="flex flex-col space-y-3 pt-4">
                <Button
                  type="button"
                  className="w-32 bg-smart-blue text-white hover:bg-blue-600 text-sm py-2.5 px-4 rounded-lg font-medium"
                >
                  Upload new
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-32 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm py-2.5 px-4 rounded-lg font-medium"
                >
                  Delete avatar
                </Button>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-600 text-sm">Update your personal details here.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
                  <input
                    {...register('adminName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    {...register('email')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                    readOnly
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <Flag className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-500 text-sm">🇳🇬</span>
                    </div>
                    <input
                      {...register('phoneNumber')}
                      className="w-full pl-16 pr-10 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                      readOnly
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Helper text or Description</p>
                </div>
              </div>
            </div>

            {/* University Settings Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">University Settings</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University Name</label>
                  <input
                    {...register('universityName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Public Verification Key</label>
                  <input
                    {...register('publicVerificationKey')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Security</h2>
                <p className="text-gray-600 text-sm">Update your security information here.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type="password"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-smart-blue focus:border-transparent"
                    readOnly
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                isLoading={isProfileSaving}
                className="bg-smart-blue text-white hover:bg-blue-600 px-8 py-3 text-base font-medium rounded-lg"
              >
                {isProfileSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
