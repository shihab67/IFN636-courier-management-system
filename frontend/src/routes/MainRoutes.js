import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const Users = Loadable(lazy(() => import('views/users')));
const CreateUser = Loadable(lazy(() => import('views/users/create')));
const EditUser = Loadable(lazy(() => import('views/users/edit')));
const UserProfile = Loadable(lazy(() => import('views/user/profile')));
const UpdateUserProfile = Loadable(lazy(() => import('views/user/UpdateProfile')));
const UserSettings = Loadable(lazy(() => import('views/user/settings')));
const Deliveries = Loadable(lazy(() => import('views/delivery')));
const CreateDeliveries = Loadable(lazy(() => import('views/delivery/create')));
const TrackDelivery = Loadable(lazy(() => import('views/delivery/track')));
const ViewDelivery = Loadable(lazy(() => import('views/delivery/ViewDelivery')));
const EditDelivery = Loadable(lazy(() => import('views/delivery/edit')));
const SupportTickets = Loadable(lazy(() => import('views/support_tickets')));
const CreateSupportTicket = Loadable(lazy(() => import('views/support_tickets/Create')));
const EditSupportTicket = Loadable(lazy(() => import('views/support_tickets/Edit')));
const AssignSupportTicket = Loadable(lazy(() => import('views/support_tickets/AssignCourier')));
const UpdateSupportTicketStatus = Loadable(lazy(() => import('views/support_tickets/UpdateStatus')));
const SupportTicketComments = Loadable(lazy(() => import('views/support_tickets/Comments')));
const NotificationPreference = Loadable(lazy(() => import('views/notification-preference')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  element: <MainLayout />,
  children: [
    {
      path: 'dashboard',
      children: [
        {
          path: '',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'deliveries',
      children: [
        {
          path: '',
          element: <Deliveries />
        },
        {
          path: 'create',
          element: <CreateDeliveries />
        },
        {
          path: 'track/:id',
          element: <TrackDelivery />
        },
        {
          path: 'view/:id',
          element: <ViewDelivery />
        },
        {
          path: 'edit/:id',
          element: <EditDelivery />
        }
      ]
    },
    {
      path: 'users',
      children: [
        {
          path: '',
          element: <Users />
        },
        {
          path: 'create',
          element: <CreateUser />
        },
        {
          path: 'edit/:id',
          element: <EditUser />
        }
      ]
    },
    {
      path: 'user',
      children: [
        {
          path: 'profile',
          element: <UserProfile />
        },
        {
          path: 'profile/update',
          element: <UpdateUserProfile />
        },
        {
          path: 'settings',
          element: <UserSettings />
        }
      ]
    },
    {
      path: 'support-tickets',
      children: [
        {
          path: '',
          element: <SupportTickets />
        },
        {
          path: 'create',
          element: <CreateSupportTicket />
        },
        {
          path: 'edit/:id',
          element: <EditSupportTicket />
        },
        {
          path: 'assign/:id',
          element: <AssignSupportTicket />
        },
        {
          path: 'update-status/:id',
          element: <UpdateSupportTicketStatus />
        },
        {
          path: 'comments/:id',
          element: <SupportTicketComments />
        }
      ]
    },
    {
      path: 'notification-preference',
      children: [
        {
          path: '',
          element: <NotificationPreference />
        }
      ]
    }
  ]
};

export default MainRoutes;
