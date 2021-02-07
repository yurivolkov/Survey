import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '@/store';

Vue.use(VueRouter);

export const router = new VueRouter({
  routes,
  linkActiveClass: 'nav-item active',
});

router.beforeEach((to, from, next) => {

  if (!to.meta.middleware) {
    return next()
  }

  const middleware = to.meta.middleware;

  const context = {
    to,
    from,
    next,
    store
  };
  return middleware[0]({
    ...context
  })

});

Vue.router = router;

export default router;
