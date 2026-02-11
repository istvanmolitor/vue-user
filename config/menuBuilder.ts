import type { MenuBuilder, MenuItemConfig } from '@menu/index'
import { Users, UserCircle, Shield, User, Lock, LogOut } from 'lucide-vue-next'

/**
 * User Menu Builder
 * Builds the user management menu structure
 */
export class UserMenuBuilder implements MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    // Handle profile menu
    if (menuName === 'profile') {
      return this.buildProfileMenu(menu)
    }

    // Handle main menu (default)
    return this.buildMainMenu(menu)
  }

  /**
   * Build profile menu items
   */
  private buildProfileMenu(menu: MenuItemConfig): MenuItemConfig {
    const profileItem: MenuItemConfig = {
      id: 'user-profile',
      title: 'Profil adatok',
      path: '/profile',
      icon: User,
      order: 10
    }

    const changePasswordItem: MenuItemConfig = {
      id: 'change-password',
      title: 'Jelszó módosítás',
      path: '/change-password',
      icon: Lock,
      order: 20
    }

    const logoutItem: MenuItemConfig = {
      id: 'logout',
      title: 'Kijelentkezés',
      path: '/logout',
      icon: LogOut,
      order: 30
    }

    // Add to menu children
    if (!menu.children) {
      menu.children = []
    }
    menu.children.push(profileItem)
    menu.children.push(changePasswordItem)
    menu.children.push(logoutItem)

    // Sort children by order
    menu.children.sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })

    return menu
  }

  /**
   * Build main menu items
   */
  private buildMainMenu(menu: MenuItemConfig): MenuItemConfig {
    // Add user management section to the menu
    const userSection: MenuItemConfig = {
      id: 'user-management',
      title: 'Felhasználók',
      icon: Users,
      order: 20,
      children: [
        {
          id: 'users-list',
          title: 'Felhasználók',
          path: '/users',
          icon: UserCircle,
          order: 10
        },
        {
          id: 'user-groups',
          title: 'Csoportok',
          path: '/user-groups',
          icon: Users,
          order: 20
        },
        {
          id: 'permissions',
          title: 'Jogosultságok',
          path: '/permissions',
          icon: Shield,
          order: 30
        }
      ]
    }

    // Add to menu children
    if (!menu.children) {
      menu.children = []
    }
    menu.children.push(userSection)

    // Sort children by order
    menu.children.sort((a, b) => {
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      return orderA - orderB
    })

    return menu
  }
}

// Export singleton instance
export const userMenuBuilder = new UserMenuBuilder()
