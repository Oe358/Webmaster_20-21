<template>
  <div class = "container" v-bind:style = "{height: $store.getters.WindowHeight + 'px'}">
    <div class = "content">
      <h2>Password Reset Form</h2>
      <div id = "errors" v-if = "error !== null">
        <p v-if = "error !== null" class = "error">{{ error }}</p>
      </div>
      <form @submit.prevent="submit">
        <div>
          <label for="email">Email:</label>
          <input type="text" name="email" id = "email" v-model="form.email">
        </div>
      </form>
    </div>
  </div>
</template>

<script>

  import { mapActions } from "vuex";

  export default {
    name: "PasswordReset",
    data() {
      return {
        form: {
          email: "",
          username: "",
          password: "",
        },
        error: null
      };
    },
    methods: {
      ...mapActions(["PasswordReset"]),
      async submit() {
        try {
          await this.PasswordReset(this.form);
          this.$router.push("/");
          this.error = null;
        } catch (error) {
          this.error = error;
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

</style>
