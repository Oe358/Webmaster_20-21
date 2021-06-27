<template>
  <div class = "container">
    <Menu />
    <User />
    <div class = "content">
      <div id = "profile" class = "box">
        <div class = "avatar">
          <i class = "fa fa-user-circle-o img"></i>
          <div class = "change">Change<br>Avatar</div>
        </div>
        <div class = "profile-info">
          <div class = "username" v-bind:style = "{'box-shadow': editingName ? '0 0 10px 1px rgba(17, 21, 33, 0.3)' : 'none'}"><input v-bind:readonly = "!editingName" v-model = "user" ref = "nameInput" v-bind:style = "{width: editingName ? '165px' : '180px'}"><i v-if = "editingName" class = "fa fa-times cancel" v-on:click = "cancelNameEdit"></i><i class = "fa" v-bind:class = "editingName ? 'fa-check' : 'fa-pencil'" v-on:click = "editName" v-bind:style = "{color: editingName ? 'rgb(5, 178, 0)' : 'black'}"></i></div>
          <router-link to = "/" class = "link">Change Password</router-link>
          <router-link to = "/setup" class = "link">Problem Setup</router-link>
        </div>
      </div>
      <div id = "settings" class = "box">
        <!--Topic: {{ submitData.topics.filter(function(topic) {return topic.topic === setup.topics[0]})[0].name }}-->
        <!--Focus: {{ submitData.focuses.filter(function(focus) {return focus.focus === setup.foci[0]})[0].name }}-->
      </div>
      <div id = "summary" class = "box">
        <div class = "summary-info left">
          <div class = "descriptors">
            <div>Problems Correct</div>
            <div>Problems Incorrect</div>
            <div>Problems Skipped</div>
          </div>
          <div class = "values">
            <div>{{ userStats.correct }}</div>
            <div>{{ userStats.presented - userStats.skipped - userStats.correct }}</div>
            <div>{{ userStats.skipped }}</div>
          </div>
        </div>
        <div>
          <radial-progress-bar class = "progress-bar" :diamater = "100" :completed-steps = "userStats.xp-Math.pow(Math.floor(Math.sqrt(userStats.xp+9)), 2)+9" :total-steps = "2*Math.floor(Math.sqrt(userStats.xp+9))+1" start-color = "#E8D2A9" stop-color = "#000A5D" inner-stroke-color = "#08232D" :stroke-width = "30" :inner-stroke-width = "35" stroke-linecap = "butt">
            <span class = "level">{{ Math.floor(Math.sqrt(userStats.xp+9))-2 }}</span>
            <span class = "xp">{{ userStats.xp }}</span>
          </radial-progress-bar>
        </div>
        <div class = "summary-info right">
          <div class = "descriptors">
            <div>Longest Winstreak</div>
            <div>Longest Losestreak</div>
            <div>Current Streak</div>
          </div>
          <div class = "values">
            <div>{{ longestWinstreak }}</div>
            <div>{{ longestLosestreak }}</div>
            <div>10</div>
          </div>
        </div>
      </div>
      <div class = "box" v-for = "topic in submitData.topics">
        <h2>{{ topic.name }}</h2>
      </div>
    </div>
  </div>
</template>

<script>

  import Menu from "../components/Menu";
  import User from "../components/User";
  import RadialProgressBar from "vue-radial-progress/src/RadialProgressBar";
  import { mapGetters } from "vuex";

  export default {
    name: "Home",
    components: {
      RadialProgressBar,
      Menu,
      User
    },
    data() {
      return {
        user: this.$store.getters.StateUser,
        editingName: false
      }
    },
    computed: {
      ...mapGetters({
        setup: 'UserSetup',
        submitData: 'ProblemMetaData',
        longestWinstreak: 'LongestWinstreak',
        longestLosestreak: 'LongestLosestreak',
        userStats: 'UserStats'
      })
    },
    methods: {
      editName: function() {
        if (this.editingName) {
          this.$store.dispatch('SetUserName', this.user);
        } else {
          this.$refs.nameInput.focus();
        }

        this.editingName = !this.editingName;
      },
      cancelNameEdit: function() {
        this.user = this.$store.getters.StateUser;
        this.editingName = false;
      }
    },
    updated() {
      this.$store.dispatch('GetUserStats');
    },
    mounted() {

    }
  }
</script>

<style scoped>

  .content {
    width: calc(85% - 100px);
    position: relative;
    margin: 80px 0 -50px calc(7.5% + 80px);
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .link {
    font-family: "Karla", sans-serif;
    font-size: 13px;
  }

  .box {
    background: white;
    max-width: 100%;
    border-radius: 40px;
    box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
    border: none;
    padding: 25px 40px;
    transition: box-shadow .3s ease;
    margin: 20px 0 0 20px;
    height: 150px;
  }

  .box:hover {
    box-shadow: 0 0 10px 13px rgba(17, 21, 33, 0.3);
  }

  .box h2 {
    font-family: "Antic", sans-serif;

  }

  #profile {
    width: 500px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .avatar {
    color: rgb(29, 34, 41);
    cursor: pointer;
    border-radius: 50%;
    position: relative;
  }

  .avatar .img {
    font-size: 115px;
  }

  .avatar .change {
    font-size: 13px;
    position: absolute;
    padding-top: 5px;
    box-sizing: border-box;
    opacity: 0;
    top: 50%;
    left: 0;
    width: 100%;
    height: 50%;
    border-radius: 0 0 1000px 1000px;
    background: rgba(17, 21, 33, 0.6);
    color: #e1e1e1;
    text-align: center;
    font-family: "Montserrat", sans-serif;
    transition: opacity .3s ease;
  }

  .avatar:hover .change {
    opacity: 1;
  }

  .profile-info {
    margin-left: 30px;
    padding: 8px 0 15px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
    height: 75%;
  }

  .username {
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
    width: 200px;
    border: 1px solid rgba(29, 34, 41, 0.2);
    border-radius: 6px;
    padding: 8px 12px;
    position: relative;
    transition: box-shadow .3s ease;
  }

  .username input {
    border: none;
    padding: 0;
    outline: none;
    font-family: "Montserrat", sans-serif;
    font-size: 14px;
  }

  .username .fa {
    position: absolute;
    right: 10px;
    top: 9px;
    cursor: pointer;
  }

  .username .cancel {
    right: 30px;
    color: #ff2540;
  }

  #settings {
    width: 200px;
  }

  #summary {
    width: 100%;
    padding: 50px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .progress-bar {
    bottom: 20px;
    font-family: "Montserrat", sans-serif;
    font-size: 40px;
  }

  .xp {
    font-size: 13px;
    margin-top: -5px;
  }

  .summary-info {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    height: 100%;
    box-sizing: border-box;
    padding: 20px 5% 20px 8%;
    width: 35%;
    font-family: "Nunito", sans-serif;
    font-size: 15px;
    border-radius: 0 1000px 1000px 0;
    box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
  }

  .summary-info > div {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .summary-info .descriptors {
    margin-right: 40px;
  }

  .summary-info.right {
    padding: 20px 8% 20px 5%;
    border-radius: 1000px 0 0 1000px;
  }

  .summary-info.right .descriptors {
    text-align: right;
  }


</style>
