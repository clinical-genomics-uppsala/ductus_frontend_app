import { createStore } from "vuex";

export default createStore({
  state: {
    username: "",
    token: "",
    isAuthenticated: false,
  },
  getters: {},
  mutations: {
    initializeStore(state) {
      if (localStorage.getItem("token")) {
        state.token = localStorage.getItem("token");
        state.username = localStorage.getItem("username");
        state.isAuthenticated = true;
      } else {
        state.token = "";
        state.username = "";
        state.isAuthenticated = false;
      }
    },
    setToken(state, token) {
      state.token = token;
      state.isAuthenticated = true;
    },
    setUsername(state, username) {
      state.username = username;
    },
    removeToken(state) {
      state.token = "";
      state.username = "";
      state.isAuthenticated = false;
    },
  },
  actions: {},
  modules: {},
});
