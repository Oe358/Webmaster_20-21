<template>
  <div class = "container" v-bind:style = "{minHeight: $store.getters.WindowHeight + 'px'}">
    <div class = "content">
      <h2>Register</h2>
      <div id = "errors" v-if = "errors.length > 0">
        <p>Please address the following errors:</p>
        <ul>
          <li v-for = "error in errors" v-bind:key = "error" class = "error">{{ error }}</li>
        </ul>
      </div>
      <form @submit.prevent="submit">
        <div>
          <label for="email">Email:</label>
          <input type="text" name="email" id = "email" v-model="form.email">
        </div>
        <div>
          <label for="username">Username:</label>
          <input type="text" name="username" id = "username" v-model="form.username">
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" name="password" id = "password" v-model="form.password">
        </div>
        <div id = "pass-confirm-div">
          <label for="pass-confirm">Confirm Password:</label>
          <input type="password" name="pass-confirm" id = "pass-confirm" v-model="passConfirm">
        </div>
        <button type="submit"> Submit</button>
      </form>
    </div>
    <div class = "login">
      <h6>Already have an account? Log in <router-link to = "/login" class = "link">here</router-link>.</h6>
    </div>
  </div>
</template>

<script>

  import { mapActions } from "vuex";

  export default {
    name: "Register",
    components: {},
    data() {
      return {
        form: {
          email: "",
          username: "",
          password: "",
        },
        passConfirm: "",
        errors: []
      };
    },
    methods: {
      ...mapActions(["Register"]),
      async submit() {
        this.$store.commit('setProcessing', true);

        this.errors = [];

        if (this.form.email === "" || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.form.email)) {
          this.errors.push("Please enter a valid email address");
        }

        if (this.form.username === "") {
          this.errors.push("Please enter a username");
        }

        if (this.form.password.length < 5) {
          this.errors.push("Please enter a password that is at least 5 characters long");
        }

        if (this.form.password !== this.passConfirm) {
          this.errors.push("Your passwords do not match");
        }

        if (this.errors.length === 0) {
          try {
            await this.Register(this.form);
            this.$store.commit('setProcessing', false);
            this.$router.push("/");
            this.error = null;
          } catch (error) {
            this.error = error;
          }
        } else {
          this.$store.commit('setProcessing', false);
        }

      },
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
    padding: 65px 0;
    box-sizing: border-box;
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
    color: #ff6469;
    font-size: 13px;
    padding: 15px 20px;
    margin-bottom: 20px;
    margin-top: 20px;
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
  }

  #errors p {
    color: #ff6469;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
  }

  #errors ul {
    font-size: 10px;
    margin: 10px 30px 0 30px;
    font-family: "Montserrat", sans-serif;
  }

  #errors ul li {
    margin: 3px 0;
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

  .login {
    width: 450px;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 13px;
    padding: 20px 35px;
    background: white;
    position: relative;
    top: 10px;
  }

  .login h6 {
    font-weight: 600;
    font-family: "Montserrat", sans-serif;
    font-size: 13px;
  }



</style>
