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
    baseURL = import.meta.env.BACKAND_URL || 'http://127.0.0.1',
    withCredentials = false,
    includeAuthInterceptor = true,
    include401Handler = false,
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
          // Clear token on unauthorized
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
          localStorage.removeItem('auth_permissions')
          // Redirect to login
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  return api
}

