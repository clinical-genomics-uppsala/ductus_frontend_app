<template>
  <div class="container">
    <div class="vh-100 d-flex align-items-center justify-content-center">
      <div class="sign-in" v-if="isAuthenticated">
        <h1>Sign out</h1>
        <h6>Ductus Processing</h6>
        <button @click="logout" class="btn btn-primary w-100">Log out</button>
        <p class="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
      </div>
      <div class="sign-in" v-else>
        <h1>Sign in</h1>
        <h6>Ductus Processing</h6>
        <form @submit.prevent="submitForm">
          <div class="form-floating">
            <input
              id="username"
              class="form-control"
              type="text"
              v-model="username"
              required
            />
            <label for="username">USERNAME</label>
          </div>
          <div class="form-floating">
            <input
              id="password"
              class="form-control"
              type="password"
              name="password-input"
              v-model="password"
              required
            />
            <label for="password">SECRET PASSWORD</label>
          </div>
          <button type="submit" class="btn btn-primary w-100">Log In</button>
          <p class="mt-5 mb-3 text-body-secondary">&copy; 2024</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LogInView",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  beforeCreate() {
    console.log(this.$store.state.isAuthenticated);
  },
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  created() {
    this.username = this.$store.state.username;
  },
  methods: {
    logout() {
      const token = this.$store.state.token;
      axios.defaults.headers.common["Authorization"] = "Token " + token;

      axios
        .post("api/v1/token/logout/")
        .then(() => {
          this.$store.commit("removeToken");

          axios.defaults.headers.common["Authorization"] = "";

          localStorage.removeItem("token", token);
          localStorage.removeItem("username", this.username);
        })
        .catch((error) => console.log(error));
    },
    submitForm() {
      const formData = {
        username: this.username,
        password: this.password,
      };

      axios
        .post("api/v1/token/login", formData)
        .then((response) => {
          const token = response.data.auth_token;
          console.log(token + " " + formData.username);
          this.$store.commit("setToken", token, formData.username);
          this.$store.commit("setUsername", formData.username);

          axios.defaults.headers.common["Authorization"] = "Token " + token;

          localStorage.setItem("token", token);
          localStorage.setItem("username", formData.username);

          this.$router.replace("/dashboard");
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scoped>
.sign-in {
  max-width: 330px;
  margin: auto;
  padding: 1rem;
}

.sign-in .form-floating:focus-within {
  z-index: 2;
}

.sign-in input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.sign-in input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.fill {
  min-height: 100%;
  height: 100%;
}
</style>
