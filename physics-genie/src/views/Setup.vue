<template>
  <div class = "container">
    <Menu />
    <User />
    <div class = "flex-container">
      <div class = "content">
        <h2>Problem Setup</h2>
        <div class = "inner-content">
          <div class = "selectors box">
            <div class = "topics selector">
              <label>Topics</label>
              <v-select placeholder = "Select the topics you would like to practice" label = "name" :options = "submitData.topics" :reduce = "topic => topic.topic" v-model = "userSetup.topics" multiple></v-select>
              <button v-on:click = "addAllTopics" class = "add-all"><i class = "fa fa-plus"></i>Add All Topics</button>
            </div>
            <div class = "foci selector">
              <label>Focuses</label>
              <v-select placeholder = "Select the focuses you would like to practice" label = "name" :options = "submitData.focuses" :reduce = "focus => focus.focus" v-model = "userSetup.foci" multiple></v-select>
              <button v-on:click = "addAllFoci" class = "add-all"><i class = "fa fa-plus"></i>Add All Focuses</button>
            </div>
          </div>
          <div class = "box box-two">
            <div class = "difficulty">
              <p>Difficulty</p>
              <div class = "options">
                <div class = "option" v-bind:class = "userSetup.difficulty === '0' ? 'active' : ''" v-on:click = "changeDifficulty('0')">
                  <div class = "circle"></div>
                  <span>Easy</span>
                </div>
                <div class = "option" v-bind:class = "userSetup.difficulty === '1' ? 'active' : ''" v-on:click = "changeDifficulty('1')">
                  <div class = "circle"></div>
                  <span>Medium (Default)</span>
                </div>
                <div class = "option" v-bind:class = "userSetup.difficulty === '2' ? 'active' : ''" v-on:click = "changeDifficulty('2')">
                  <div class = "circle"></div>
                  <span>Hard</span>
                </div>
              </div>
              <div class = "calculus">
                <p>Calculus</p>
                <div class = "options">
                  <div class = "option" v-bind:class = "userSetup.calculus ? 'active' : ''" v-on:click = "changeCalculus(true)">
                    <div class = "circle"></div>
                    <span>Allowed (Default)</span>
                  </div>
                  <div class = "option" v-bind:class = "!userSetup.calculus ? 'active' : ''" v-on:click = "changeCalculus(false)">
                    <div class = "circle"></div>
                    <span>None</span>
                  </div>
                </div>
              </div>
            </div>
            <div class = "buttons">
              <div id = "clear" class = "button" v-on:click = "reset()">Reset Changes</div>
              <div id = "save" class = "button red" v-on:click = "push()">Push Changes</div>
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
  import vSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css';
  import axios from 'axios';

  export default {
    name: "Setup",
    components: {
      Menu,
      User,
      vSelect
    },
    data() {
      return {
        submitData: this.$store.getters.ProblemMetaData
      }
    },
    computed: {
      userSetup: {
        get() {
          return this.$store.getters.UserSetup
        },
        set(value) {
          this.$store.commit('setUserSetup', value);
        }
      }
    },
    methods: {
      addAllTopics: function() {
        let self = this;
        this.submitData.topics.forEach(function(topic) {
          if (!self.userSetup.topics.includes(topic.topic)) {
            self.userSetup.topics.push(topic.topic);
          }
        });
      },
      addAllFoci: function() {
        let self = this;
        this.submitData.focuses.forEach(function(focus) {
          if (!self.userSetup.foci.includes(focus.focus)) {
            self.userSetup.foci.push(focus.focus);
          }
        });
      },
      changeDifficulty: function(difficulty) {
        this.userSetup.difficulty = difficulty;
      },
      changeCalculus: function(calculus) {
        this.userSetup.calculus = calculus;
      },
      reset: function() {
        if (confirm("Are you sure you would like to reset all your current changes? This cannot be undone and will revert your settings to your previous push.")) {
          let self = this;
          this.$store.commit('setProcessing', true);
          this.$store.dispatch('GetUserInfo', this.$store.getters.Token).then(() => {
            self.$store.commit('setProcessing', false);
            self.$store.dispatch('Confirmation', "Problem settings successfully reverted");
          });
        }
      },
      push: function() {
        if (confirm("Are you sure you would like to push your current changes? This cannot be undone and will effect the types of problems you receive.")) {
          let self = this;
          this.$store.commit('setProcessing', true);
          axios.put('wp-json/physics_genie/user-setup', {
            curr_diff: this.userSetup.difficulty,
            curr_topics: this.userSetup.topics.toString().replace(/,/g, ''),
            curr_foci: this.userSetup.foci.toString().replace(/,/g, ''),
            calculus: this.userSetup.calculus ? "true" : "false"
          }, {headers: {'Authorization': 'Bearer ' + this.$store.getters.Token}}).then(() => {
            self.$store.commit('setProcessing', false);
            self.$store.dispatch("Confirmation", "Problem settings successfully pushed")
          });
        }
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>

  .flex-container {
    display: flex;
    width: 100%;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    flex-direction: column;
    font-family: "Nunito", sans-serif;
    padding-top: 100px;
  }

  .content {
    width: 70%;
    box-sizing: border-box;
    border: 1px solid #cccccc;
    border-radius: 20px;
    padding: 50px;
    margin-bottom: 100px;
    background: white;
    position: relative;
    top: 0;
    box-shadow: 0 0 10px 4px rgba(17, 21, 33, 0.3);
  }

  .content h2 {
    font-family: "Antic", sans-serif;
    font-size: 40px;
    margin-bottom: 30px;
  }

  .inner-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .box {
    border: 1px solid rgba(204, 204, 204, 0.8);
    width: 48.5%;
    padding: 15px 20px 25px 25px;
    box-sizing: border-box;
    border-radius: 16px;
    position: relative;
    box-shadow: 0 0 8px 0.5px rgba(17, 21, 33, 0.1);
    transition: box-shadow .3s ease;
  }

  .selector:first-child {
    margin-bottom: 20px;
  }

  .selector label {
    font-size: 18px;
  }

  .v-select {
    margin-top: 3px;
    font-size: 14px;
  }

  .selected .vs__selected {
    background-color: #99A1E3;
    color: #285380;
  }

  .add-all {
    background: none;
    border: 1px solid #285380;
    border-radius: 15px;
    cursor: pointer;
    padding: 3px 6px;
    color: #285380;
    margin-top: 8px;
    font-size: 10px;
    transition: font-weight .2s ease;
  }

  .add-all .fa {
    margin-right: 3px;
  }

  .add-all:hover {
    font-weight: 900;
  }

  .content p {
    font-size: 18px;
    margin-bottom: 6px;
  }

  .options {
    margin-left: 2px;
  }

  .options .option {
    font-size: 13px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: #285380;
    cursor: pointer;
    padding: 3px 0 3px 12px;
    border-radius: 5px;
    transition: background .3s ease, padding .3s ease;
    margin: 1px 0;
  }

  .options .option:hover {
    background: rgba(55, 128, 189, 0.1);
    padding-left: 15px;
  }

  .options .option.active .circle {
    background: #285380;
    transition: background .3s ease;
  }

  .options .circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: transparent;
    border: 2px solid #285380;
    display: inline-block;
    margin-right: 6px;
  }

  .calculus {
    margin-top: 20px;
  }

  .buttons {
    position: absolute;
    bottom: -70px;
    right: 5px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .box-two {
    margin-bottom: 70px;
  }

  .buttons .button {
    margin-left: 30px;
    font-size: 14px;
  }



</style>
