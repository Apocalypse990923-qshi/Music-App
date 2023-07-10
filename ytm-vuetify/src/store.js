import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    user: null,
    loginFlag: false,
    curAlbum: null,
    curOrder: null,
    curTrack: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setLoginFlag(state, loginFlag) {
      state.loginFlag = loginFlag;
    },
    setCurTrack(state, track) {
      state.curTrack = track;
    },
    setCurAlbum(state, album) {
      state.curAlbum = album;
    },
    setCurOrder(state, order) {
      state.curOrder = order;
    },
  },
});

export default store;
