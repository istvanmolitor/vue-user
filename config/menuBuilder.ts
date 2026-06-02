import { MenuBuilder, type MenuItemConfig } from '@menu/index'
import { Users, UserCircle, Shield, User, Lock, LogOut } from 'lucide-vue-next'

/**
 * User Menu Builder
 * Builds the user management menu structure
 */
export class UserMenuBuilder extends MenuBuilder {
  build(menu: MenuItemConfig, menuName: string): MenuItemConfig {
    // Handle profile menu
    if (menuName === 'profile') {
      return this.buildProfileMenu(menu)
    }

    if (menuName === 'user') {
      return this.buildUserMenu(menu)
    }

    if (menuName === 'admin') {
      return this.buildMainMenu(menu)
    }
    return menu
  }

  /**
   * Build user dropdown menu items
   */
  private buildUserMenu(menu: MenuItemConfig): MenuItemConfig {
    this.addMenuItem(menu, {
      id: 'user-profile',
      title: 'Profil',
      path: '/admin/profile',
      icon: User,
      order: 10
    })

    this.addMenuItem(menu, {
      id: 'user-logout',
      title: 'Kijelentkezésaaaaaaaaaaaa',
      icon: LogOut,
      meta: { action: 'logout' },
      order: 20
    })

    return menu
  }

  /**
   * Build profile menu items
   */
  private buildProfileMenu(menu: MenuItemConfig): MenuItemConfig {
    this.addMenuItem(menu, {
      id: 'user-profile',
      title: 'Profil adatok',
      path: '/admin/profile',
      icon: User,
      order: 10
    })

    this.addMenuItem(menu, {
      id: 'change-password',
      title: 'Jelszó módosítás',
      path: '/admin/change-password',
      icon: Lock,
      order: 20
    })

    this.addMenuItem(menu, {
      id: 'logout',
      title: 'Kijelentkezés',
      path: '/admin/logout',
      icon: LogOut,
      order: 30
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
      permission: 'permission',
      children: [
        {
          id: 'users-list',
          title: 'Felhasználók',
          path: '/admin/user',
          icon: UserCircle,
          order: 10,
          permission: 'permission'
        },
        {
          id: 'user-groups',
          title: 'Csoportok',
          path: '/admin/user-group',
          icon: Users,
          order: 20,
          permission: 'permission'
        },
        {
          id: 'permissions',
          title: 'Jogosultságok',
          path: '/admin/permission',
          icon: Shield,
          order: 30,
          permission: 'permission'
        }
      ]
    }

    this.addMenuItem(menu, userSection)

    return menu
  }
}

// Export singleton instance
export const userMenuBuilder = new UserMenuBuilder()
