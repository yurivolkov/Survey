import Vue from 'vue';
import {
  CHECK,
  REGISTER,
  LOGIN,
  LOGOUT,
  ROLES
} from './mutation-types';

export default {
  [CHECK](state) {
    state.authenticated = !!localStorage.getItem('token');
    if (state.authenticated) {
      let _token = localStorage.getItem('token');
      Vue.$http.defaults.headers.common['Authorization'] = 'Bearer '+_token;
    }
  },
  [REGISTER]() {
    //
  },
  [LOGIN](state, token) {
    state.authenticated = true;
    localStorage.setItem('token', token);
    Vue.$http.defaults.headers.common['Authorization'] = 'Bearer '+token;

  },
  [LOGOUT](state) {
    state.authenticated = false;
    state.roles = null;
    localStorage.removeItem('token');
    Vue.$http.defaults.headers.common['Authorization'] = '';
  },
  [ROLES](state, role) {
    state.roles = role
  },
};
