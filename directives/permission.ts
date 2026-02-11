import type { Directive } from 'vue'
import { authService } from '../services/authService'

/**
 * v-can directive for permission-based rendering
 *
 * Usage:
 *   v-can="'edit-user'" - single permission
 *   v-can="['edit-user', 'delete-user']" - any of the permissions
 *   v-can.all="['edit-user', 'delete-user']" - all permissions required
 */
export const vCan: Directive = {
  mounted(el, binding) {
    const permission = binding.value
    const requireAll = binding.modifiers.all

    let hasAccess = false

    if (Array.isArray(permission)) {
      hasAccess = requireAll
        ? authService.hasAllPermissions(permission)
        : authService.hasAnyPermission(permission)
    } else if (typeof permission === 'string') {
      hasAccess = authService.hasPermission(permission)
    }

    if (!hasAccess) {
      // Hide element if user doesn't have permission
      el.style.display = 'none'
    }
  },

  updated(el, binding) {
    const permission = binding.value
    const requireAll = binding.modifiers.all

    let hasAccess = false

    if (Array.isArray(permission)) {
      hasAccess = requireAll
        ? authService.hasAllPermissions(permission)
        : authService.hasAnyPermission(permission)
    } else if (typeof permission === 'string') {
      hasAccess = authService.hasPermission(permission)
    }

    if (!hasAccess) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  },
}

/**
 * v-cannot directive for permission-based rendering (opposite of v-can)
 *
 * Usage:
 *   v-cannot="'edit-user'" - show only if user doesn't have permission
 */
export const vCannot: Directive = {
  mounted(el, binding) {
    const permission = binding.value
    const hasAccess = typeof permission === 'string'
      ? authService.hasPermission(permission)
      : false

    if (hasAccess) {
      // Hide element if user has permission
      el.style.display = 'none'
    }
  },

  updated(el, binding) {
    const permission = binding.value
    const hasAccess = typeof permission === 'string'
      ? authService.hasPermission(permission)
      : false

    if (hasAccess) {
      el.style.display = 'none'
    } else {
      el.style.display = ''
    }
  },
}
