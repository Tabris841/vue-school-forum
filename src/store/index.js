import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';
import categories from './modules/categories';
import forums from './modules/forums';
import threads from './modules/threads';
import users from './modules/users';
import auth from './modules/auth';
import posts from './modules/posts';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters,
  mutations,
  actions,
  modules: {
    categories,
    forums,
    threads,
    posts,
    users,
    auth
  }
});
