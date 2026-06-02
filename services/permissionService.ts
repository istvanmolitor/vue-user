import { createApiClient } from './apiClient'

const api = createApiClient()

export interface UserGroup {
  id: number
  name: string
  description?: string | null
  is_default?: boolean
  created_at?: string
  updated_at?: string
}

export interface PermissionGroup {
  id: number
  name: string
}

export interface Permission {
  id: number
  name: string
  description?: string | null
  permission_group?: PermissionGroup | null
  user_groups?: UserGroup[]
  created_at?: string
  updated_at?: string
}

export interface PermissionFormData {
  permission_group_id: number | null
  name: string
  description?: string | null
  user_groups?: number[]
}

export interface CreateDataResponse {
  permission_groups: PermissionGroup[]
  user_groups: UserGroup[]
}

export interface EditDataResponse extends SingleResponse<Permission> {
  permission_groups: PermissionGroup[]
  user_groups: UserGroup[]
}

export interface PaginatedResponse<T> {
  data: T[]
  permission_groups?: PermissionGroup[]
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
    permission_group_id?: number
  }
}

export interface SingleResponse<T> {
  data: T
}

export const permissionService = {
  getAll(params?: {
    search?: string
    sort?: string
    direction?: string
    page?: number
    permission_group_id?: number
  }) {
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
