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
      <div id = "overview" class = "box">
        <div class = "row">
          <div>
            <h3>Level</h3>
            <p>{{ Math.floor(Math.sqrt(userStats.xp+9))-2 }}</p>
          </div>
          <div>
            <h3>Total XP</h3>
            <p>{{ userStats.xp }}</p>
          </div>
        </div>
        <div>
          <h3>Problems Attempted</h3>
          <p>{{ userStats.presented }}</p>
        </div>
      </div>
      <div id = "summary" class = "box">
        <div class = "summary-info left">
          <div class = "descriptors">
            <div>Problems Correct</div>
            <div>Problems Incorrect</div>
            <div>Average Attempts</div>
          </div>
          <div class = "values">
            <div>{{ userStats.correct }}</div>
            <div>{{ userStats.presented - userStats.correct }}</div>
            <div>{{ userStats.avgAttempts.toFixed(2) }}</div>
          </div>
        </div>
        <div>
          <radial-progress-bar class = "progress-bar" :diamater = "100" :completed-steps = "userStats.xp-Math.pow(Math.floor(Math.sqrt(userStats.xp+9)), 2)+9" :total-steps = "2*Math.floor(Math.sqrt(userStats.xp+9))+1" start-color = "#E8D2A9" stop-color = "#000A5D" inner-stroke-color = "#08232D" :stroke-width = "30" :inner-stroke-width = "35" stroke-linecap = "butt">
            <span class = "level">{{ Math.floor(Math.sqrt(userStats.xp+9))-2 }}</span>
            <span class = "xp">{{ userStats.xp-Math.pow(Math.floor(Math.sqrt(userStats.xp+9)), 2)+9 }} / {{ 2*Math.floor(Math.sqrt(userStats.xp+9))+1 }}</span>
          </radial-progress-bar>
        </div>
        <div class = "summary-info right">
          <div class = "descriptors">
            <div>Longest Winstreak</div>
            <div>Longest Losestreak</div>
            <div>Current Streak</div>
          </div>
          <div class = "values">
            <div>{{ userStats.longestWinstreak }}</div>
            <div>{{ userStats.longestLosestreak }}</div>
            <div>{{ (userStats.streak > 0 ? "+" : "-") + Math.abs(userStats.streak)}}</div>
          </div>
        </div>
      </div>
      <div id = "breakdown" class = "box">
        <h1 v-on:click = "toggleBreakdown" ><i class = "fa fa-angle-right" v-bind:style = "[{transform: breakdown ? 'rotate(90deg)' : 'rotate(0deg)'}, {marginRight: breakdown ? '12px' : '8px'}]"></i>Focus Breakdown</h1>
        <div v-if = "breakdown">
          <div v-for = "focus in userStats.topics[0].foci.filter(function(focusTemp) {return focusTemp.presented > 0}).sort((firstEl, secondEl) => {return (secondEl.xp > firstEl.xp ? 1 : -1)})" v-bind:key = "focus.focusId" class = "breakdown-focus">
            <div class = "initial">
              <h3>{{ focus.focus }} ({{ focus.xp }})</h3>
              <ProgressBar class = "progress-bar" v-bind:xp = "focus.xp" v-bind:add = "null" />
              <i class = "fa fa-angle-down" v-on:click = "toggleFocusExpand(focus.focusId)" v-bind:style = "{transform: fociExpanded.includes(focus.focusId) ? 'rotate(180deg)' : 'rotate(0deg)'}"></i>
            </div>
            <div class = "expanded" v-bind:style = "{height: fociExpanded.includes(focus.focusId) ? '200px' : '0'}">
              <div>
                <div class = "descriptors">
                  <div>Level</div>
                  <div>Total XP</div>
                  <div>Problems Attempted</div>
                </div>
                <div class = "values">
                  <div>{{ Math.floor(Math.sqrt(focus.xp+9))-2 }}</div>
                  <div>{{ focus.xp }}</div>
                  <div>{{ focus.presented }}</div>
                </div>
              </div>
              <div>
                <div class = "descriptors">
                  <div>Problems Correct</div>
                  <div>Problems Incorrect</div>
                  <div>Average Attempts</div>
                </div>
                <div class = "values">
                  <div>{{ focus.correct }}</div>
                  <div>{{ focus.presented - focus.correct }}</div>
                  <div>{{ focus.avgAttempts.toFixed(2) }}</div>
                </div>
              </div>
              <div>
                <div class = "descriptors">
                  <div>Longest Winstreak</div>
                  <div>Longest Losestreak</div>
                  <div>Current Streak</div>
                </div>
                <div class = "values">
                  <div>{{ focus.longestWinstreak }}</div>
                  <div>{{ focus.longestLosestreak }}</div>
                  <div>{{ (focus.streak > 0 ? "+" : "-") + Math.abs(focus.streak)}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import Menu from "../components/Menu";
  import User from "../components/User";
  import RadialProgressBar from "vue-radial-progress/src/RadialProgressBar";
  import { mapGetters } from "vuex";
  import ProgressBar from '../components/ProgressBar';

  export default {
    name: "Home",
    components: {
      RadialProgressBar,
      Menu,
      User,
      ProgressBar
    },
    data() {
      return {
        user: this.$store.getters.StateUser,
        editingName: false,
        breakdown: false,
        fociExpanded: []
      }
    },
    computed: {
      ...mapGetters({
        setup: 'UserSetup',
        submitData: 'ProblemMetaData',
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
      },
      toggleBreakdown: function() {
        this.breakdown = !this.breakdown;
      },
      toggleFocusExpand: function(focusId) {
        if (this.fociExpanded.includes(focusId)) {
          this.fociExpanded.splice(this.fociExpanded.indexOf(focusId), 1);
        } else {
          this.fociExpanded.push(focusId);
        }
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

  .box h1 {
    font-family: "Antic", sans-serif;
  }

  #profile {
    width: 45%;
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

  /*.avatar:hover .change {*/
    /*opacity: 1;*/
  /*}*/

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

  #overview {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
  }

  #overview .row {
    display: flex;
    flex-direction: row;
  }

  #overview .row div {
    margin-right: 30px;
  }

  #overview h3 {
    font-family: "Nunito", sans-serif;
    font-size: 16px;
    border-bottom: 1px solid black;
    font-weight: light;
  }

  #overview p {
    font-family: "Nunito", sans-serif;
    font-size: 15px;
    margin-top: 5px;
  }

  #summary {
    width: 100%;
    padding: 50px 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  #summary .progress-bar {
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

  #breakdown {
    height: inherit;
    width: 100%;
    padding: 40px 60px;
    margin-bottom: 50px;
  }

  #breakdown > div {
    margin-top: 40px;
  }

  #breakdown h1 {
    cursor: pointer;
    position: relative;
    display: inline-block;
  }

  #breakdown h1::after {
    content: "";
    position: absolute;
    bottom: -7px;
    left: 20px;
    width: 0;
    height: 2px;
    background: black;
    transition: width .3s ease;
  }

  #breakdown h1:hover::after {
    width: calc(100% - 20px);
  }

  #breakdown h1 .fa-angle-right {
    transition: transform .3s ease, margin-right .3s ease;
  }

  #breakdown .breakdown-focus {
    border-top: 1px solid #285380;
    background: transparent;
  }

  #breakdown .breakdown-focus:hover {
    background: rgba(153, 161, 227, 0.2);
  }

  #breakdown .initial {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }

  #breakdown h3 {
    font-family: "Nunito", sans-serif;
    font-size: 16px;
    font-weight: lighter;
    margin-left: 15px;
    width: 25%;
  }

  #breakdown .progress-bar {
    width: 60%;
  }

  #breakdown .fa-angle-down {
    margin-left: 3%;
    font-size: 22px;
    cursor: pointer;
    background: transparent;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    text-align: center;
    vertical-align: middle;
    line-height: 30px;
    transition: background .2s ease;
  }

  #breakdown .fa-angle-down:hover {
    background: rgba(153, 161, 227, 0.4);
    transition: transform .3s ease;
  }


  #breakdown .expanded {
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    transition: height .3s ease;
    font-family: "Nunito", sans-serif;
    font-size: 13px;
  }

  #breakdown .expanded > div {
    background: white;
    border-radius: 20px;
    box-shadow: 0 0 10px 0.5px rgba(17, 21, 33, 0.2);
    border: none;
    padding: 25px 40px;
    display: flex;
    flex-direction: row;
    margin-top: -10px;
  }

  #breakdown .breakdown-focus:hover .expanded > div {
    background: #f9fbff;
  }

  #breakdown .expanded > div > div {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  #breakdown .expanded > div > div > div {
    margin: 5px 0;
  }

  #breakdown .expanded .descriptors {
    margin-right: 40px;
  }

  #breakdown .expanded .values {
    text-align: right;
  }


</style>
