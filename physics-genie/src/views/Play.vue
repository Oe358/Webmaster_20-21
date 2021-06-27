<template>
  <div class = "container">
    <Menu />
    <User />
    <div class = "content" v-bind:style = "{minHeight: windowHeight + 'px'}">
      <div class = "problem-div" ref = "problemDiv">
        <Problem v-bind:problem = "problem" class = "problem" />
      </div>
    </div>
  </div>
</template>

<script>

  import Menu from "../components/Menu";
  import User from "../components/User";
  import Problem from "../components/Problem";
  import axios from 'axios';
  import { mapGetters } from "vuex";

  export default {
    name: "Play",
    components: {
      Menu,
      User,
      Problem
    },
    data() {
      return {
        windowHeight: window.innerHeight
      }
    },
    computed: {
      ...mapGetters({
        problem: 'CurrProblem'
      })
    },
    methods: {

    },
    mounted() {

    },
    created() {

      let self = this;

      if (this.$route.params.problem) {
        this.problem.problemID = this.$route.params.problem;

        axios.get('https://physicsgenie.ga/wp-json/physics_genie/problem/' + this.problem.problemID).then((response) => {
          console.log(response);
          self.problem.problemText = response.data.problem_text.replace(/\\\\/g, "\\").replace(/\\"/g, "'");
          self.problem.diagram = response.data.diagram.replace(/\\\\/g, "\\").replace(/\\"/g, "'");
          self.problem.answer = response.data.answer.replace(/\\\\/g, "\\").replace(/\\"/g, "'");
          self.problem.solution = response.data.solution.replace(/\\\\/g, "\\").replace(/\\"/g, "'");
          self.problem.hintOne = response.data.hint_one.replace(/\\\\/g, "\\").replace(/\\"/g, "'");
          self.problem.hintTwo = response.data.hint_two.replace(/\\\\/g, "\\").replace(/\\"/g, "'");
          self.problem.difficulty = response.data.difficulty;
          self.problem.topic = "Mechanics";
          self.problem.mainFocus = response.data.main_focus;
          response.data.other_foci.forEach(function(focus) {
            self.problem.otherFoci.push(focus.name);
          });
        });
      } else {
        this.$store.dispatch('GetCurrProblem', {token: this.$store.getters.Token, submitData: this.$store.getters.ProblemMetaData});
      }
    }
  }
</script>

<style scoped>

  .container {
    /*padding: 50px 0;*/
    /*box-sizing: border-box;*/
  }

  .content {
    width: 100%;
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 100px 0 75px 0;
    box-sizing: border-box;
  }

  .problem-div {
    width: 55%;
    margin-left: 50px;
    background-color: white;
    z-index: 1;
    padding: 60px;
    border-radius: 50px;
  }

  .problem {

  }

</style>
