import Vue from 'vue';
import AuthProxy from '@/proxies/AuthProxy';
import * as types from './mutation-types';

export const check = ({commit, dispatch, getters}) => {
  commit(types.CHECK);
  if (getters.checkAuthentication) {
    dispatch('account/init', {}, {root: true}).then((response)=>{
      commit(types.ROLES, response.role.name);
    });
  }
};

export const login = ({commit, dispatch}, user) => {
  return new Promise((resolve, reject) => {
    return new AuthProxy()
      .login(user)
      .then((response) => {
        if (response && !response.code && response.code !== 401) {
          commit(types.LOGIN, response.token.access_token);
          commit(types.ROLES, response.user.roles[0].name);
          dispatch('account/init', {}, {root: true});
          Vue.router.push({
            name: 'admin.dashboard',
          });
          resolve(response);
        } else {
          reject(response);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const logout = ({commit}) => {
  commit(types.LOGOUT);
  Vue.router.push({
    name: 'auth.login',
  });
};

export const  setRoles = () =>{
  // console.log(123);
};

export default {
  check,
  login,
  logout,
  setRoles
};
