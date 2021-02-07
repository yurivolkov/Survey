import AuthLayout from 'components/Authorization/Layout/AuthLayout.vue';
import Login from 'components/Authorization/Views/Login.vue';
import ForgotPassword from 'components/Authorization/Views/ForgotPassword.vue';

const auth = {
  path: '/auth',
  component: AuthLayout,
  redirect: '/auth/login',
  meta: {
    guest: true,
  },
  children: [
    {
      path: 'login',
      name: 'auth.login',
      component: Login,
    },
    {
      path: 'forgot-password',
      name: 'auth.forgot_password',
      component: ForgotPassword,
    },
  ],
};

export default auth;
