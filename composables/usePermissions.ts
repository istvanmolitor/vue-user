import { computed } from 'vue'
import { authService } from '../services/authService'

/**
 * Composable for permission checking
 */
export function usePermissions() {
  /**
   * Get all user permissions
   */
  const permissions = computed(() => authService.getPermissions())

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission)
  }

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (requiredPermissions: string[]): boolean => {
    return authService.hasAllPermissions(requiredPermissions)
  }

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (requiredPermissions: string[]): boolean => {
    return authService.hasAnyPermission(requiredPermissions)
  }

  /**
   * Check if user can access a resource (alias for hasPermission)
   */
  const can = (permission: string): boolean => {
    return hasPermission(permission)
  }

  /**
   * Check if user cannot access a resource
   */
  const cannot = (permission: string): boolean => {
    return !hasPermission(permission)
  }

  /**
   * Refresh user permissions from server
   * Useful after permission changes
   */
  const refreshPermissions = async (): Promise<void> => {
    await authService.refreshUser()
  }

  return {
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    can,
    cannot,
    refreshPermissions,
  }
}
