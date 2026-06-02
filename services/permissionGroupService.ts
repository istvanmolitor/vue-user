import { createApiClient } from './apiClient'

const api = createApiClient()

export interface PermissionGroup {
  id?: number
  name: string
  permissions_count?: number
}

export interface PermissionGroupFormData {
  name: string
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

export const permissionGroupService = {
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number }) {
    return api.get<PaginatedResponse<PermissionGroup>>('/api/admin/user/permission-groups', { params })
  },
  getById(id: number | string) {
    return api.get<SingleResponse<PermissionGroup>>(`/api/admin/user/permission-groups/${id}/edit`)
  },
  create(permissionGroup: PermissionGroupFormData) {
    return api.post<{ data: PermissionGroup; message: string }>('/api/admin/user/permission-groups', permissionGroup)
  },
  update(id: number | string, permissionGroup: PermissionGroupFormData) {
    return api.put<{ data: PermissionGroup; message: string }>(`/api/admin/user/permission-groups/${id}`, permissionGroup)
  },
  delete(id: number | string) {
    return api.delete<{ message: string }>(`/api/admin/user/permission-groups/${id}`)
  },
}
