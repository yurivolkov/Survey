import Vue from 'vue';
import plugins from './plugins';
import App from './App.vue';
import store from './store';

store.dispatch('auth/check');

new Vue({
  el: '#app',
  i18n: plugins.i18n,
  router: plugins.router,
  store,
  render: (h) => h(App),
});
