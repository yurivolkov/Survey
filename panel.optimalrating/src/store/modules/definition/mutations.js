/* ============
 * Mutations for the account module
 * ============
 *
 * The mutations that are available on the
 * account module.
 */

import {
  SET_DEFINITION,
  EMPTY_DEFINITION,
  ADD_DEFINITION_ITEM,
  ADD_DEFINITION_ITEM_AFTER,
  SET_DEFINITION_ITEM,
  DELETE_DEFINITION_ITEM
} from './mutation-types';

export default {
  [SET_DEFINITION](state, payload) {
    state[payload.key] = payload.data;
  },
  [EMPTY_DEFINITION](state, payload) {
    state[payload.key] = [];
  },
  [ADD_DEFINITION_ITEM](state, payload) {
    state[payload.key].push(payload.data);
  },
  [ADD_DEFINITION_ITEM_AFTER](state, payload) {
    state[payload.key].splice(payload.index + 1, 0, ...payload.data);
  },
  [SET_DEFINITION_ITEM](state, payload) {
    let item = state[payload.key].find(item => item.id == payload.data.id)
    let index = state[payload.key].indexOf(item);
    state[payload.key].splice(index, 1, payload.data);
  },
  [DELETE_DEFINITION_ITEM](state, payload) {
    let index = state[payload.key].indexOf(payload.data);
    state[payload.key].splice(index, 1);
  }
};
