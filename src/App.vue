<template>
  <div v-if="isAuthenticated">
    <nav class="navbar">
      <div class="container-fluid">
        <a class="navbar-brand" href="#"></a>
        <UserInfoSimple
          :username="username"
          class="justify-content-end"
          :style="{ 'margin-right': '2rem' }"
        />
      </div>
    </nav>
  </div>
  <router-view />
</template>

<script>
import axios from "axios";
import UserInfoSimple from "./components/UserInfoSimple";

export default {
  name: "App",
  beforeCreate() {
    this.$store.commit("initializeStore");

    const token = this.$store.state.token;

    if (token) {
      axios.defaults.headers.common["Authorization"] = "Token " + token;
    } else {
      axios.defaults.headers.common["Authorization"] = "";
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    username() {
      return this.$store.state.username;
    },
  },
  components: { UserInfoSimple },
};
</script>

<style type="css">
body {
  background-color: #d0d6d6;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* 
  #6bb2a0
  #e0ecde
  #cde0c9
  #6bb2a0
  #2c6975

  #041421
  #042630
  #4c7273
  #86b9b0
  #d0d6d6
*/
.navbar {
  color: #d0d6d6;
  background-color: #4c7273;
  border-bottom: 1px solid #2c6975;
  margin-bottom: 1rem;
}
</style>
