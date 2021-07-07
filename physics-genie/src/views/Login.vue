<template>
  <div class = "container" v-bind:style = "{height: $store.getters.WindowHeight + 'px'}">
    <div class = "content">
      <h2>Physics Genie</h2>
      <div id = "errors" v-if = "showError">
        <p v-if = "showError" class = "error">Email/Username or Password is incorrect</p>
      </div>
      <form @submit.prevent = "submit">
        <div>
          <label>Email/Username</label><br>
          <input type = "text" name = "username" v-model="form.username" />
        </div>
        <div>
          <label>Password</label><br>
          <input type = "password" name = "password" v-model = "form.password" />
        </div>
        <div>
          <input type = "checkbox" name = "remember" v-model = "form.rememberMe" />
          <label id = "remember">Remember Me</label>
        </div>
        <button type = "submit">LOG IN</button>
        <router-link id = "lost-password" to = "/" class = "link">Forgot your Password?</router-link>
      </form>
    </div>
    <div class = "register">
      <h6>Don't have an account? Register <router-link to = "/register" class = "link">here</router-link>.</h6>
    </div>
  </div>
</template>

<script>

  import { mapActions } from "vuex";

  export default {
    name: "Login",
    data() {
      return {
        form: {
          username: "",
          password: "",
          rememberMe: ""
        },
        showError: false
      }
    },
    methods: {
      ...mapActions(["LogIn"]),
      async submit() {
        let self = this;
        const User = new FormData();
        User.append("username", this.form.username);
        User.append("password", this.form.password);
        try {
          this.$store.commit('setProcessing', true);
          await this.LogIn(User);
          this.$store.commit('setProcessing', false);
          self.$router.push("/");
          this.showError = false
        } catch (error) {
          console.log(error);
          this.showError = true;
          this.$store.commit('setProcessing', false);
        }
      }
    }
  }
</script>

<style scoped>
  .container {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    position: relative;
    flex-direction: column;
  }

  .content {
    width: 450px;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 16px;
    padding: 50px;
    background: white;
    position: relative;
    top: 0;
    box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
  }

  #errors {
    background: rgba(255, 207, 209, 0.6);
    width: 85%;
    color: #ff6469;
    font-size: 13px;
    padding: 15px 25px;
    margin: 20px 0;
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
  }

  #errors p {
    color: #ff6469;
    font-family: "Nunito", sans-serif;
    font-size: 13px;
  }

  .content h2 {
    font-family: "Antic", sans-serif;
    font-size: 35px;
  }

  .content form div {
    margin: 20px 0;
    width: 100%;
    font-size: 15px;
    color: rgba(64, 64, 64, 0.81);
    font-family: "Nunito", sans-serif;
    font-weight: lighter;
  }

  .content form input {
    width: 95%;
    border-radius: 0;
    border: 1px solid #ddd;
    color: #333;
    background-color: transparent;
    outline: none;
    font-family: "Montserrat", sans-serif;
    padding: 8px 10px;
    height: 20px;
    margin-top: 5px;
  }

  .content form input:focus {
    border: 1px solid #b9b9b9;
  }

  .content form input[type = "checkbox"] {
    margin-right: 10px;
    width: 15px;
    border-radius: 0 !important;
    border: 1px solid #cccccc;
  }

  #remember {
    position: relative;
    margin: 0;
    top: -5px;
  }

  .content button {
    width: 100%;
    border: 1px #285380 solid;
    color: #285380;
    padding: 10px 0;
    font-family: "Nunito", sans-serif;
    cursor: pointer;
    background: none;
    transition: color .5s ease, background .5s ease;
    margin-bottom: 15px;
  }

  .content button:hover {
    color: white;
    background: #285380;
  }

  .content .link {
    font-family: "Karla", sans-serif;
    font-size: 13px;
  }

  .register {
    width: 450px;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 13px;
    padding: 20px 35px;
    background: white;
    position: relative;
    top: 10px;
  }

  .register h6 {
    font-weight: 600;
    font-family: "Montserrat", sans-serif;
    font-size: 13px;
  }

  .register .link {
  }




</style>
