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

export interface Permission {
  id: number
  name: string
  description?: string | null
  created_at?: string
  updated_at?: string
}

export interface UserGroup {
  id?: number
  name: string
  description?: string | null
  is_default?: boolean
  permissions?: Permission[]
  created_at?: string
  updated_at?: string
}

export interface UserGroupFormData {
  name: string
  description?: string | null
  is_default?: boolean
  permissions?: number[]
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
  permissions?: Permission[]
}

export const userGroupService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<UserGroup>>('/api/admin/user/user-groups', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<UserGroup>>(`/api/admin/user/user-groups/${id}`)
  },
  getCreateData() {
    return api.get<{ permissions: Permission[] }>('/api/admin/user/user-groups/create')
  },
  create(userGroup: UserGroupFormData) {
    return api.post<{ data: UserGroup; message: string }>('/api/admin/user/user-groups', userGroup)
  },
  update(id: number | string, userGroup: UserGroupFormData) {
    return api.put<{ data: UserGroup; message: string }>(`/api/admin/user/user-groups/${id}`, userGroup)
  },
  delete(id: number | string) {
    return api.delete<{ message: string }>(`/api/admin/user/user-groups/${id}`)
  },
}
