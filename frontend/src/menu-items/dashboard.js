// assets
import { IconDashboard, IconForms, IconUsers } from '@tabler/icons-react';

// constant
const icons = { IconDashboard, IconForms, IconUsers };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'leave-request',
      title: 'Leave Request',
      type: 'collapse',
      url: '',
      icon: icons.IconForms,
      children: [
        {
          id: 'leave-calendar',
          title: 'Leave Calendar',
          type: 'item',
          url: '/leave-request/leave-calendar',
          breadcrumbs: false
        },
        {
          id: 'create',
          title: 'Create Leave Request',
          type: 'item',
          url: '/leave-request/create',
          breadcrumbs: false
        },
        {
          id: 'leave-list',
          title: 'Leave List',
          type: 'item',
          url: '/leave-request/leave-list/pending',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/users',
      icon: icons.IconUsers,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
