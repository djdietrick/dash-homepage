import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';

import auth from './modules/auth';
import weather from './modules/weather';
import links from './modules/links';

Vue.use(Vuex)

// Use spread operator to keep auth in root state,
// that way user is accessible to modules
export default new Vuex.Store({
  state: {
    ...auth.state
  },
  getters: {
    ...auth.getters
  },
  mutations: {
    ...auth.mutations
  },
  actions: {
    ...auth.actions
  },
  modules: {
    weather,
    links
  },
  plugins: [
    createPersistedState({
      key: "dash-homepage"
    })
  ]
})
