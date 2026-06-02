// Composables
export { usePermissions } from './composables/usePermissions'
export { useAuth } from './composables/useAuth'

// Directives
export { vCan, vCannot } from './directives/permission'

// Components
export { default as UserSelecton } from './components/UserSelecton.vue'
export { default as UserSelector } from './components/UserSelector.vue'

// Services
export { createApiClient } from './services/apiClient'
export type { ApiClientConfig } from './services/apiClient'
export { authService, default as defaultAuthService } from './services/authService'
export { userService } from './services/userService'
export { userGroupService } from './services/userGroupService'
export { permissionService } from './services/permissionService'
export { permissionGroupService } from './services/permissionGroupService'

// Types
export type { User, LoginCredentials, RegisterCredentials, ChangePasswordCredentials, LoginResponse, AuthError } from './services/authService'
export type { UserGroup } from './services/userGroupService'
export type { Permission } from './services/permissionService'
export type { PermissionGroup } from './services/permissionGroupService'

// Menu configuration
export { UserMenuBuilder, userMenuBuilder } from './config/menuBuilder'
export { UserDashboardBuilder, userDashboardBuilder } from './config/dashboardBuilder'
export { default as router } from './router/index'

