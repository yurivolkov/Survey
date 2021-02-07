import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import auth from './modules/auth';
import account from './modules/account';
import definition from './modules/definition';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    account,
    auth,
    definition
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
