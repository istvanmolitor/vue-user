import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { authService } from '@user/services/authService'

export function authGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const isAuthenticated = authService.isAuthenticated()
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthPage = to.path === '/login' || to.path === '/register'

    if (requiresAuth && !isAuthenticated) {
        // Redirect to login if trying to access protected route
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    } else if (isAuthPage && isAuthenticated) {
        // Redirect to dashboard if already logged in and trying to access auth pages
        next('/dashboard')
    } else {
        next()
    }
}

export function guestGuard(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    const isAuthenticated = authService.isAuthenticated()

    if (isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
}
