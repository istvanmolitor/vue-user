import { MenuBuilder, type MenuItemConfig } from '@menu/types/menu'
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

    if (menuName === 'settings') {
      return this.buildMainMenu(menu)
    }
    return menu
  }

  /**
   * Build profile menu items
   */
  private buildProfileMenu(menu: MenuItemConfig): MenuItemConfig {
    this.addMenuItem(menu, {
      id: 'user-profile',
      title: 'Profil adatok',
      path: '/profile',
      icon: User,
      order: 10
    })

    this.addMenuItem(menu, {
      id: 'change-password',
      title: 'Jelszó módosítás',
      path: '/change-password',
      icon: Lock,
      order: 20
    })

    this.addMenuItem(menu, {
      id: 'logout',
      title: 'Kijelentkezés',
      path: '/logout',
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

    this.addMenuItem(menu, userSection)

    return menu
  }
}

// Export singleton instance
export const userMenuBuilder = new UserMenuBuilder()
