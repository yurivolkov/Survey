import auth from './auth';
import admin from './admin';
import NotFound from 'components/GeneralViews/NotFoundPage.vue';
import DashboardLayout from 'components/Dashboard/Layout/DashboardLayout.vue';

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/admin/dashboard',
  },
  auth,
  admin,
  {
    path: '*',
    component: NotFound,
  },
];

export default routes;
