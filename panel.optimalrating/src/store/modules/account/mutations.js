
import {
  ADD_ACCOUNT_ITEM,
  ADD_ACCOUNT_ITEM_AFTER, DELETE_ACCOUNT_ITEM,
  EMPTY_ACCOUNT,
  SET_ACCOUNT, SET_ACCOUNT_ITEM
} from "../account/mutation-types";


export default {
  [SET_ACCOUNT](state, payload) {
    state[payload.key] = payload.data;
  },
  [EMPTY_ACCOUNT](state, payload) {
    state[payload.key] = [];
  },
  [ADD_ACCOUNT_ITEM](state, payload) {
    state[payload.key].push(payload.data);
  },
  [ADD_ACCOUNT_ITEM_AFTER](state, payload) {
    state[payload.key].splice(payload.index + 1, 0, ...payload.data);
  },
  [SET_ACCOUNT_ITEM](state, payload) {
    let item = state[payload.key].find(item => item.id == payload.data.id)
    let index = state[payload.key].indexOf(item);
    state[payload.key].splice(index, 1, payload.data);
  },
  [DELETE_ACCOUNT_ITEM](state, payload) {
    let index = state[payload.key].indexOf(payload.data);
    state[payload.key].splice(index, 1);
  }
};
