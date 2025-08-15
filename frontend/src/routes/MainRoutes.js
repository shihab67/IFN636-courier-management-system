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
    // {
    //   path: 'leave-request',
    //   children: [
    //     {
    //       path: 'leave-calendar',
    //       element: <LeaveRequest />
    //     },
    //     {
    //       path: 'create',
    //       element: <CreateLeave />
    //     },
    //     {
    //       path: 'leave-list/:type',
    //       element: <LeaveList />
    //     },
    //     {
    //       path: 'view/:id',
    //       element: <LeaveDetails />
    //     },
    //     {
    //       path: 'edit/:id',
    //       element: <EditLeave />
    //     }
    //   ]
    // },
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
    }
  ]
};

export default MainRoutes;
