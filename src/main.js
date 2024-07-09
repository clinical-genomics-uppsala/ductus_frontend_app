import { createApp } from "vue";
//import { BootstrapVue3, IconsPlugin } from "bootstrap-vue-3";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
// import axiosRetry from "axios-retry";

//import "bootstrap/dist/css/bootstrap.min.css";
//import "bootstrap-vue-3/dist/bootstrap-vue-3.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap";

axios.defaults.baseURL = process.env.VUE_APP_API_ADDRESS;

store.commit("initializeStore");
const token = store.state.token;

if (token !== null) {
  axios.defaults.headers.common["Authorization"] = "Token " + token;
}

const app = createApp(App);

app.use(store);
app.use(router, axios);

app.mount("#app");
