import { FolderTree } from 'lucide-vue-next'
import type { MenuItemConfig } from '@menu/index'

/**
 * User package menu configuration
 * Defines the menu structure for user management features
 */
export const userMenuConfig: MenuItemConfig = {
  id: 'user-management',
  title: 'Felhasználók',
  icon: FolderTree,
  order: 20,
  children: [
    {
      id: 'users-list',
      title: 'Felhasználók',
      path: '/users',
      order: 10
    },
    {
      id: 'user-groups',
      title: 'Csoportok',
      path: '/user-groups',
      order: 20,
      permission: 'permissions'
    },
    {
      id: 'permissions',
      title: 'Jogosultságok',
      path: '/permissions',
      order: 30,
      permission: 'permissions'
    },
    {
      id: 'permission-groups',
      title: 'Jogosultság csoportok',
      path: '/permission-groups',
      order: 40,
      permission: 'permissions'
    }
  ]
}

export default userMenuConfig
