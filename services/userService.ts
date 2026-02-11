import axios from 'axios'
import config from '@/config'

const api = axios.create({
  baseURL: config.SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Add token to requests
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

export interface UserGroup {
  id: number
  name: string
  description?: string | null
}

export interface User {
  id?: number
  name: string
  email: string
  email_verified_at?: string | null
  email_verified?: boolean
  user_groups?: UserGroup[]
  created_at?: string
  updated_at?: string
}

export interface UserFormData {
  name: string
  email: string
  user_groups?: number[]
  email_verified?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters?: {
    search?: string
    sort?: string
    direction?: string
  }
}

export interface SingleResponse<T> {
  data: T
}

export const userService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<User>>('/api/admin/user/users', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<User>>(`/api/admin/user/users/${id}`)
  },
  getCreateData() {
    return api.get<{ user_groups: UserGroup[] }>('/api/admin/user/users/create')
  },
  getEditData(id: number | string) {
    return api.get<{ data: User; user_groups: UserGroup[] }>(`/api/admin/user/users/${id}/edit`)
  },
  create(user: UserFormData) {
    return api.post<User>('/api/admin/user/users', user)
  },
  update(id: number | string, user: UserFormData) {
    return api.put<User>(`/api/admin/user/users/${id}`, user)
  },
  delete(id: number | string) {
    return api.delete(`/api/admin/user/users/${id}`)
  },
}
