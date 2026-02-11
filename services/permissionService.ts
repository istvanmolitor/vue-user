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
  is_default?: boolean
  created_at?: string
  updated_at?: string
}

export interface Permission {
  id: number
  name: string
  description?: string | null
  user_groups?: UserGroup[]
  created_at?: string
  updated_at?: string
}

export interface PermissionFormData {
  name: string
  description?: string | null
  user_groups?: number[]
}

export interface CreateDataResponse {
  user_groups: UserGroup[]
}

export interface EditDataResponse extends SingleResponse<Permission> {
  user_groups: UserGroup[]
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

export const permissionService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<Permission>>('/api/admin/user/permissions', { params })
  },
  getById(id: number | string) {
    return api.get<EditDataResponse>(`/api/admin/user/permissions/${id}/edit`)
  },
  getCreateData() {
    return api.get<CreateDataResponse>('/api/admin/user/permissions/create')
  },
  create(permission: PermissionFormData) {
    return api.post<{ data: Permission; message: string }>('/api/admin/user/permissions', permission)
  },
  update(id: number | string, permission: PermissionFormData) {
    return api.put<{ data: Permission; message: string }>(`/api/admin/user/permissions/${id}`, permission)
  },
  delete(id: number | string) {
    return api.delete<{ message: string }>(`/api/admin/user/permissions/${id}`)
  },
}
