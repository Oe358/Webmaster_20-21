<template>
  <div class = "container-fluid" id = "play-menu">
    <div class = "flex" id = "links-container">
      <router-link to = "/" class = "link">
        <div class = "img logo"></div>
        <div class = "text">Home</div>
      </router-link>
      <router-link to = "/play" class = "link">
        <div class = "img problem">
          <i class = "fa fa-cubes" aria-hidden = "true"></i>
        </div>
        <div class = "text">Play</div>
      </router-link>
      <router-link to = "/review" class = "link">
        <div class = "img review">
          <i class = "fa fa-retweet" aria-hidden = "true"></i>
        </div>
        <div class = "text">Review</div>
      </router-link>
      <router-link to = "/setup" class = "link">
        <div class = "img setup">
          <i class = "fa fa-sliders" aria-hidden = "true"></i>
        </div>
        <div class = "text">Setup</div>
      </router-link>
      <router-link to = "/submit" id = "submit-link" class = "link" v-if = "$store.getters.Contributor">
        <div class = "img setup">
          <i class = "fa fa-database" aria-hidden = "true" style = "color: #ff845d;"></i>
        </div>
        <div class = "text" style = "color: #ff845d;">Submit</div>
      </router-link>
      <router-link to = "/help" class = "link">
        <div class = "img help">
          <i class = "fa fa-question" aria-hidden = "true"></i>
        </div>
        <div class = "text">Help</div>
      </router-link>
    </div>

    <a href = "https://physicsgenie.ga/" id = "back-home" class = "link">
      <i class = "fa fa-long-arrow-left" aria-hidden = "true"></i>
      <div class = "text">Back to Site</div>
    </a>
  </div>
</template>

<script>
  export default {
    name: "Menu"
  }
</script>

<style scoped>


  #play-menu {
    position: fixed;
    width: 100px;
    top: 0;
    left: 0;
    background: rgb(29,34,41);
    z-index: 1000;
    transition: width .3s ease .1s;
    height: 100%;
  }

  #play-menu:hover {
    width: 280px;
    transition: width .4s ease;
  }

  #play-menu .flex {
    display: flex;
    margin-top: 30px;
    flex-direction: column;
    height: 408px;
    justify-content: space-around;
    align-items: flex-start;
  }

  #play-menu .flex > .link {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 50px;
    width: 100%;
  }

  #play-menu .flex > .link:hover {
    background: #111521;
  }

  .link {
    text-decoration: none !important;
  }

  #play-menu .flex > .link:nth-child(1) {
    margin-bottom: 30px;
  }

  #play-menu .img {
    position: relative;
    width: 30px;
    height: 30px;
    margin: 0 35px 0 35px;
  }

  #play-menu .img.logo {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin: 0 20px 0 20px;
    background: white;
  }

  #play-menu .img .fa {
    font-size: 30px;
    color: white;
  }

  #play-menu .img.logo::after {
    content: "";
    background: url("../assets/logo.svg") no-repeat center;
    width: 80%;
    height: 90%;
    position: absolute;
    top: 5%;
    left: 13%;
  }


  #play-menu .text {
    color: white;
    font-family: "Montserrat", sans-serif;
    font-size: 17px;
    width: 0;
    text-align: left;
    margin-left: -15px;
    opacity: 0;
    transition: width .3s ease .1s, opacity .2s ease;
  }

  #play-menu .flex > .link:nth-child(1) .text {
    margin-left: 0;
  }

  #play-menu:hover .text {
    width: 70px;
    opacity: 1;
    transition: width .4s ease, opacity .1s ease .3s;
  }


  #back-home {
    position: absolute;
    bottom: 100px;
    height: 60px;
    width: 100%;
    background: rgb(34,37,41);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    cursor: pointer;
    transition: height .25s ease, bottom .25s ease;
  }

  #back-home:hover {
    height: 80px;
    bottom: 90px;
  }

  #back-home .fa {
    color: white;
    font-size: 25px;
    position: relative;
    left: 10px;
    transition: left .3s ease .1s;
  }

  #back-home .text {
    line-height: 100%;
  }

  #play-menu:hover #back-home .fa {
    left: 25px;
    transition: left .4s ease;
  }

  #play-menu:hover #back-home .text {
    width: 150px;
  }


</style>
