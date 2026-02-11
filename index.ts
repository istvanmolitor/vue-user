// Composables
export { usePermissions } from './composables/usePermissions'

// Directives
export { vCan, vCannot } from './directives/permission'

// Services
export { authService, default as defaultAuthService } from './services/authService'
export { userService } from './services/userService'
export { userGroupService } from './services/userGroupService'
export { permissionService } from './services/permissionService'

// Types
export type { User, LoginCredentials, RegisterCredentials, ChangePasswordCredentials, LoginResponse, AuthError } from './services/authService'
export type { UserGroup } from './services/userGroupService'
export type { Permission } from './services/permissionService'

// Menu configuration
export { userMenuConfig, default as defaultUserMenuConfig } from './config/menu'
export { UserMenuBuilder, userMenuBuilder } from './config/menuBuilder'
export { default as router } from './router/index'

