import axios, { type AxiosInstance } from 'axios'

export interface ApiClientConfig {
  baseURL?: string
  withCredentials?: boolean
  includeAuthInterceptor?: boolean
  include401Handler?: boolean
}

/**
 * Creates a configured axios instance with authentication interceptors
 * @param config Configuration for the API client
 * @returns Configured axios instance
 */
export function createApiClient(config: ApiClientConfig = {}): AxiosInstance {
  const {
    // Default to same-origin requests, env var can override for separate API hosts.
    baseURL = import.meta.env.VITE_BACKEND_URL || '',
    withCredentials = true,
    includeAuthInterceptor = true,
    include401Handler = true,
  } = config

  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials,
  })

  // Add token to requests
  if (includeAuthInterceptor) {
    api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  // Handle 401 responses
  if (include401Handler) {
    api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear all auth related data
          const keysToRemove = [
            'auth_token',
            'auth_user',
            'auth_permissions',
            'auth_remember'
          ]
          keysToRemove.forEach(key => localStorage.removeItem(key))

          // Check if we are already on a login page to avoid redirect loops
          const isAdminRoute = window.location.pathname.startsWith('/admin')
          const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/admin/login'

          if (!isLoginPage) {
            const loginPath = isAdminRoute ? '/admin/login' : '/login'
            // Add redirect query parameter
            const currentPath = window.location.pathname + window.location.search
            window.location.href = `${loginPath}?redirect=${encodeURIComponent(currentPath)}`
          }
        }
        return Promise.reject(error)
      }
    )
  }

  return api
}

