<template>
  <div class = "container">
    <div class = "content">
      <h2>Physics Genie</h2>
      <form @submit.prevent = "submit">
        <div>
          <label>Username:</label>
          <input type = "text" name = "username" v-model="form.username" />
        </div>
        <div>
          <label>Password:</label>
          <input type = "password" name = "password" v-model = "form.password" />
        </div>
        <button type = "submit">Submit</button>
      </form>
      <p v-if = "showError" id = "error">Username or Password is incorrect</p>
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
        },
        showError: false
      }
    },
    methods: {
      ...mapActions(["LogIn"]),
      async submit() {
        const User = new FormData();
        User.append("username", this.form.username);
        User.append("password", this.form.password);
        try {
          await this.LogIn(User);
          this.$router.push("/");
          this.showError = false
        } catch (error) {
          this.showError = true
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
    font-family: "Montserrat", sans-serif;
    flex-direction: column;
  }

  .content {
    width: 450px;
    border: 1px solid #cccccc;
    border-radius: 13px;
    padding: 45px 45px 32px 45px;
    background: white;
    position: relative;
    top: 0;
  }

</style>
