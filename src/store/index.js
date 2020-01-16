import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger'
import user from './modules/user';
import management from './modules/management';

Vue.use(Vuex);

// 根级别的 store
// const state = {
// };

// const getters = {
// };

// const mutations = {
// };

// const actions = {
// };

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
  // state,
  // getters,
  // mutations,
  // actions,
  modules: {
    user: user,
    management: management
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});

export default store;
