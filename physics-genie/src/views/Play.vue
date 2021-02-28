<template>
  <div class = "container">
    <Menu />
    <User />
    <div class = "content" v-bind:style = "{height: windowHeight + 'px'}">
      <Problem v-bind:problem = "problem" class = "problem"/>
    </div>
  </div>
</template>

<script>

  import Menu from "../components/Menu";
  import User from "../components/User";
  import Problem from "../components/Problem";
  import axios from 'axios';

  export default {
    name: "Play",
    components: {
      Menu,
      User,
      Problem
    },
    data() {
      return {
        windowHeight: window.innerHeight,
        problem: {
          problemID: null,
          problemText: "",
          diagram: "",
          answer: "",
          solution: "",
          hintOne: "",
          hintTwo: null,
          difficulty: null,
          topic: "",
          mainFocus: "",
          otherFoci: []
        }
      }
    },
    created() {
      let self = this;

      if (this.$route.params.problem) {
        this.problem.problemID = this.$route.params.problem;

        axios.get('https://physicsgenie.ga/wp-json/physics_genie/problem/' + this.problem.problemID, User).then((response) => {
          self.problem.problemText = response.data.problem_text;
          self.problem.diagram = response.data.diagram;
          self.problem.answer = response.data.answer;
          self.problem.solution = response.data.solution;
          self.problem.hintOne = response.data.hint_one;
          self.problem.hintTwo = response.data.hint_two;
          self.problem.difficulty = response.data.difficulty;
          self.problem.topic = "Mechanics";
          self.problem.mainFocus = response.data.main_focus;
          response.data.other_foci.forEach(function(focus) {
            self.problem.otherFoci.push(focus.name);
          });
        });
      }
    }
  }
</script>

<style scoped>

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .problem {
    width: 60%;
    margin-left: 50px;
  }

</style>
