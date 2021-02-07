import Vue from 'vue';
import Axios from 'axios';
import store from '@/store';

Axios.defaults.baseURL = process.env.API_LOCATION;
Axios.defaults.headers.common.Accept = 'application/json';

Vue.$http = Axios.create({
  baseURL: process.env.API_LOCATION,
});

Vue.$http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      store.dispatch('auth/logout');
    }
    return Promise.reject(error);
  });

Object.defineProperty(Vue.prototype, '$http', {
  get() {
    return Axios;
  },
});
