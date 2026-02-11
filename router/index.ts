import type { RouteRecordRaw } from 'vue-router'

const userRoutes: RouteRecordRaw[] = [
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
    path: '/profile',
    name: 'profile',
    component: () => import('../views/auth/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: () => import('../views/auth/ChangePassword.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../views/auth/Logout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/auth/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/user/UserIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users/create',
    name: 'user-create',
    component: () => import('../views/user/UserCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users/:id/edit',
    name: 'user-edit',
    component: () => import('../views/user/UserEdit.vue'),
    meta: { requiresAuth: true }
  },
  // User Groups
  {
    path: '/user-groups',
    name: 'user-groups',
    component: () => import('../views/user-group/UserGroupIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user-groups/create',
    name: 'user-group-create',
    component: () => import('../views/user-group/UserGroupCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user-groups/:id/edit',
    name: 'user-group-edit',
    component: () => import('../views/user-group/UserGroupEdit.vue'),
    meta: { requiresAuth: true }
  },
  // Permissions
  {
    path: '/permissions',
    name: 'permissions',
    component: () => import('../views/permission/PermissionIndex.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/permissions/create',
    name: 'permission-create',
    component: () => import('../views/permission/PermissionCreate.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/permissions/:id/edit',
    name: 'permission-edit',
    component: () => import('../views/permission/PermissionEdit.vue'),
    meta: { requiresAuth: true }
  }
]

export default userRoutes
