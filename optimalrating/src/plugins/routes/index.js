export default [
  {
    path: '/',
    component: require('views/Home').default,
    exact: true
  },
  {
    path: '/approve',
    component: require('views/Approve').default,
    exact: true,
    freeze: true
  },
  {
    path: '/reset-password/:id',
    component: require('views/ResetPassword').default,
    exact: true
  },
  {
    path: '/approve-delete-profile/:id',
    component: require('views/DeleteProfile').default,
    exact: true,
    private: true
  },
  {
    path: '/email-change/:id',
    component: require('views/EmailChange').default,
    exact: true,
    private: true
  },
  {
    path: '/survey',
    component: require('views/Survey/Create').default,
    exact: true,
    private: true
  },
  {
    path: '/survey/:id',
    component: require('views/Survey').default,
    routes: [
      {
        path: '/survey/:id',
        component: require('views/Survey/Summary').default,
      },
      {
        path: '/survey/:id/details',
        component: require('views/Survey/Detail').default,
      }
    ]
  },
  {
    path: '/category/:id',
    component: require('views/Category').default,
    exact: true
  },
  {
    path: '/subject/:id',
    component: require('views/Subject').default,
    exact: true
  },
  {
    path: '/pages/:slug',
    component: require('views/Pages').default,
    exact: true
  },
  {
    path: '/user/:id',
    component: require('views/User').default,
    exact: true
  },
  {
    path: '/profile',
    component: require('views/Profile').default,
    exact: true,
    private: true
  },
];