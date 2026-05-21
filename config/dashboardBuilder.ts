import { DashboardWidgetBuilder, type DashboardWidgetConfig } from '@admin/lib/dashboard'
import UserCountWidget from '../components/dashboard/UserCountWidget.vue'

export class UserDashboardBuilder extends DashboardWidgetBuilder {
  build(widgets: DashboardWidgetConfig[]): DashboardWidgetConfig[] {
    this.addWidget(widgets, {
      id: 'user-count-widget',
      component: UserCountWidget,
      order: 10,
    })

    return widgets
  }
}

export const userDashboardBuilder = new UserDashboardBuilder()


