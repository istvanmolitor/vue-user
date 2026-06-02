import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { authService } from '@user/services/authService'
import { useAuth } from '@user/composables/useAuth'

export function authGuard(
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const { logout } = useAuth()
    const isAuthenticated = authService.isAuthenticated()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAdminRoute = to.path.startsWith('/admin')
    const isAuthPage = to.path === '/login' || to.path === '/register' || to.path === '/admin/login'
    const isLogoutPage = to.path === '/logout' || to.path === '/admin/logout'
    const requiredPermission = to.matched
        .map(record => record.meta.permission)
        .find((permission): permission is string => typeof permission === 'string')

    if (isLogoutPage) {
        logout().finally(() => {
            next(isAdminRoute ? '/admin/login' : '/login')
        })
        return
    }

    if (requiresAuth && !isAuthenticated) {
        // Redirect to login if trying to access protected route
        next({
            path: isAdminRoute ? '/admin/login' : '/login',
            query: { redirect: to.fullPath }
        })
    } else if (requiredPermission && !authService.hasPermission(requiredPermission)) {
        // Redirect from routes the user is authenticated for but not authorized to access.
        next(isAdminRoute ? '/admin/user' : '/dashboard')
    } else if (isAuthPage && isAuthenticated) {
        // Redirect to dashboard if already logged in and trying to access auth pages
        next(isAdminRoute ? '/admin' : '/dashboard')
    } else {
        next()
    }
}

export function guestGuard(
    _to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const isAuthenticated = authService.isAuthenticated()

    if (isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
}
