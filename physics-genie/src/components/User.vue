<template>
  <div id = "user-container">
    <div id = "user" v-on:click = "navigate('')">
      <div class = "img avatar">
        <i class = "fa fa-user-circle-o" aria-hidden = "true"></i>
      </div>
      <div class = "text">{{ user }}</div>
    </div>
    <div id = "user-menu">
      <div class = "link-button" v-on:click = "navigate('setup')">
        <div class = "text">Problem Setup</div>
      </div>
      <div class = "link-button" v-on:click = "logOut">
        <i class = "fa fa-power-off" aria-hidden = "true"></i>
        <div class = "text">Logout</div>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapGetters } from "vuex";

  export default {
    name: "User",
    computed: {
      ...mapGetters({
        user: 'StateUser'
      })
    },
    methods: {
      navigate: function(place) {
        this.$router.push("/" + place);
      },
      async logOut (){
        await this.$store.dispatch('LogOut');
        this.$router.push('/login');
      }
    }
  }
</script>

<style scoped>

  #user-container {
    position: fixed;
    width: inherit;
    height: 50px;
    right: 110px;
    top: 0;
    z-index: 1000;
  }

  #user {
    border-bottom: 2px solid var(--user-menu-color);
    position: relative;
    height: 50px;
    padding: 0 30px;
    min-width: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--user-menu-color);
    transition: top .5s ease .2s;
  }

  #user::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0;
    width: 2px;
    background: var(--user-menu-color);
    transition: height .25s ease;
  }

  #user::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    height: 0;
    width: 2px;
    background: var(--user-menu-color);
    transition: height .25s ease;
  }

  #user .text {
    font-size: 15px;
    margin-left: 10px;
    /*color: rgb(29, 34, 41);*/
    color: var(--user-menu-color);
    font-family: "Montserrat", sans-serif;
  }

  #user .fa {
    font-size: 22px;
  }


  #user-menu {
    position: relative;
    opacity: 0;
    display: flex;
    border-top: 7px solid transparent;
    cursor: pointer;
    flex-direction: column;
    justify-content: center;
    visibility: hidden;
    transition: top .25s ease, opacity .25s ease, visibility .0s ease .25s;
  }

  #user:hover::before {
    height: 50px;
  }

  #user:hover::after {
    height: 50px;
  }

  #user:hover + #user-menu, #user-menu:hover {
    opacity: 1;
    visibility: visible;
    transition: top .25s ease, opacity .25s ease;
  }

  #user-menu .link-button {
    /*border: 2px solid #111521;*/
    border: 2px solid var(--user-menu-color);
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    margin-bottom: 5px;
    background: none;
    transition: background .25s ease;
  }

  #user-menu .link-button:hover {
    /*background: #111521;*/
    background: var(--user-menu-color);
  }

  #user-menu .fa {
    color: var(--user-menu-color);
    font-size: 15px;
    margin-top: 2px;
    margin-right: 8px;
    transition: color .25s ease;
  }

  #user-menu .text {
    color: var(--user-menu-color);
    font-family: "Montserrat", sans-serif;
    font-size: 15px;
    width: 100%;
    text-align: left;
    transition: color .25s ease;
  }

  #user-menu .link-button:hover .fa {
    /*color: #111521;*/
    color: white;
  }

  #user-menu .link-button:hover .text {
    /*color: #111521;*/
    color: white;
  }

</style>
