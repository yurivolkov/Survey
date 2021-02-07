import * as types from './mutation-types';
import InitProxy from '@/proxies/InitProxy';
import Vue from 'vue';
/**
 * [Init Panel]
 */
export const init = ({commit, dispatch}) => {
  return new Promise((resolve, reject)=>{
    new InitProxy()
      .all()
      .then((response) => {
        let set = response.result.set;
        commit(types.SET_ACCOUNT, {key:'country', data: set.country});
        resolve(set);
      })
      .catch(err=>{
        Vue.router.push({
          name: 'auth.login',
        });
      })
  });

};



export default {
  init,
};
