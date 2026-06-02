import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
  // Regular public auth pages
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/Register.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('../views/auth/ForgotPassword.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/logout',
    name: 'logout',
    component: { template: '' },
    meta: { requiresAuth: false }
  },
  {
    path: '/admin/logout',
    name: 'admin-logout',
    component: { template: '' },
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/auth/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/profile',
    name: 'admin-profile',
    component: () => import('../views/auth/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/change-password',
    name: 'admin-change-password',
    component: () => import('../views/auth/ChangePassword.vue'),
    meta: { requiresAuth: true }
  },
  // Admin specific routes
  {
    path: '/admin/user',
    name: 'admin-users',
    component: () => import('../views/user/UserIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/user/create',
    name: 'admin-user-create',
    component: () => import('../views/user/UserCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/user/:id/edit',
    name: 'admin-user-edit',
    component: () => import('../views/user/UserEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/user-group',
    name: 'admin-user-groups',
    component: () => import('../views/user-group/UserGroupIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/user-group/create',
    name: 'admin-user-group-create',
    component: () => import('../views/user-group/UserGroupCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/user-group/:id/edit',
    name: 'admin-user-group-edit',
    component: () => import('../views/user-group/UserGroupEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/user-group/:id/users',
    name: 'admin-user-group-users-edit',
    component: () => import('../views/user-group/UserGroupUsersEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/permission',
    name: 'admin-permissions',
    component: () => import('../views/permission/PermissionIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/permission/create',
    name: 'admin-permission-create',
    component: () => import('../views/permission/PermissionCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/permission/:id/edit',
    name: 'admin-permission-edit',
    component: () => import('../views/permission/PermissionEdit.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/permission-group',
    name: 'admin-permission-groups',
    component: () => import('../views/permission-group/PermissionGroupIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/permission-group/create',
    name: 'admin-permission-group-create',
    component: () => import('../views/permission-group/PermissionGroupCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/permission-group/:id/edit',
    name: 'admin-permission-group-edit',
    component: () => import('../views/permission-group/PermissionGroupEdit.vue'),
    meta: { requiresAuth: true }
  }
]

export default userRoutes
