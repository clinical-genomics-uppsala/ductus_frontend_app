<template>
  <div>
    <h5 class="d-inline-flex align-items-center">
      {{ username }}
      <button class="btn bg-transparent bg-sign-out" @click="logout">
        <i class="bi bi-box-arrow-right"></i>
      </button>
    </h5>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserInfoSimple",
  props: {
    username: String,
  },
  methods: {
    logout() {
      const token = this.$store.state.token;
      const username = this.$store.state.token;

      axios
        .post("api/v1/token/logout/")
        .then(() => {
          this.$store.commit("removeToken");

          axios.defaults.headers.common["Authorization"] = "";

          localStorage.removeItem("token", token);
          localStorage.removeItem("username", username);

          this.$router.replace("/log-in");
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.bg-sign-out {
  color: #cde0c9;
}
</style>
