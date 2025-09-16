const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  code?: string
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          code: data.code,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      console.error('API request failed:', error)
      return {
        success: false,
        message: 'Network error occurred',
      }
    }
  }

  // Dashboard stats
  async getDashboardStats(): Promise<ApiResponse> {
    return this.request('/api/dashboard/stats')
  }

  // Certificates
  async getCertificates(params: {
    page?: number
    limit?: number
    status?: string
    search?: string
    startDate?: string
    endDate?: string
  } = {}): Promise<ApiResponse> {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })
    
    return this.request(`/api/certificates?${searchParams.toString()}`)
  }

  async createCertificate(data: {
    recipientName: string;
    email: string;
    course: string;
    matricNo: string;
    issueDate: string;
    expiryDate: string;
  }): Promise<ApiResponse> {
    return this.request('/api/certificates', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCertificate(id: string): Promise<ApiResponse> {
    return this.request(`/api/certificates/${id}`)
  }

  // Verification
  async verifyCertificate(certificateId: string): Promise<ApiResponse> {
    return this.request('/api/verification', {
      method: 'POST',
      body: JSON.stringify({ certificateId }),
    })
  }

  // User profile
  async getUserProfile(userId: string): Promise<ApiResponse> {
    return this.request(`/api/user/profile?userId=${userId}`)
  }

  async updateUserProfile(userId: string, data: {
    name: string;
    email: string;
    phoneNumber: string;
    unijos: string;
    publicVerificationKey: string;
    image?: string;
  }): Promise<ApiResponse> {
    return this.request(`/api/user/profile?userId=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async changePassword(data: {
    email: string
    currentPassword: string
    newPassword: string
  }): Promise<ApiResponse> {
    return this.request('/api/user/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async resetPassword(data: {
    email: string
    newPassword: string
  }): Promise<ApiResponse> {
    return this.request('/api/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const api = new ApiClient()
