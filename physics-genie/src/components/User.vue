<template>
  <div id = "user-container">
    <div id = "user" v-on:click = "navigate('')">
      <div class = "img avatar">
        <i class = "fa fa-user-circle-o" aria-hidden = "true"></i>
      </div>
      <div class = "text">{{ user }}</div>
    </div>
    <div id = "user-menu">
      <div class = "link" v-on:click = "navigate('setup')">
        <div class = "text">Problem Setup</div>
      </div>
      <div class = "link" v-on:click = "logOut">
        <i class = "fa fa-power-off" aria-hidden = "true"></i>
        <div class = "text">Logout</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      return {
        user: this.$store.getters.StateUser
      }
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
    border-bottom: 2px solid rgb(29,34,41);
    position: relative;
    height: 50px;
    padding: 0 30px;
    min-width: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: top .5s ease .2s;
  }

  #user::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0;
    width: 2px;
    background: rgb(29, 34, 41);
    transition: height .25s ease;
  }

  #user::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    height: 0;
    width: 2px;
    background: rgb(29, 34, 41);
    transition: height .25s ease;
  }

  #user .text {
    font-size: 15px;
    margin-left: 10px;
    color: rgb(29, 34, 41);
    font-family: "Montserrat", sans-serif;
  }

  #user .fa {
    font-size: 22px;
  }


  #user-menu {
    position: relative;
    opacity: 0;
    display: flex;
    border-top: 7px solid white;
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

  #user-menu .link {
    border: 2px solid #111521;
    height: 45px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    margin-bottom: 5px;
    background: white;
    transition: background .25s ease;
  }

  #user-menu .link:hover {
    background: #111521;
  }

  #user-menu .fa {
    color: rgb(29, 34, 41);
    font-size: 15px;
    margin-top: 2px;
    margin-right: 8px;
    transition: color .25s ease;
  }

  #user-menu .text {
    color: rgb(29, 34, 41);
    font-family: "Montserrat", sans-serif;
    font-size: 15px;
    width: 100%;
    text-align: left;
    transition: color .25s ease;
  }

  #user-menu .link:hover .fa {
    color: white;
  }

  #user-menu .link:hover .text {
    color: white;
  }

</style>
