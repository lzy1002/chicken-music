import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import logger from "vuex/dist/logger.js";

import state from "./state.js";
import mutations from "./mutations.js";
import * as getters from "./getters.js";
import * as actions from "./actions.js";

const isStrict = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  strict: isStrict,
  plugins: [logger()]
});
