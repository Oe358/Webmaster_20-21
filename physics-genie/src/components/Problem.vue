/* eslint-disable *
<template>
  <div id = "problem">
    <div id = "progress-bars">
      <div class = "topic">
        <h4>{{ problem.topicName }}</h4>
        <div class = "bar">
          <!--<div class = "curr-progress" v-bind:style = "{width: ((userStats.xp-Math.pow(Math.floor(Math.sqrt(userStats.xp+9)), 2)+9)/(2*Math.floor(Math.sqrt(userStats.xp+9))+1)) + '%'}"></div>-->
          <div class = "curr-progress" v-bind:style = "{width: userStats.xp + '%'}"></div>
          <!--<div class = "curr-progress" v-bind:style = "{width: 50 + '%'}"></div>-->
          <div class = "advancement-progress">+10</div>
        </div>
        <div class = "badge"><div class = "img"></div></div>
      </div>
      <div class = "focus">
        <h4>{{ problem.mainFocusName }}</h4>
        <div class = "bar">
          <div class = "curr-progress"></div>
          <div class = "advancement-progress">+10</div>
        </div>
        <div class = "badge"><div class = "img"></div></div>
      </div>
    </div>
    <div class = "content" v-bind:style = "(result === 'correct') ? 'border: 1px solid rgb(5, 178, 0)' : ((result === 'incorrect' || (result === '' && pastAnswers.length > 0)) ? 'border: 1px solid #ff6469' : 'border: 1px solid rgba(17, 21, 33, 0.4)')">
      <div id = "already-entered" class = "error">You have already tried this response</div>
      <div id = "blank" class = "error">Please enter a response</div>
      <div id = "add-saved" class = "error">Problem added to saved</div>
      <div id = "remove-saved" class = "error">Problem remove from saved</div>
      <div id = "result" v-if = "result !== '' || pastAnswers.length > 0">
        <div id = "correct" v-if = "result === 'correct'"><i class = "fa fa-check"></i>Correct</div>
        <div id = "incorrect" v-if = "result === 'incorrect' || (result === '' && pastAnswers.length > 0)"><i class = "fa fa-times"></i>Incorrect</div>
        <div id = "gave-up" v-if = "result === 'gave up'"><i class = "fa fa-minus-circle"></i>You Gave Up</div>
      </div>
      <div id = "summary">
        <div class = "difficulty">
          <span>Difficulty:</span>
          <i v-for = "i in 5" v-bind:key = "i" v-bind:class = "(i <= problem.difficulty) ? 'fa-star' : 'fa-star-o'" v-bind:style = "(i === 1) ? 'margin-left: 5px' : ''" class = "fa"></i>
        </div>
        <div class = "main-focus"><span class = "topic">{{ problem.topicName }}</span>><span class = "focus">{{ problem.mainFocusName }}</span></div>
        <div class = "secondary-focus" v-if = "problem.otherFoci.length > 0" v-bind:title = "otherFociList">{{ otherFociList.length > 40 ? otherFociList.substring(0, 40) + "..." : otherFociList }}</div>
      </div>
      <p id = "problem-text"><vue-mathjax :formula = "problem.problemText" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>
      <div id = "diagram" v-if = "problem.diagram !== null" v-html = "problem.diagram"></div>
      <div id = "hints" v-if = "result === ''">
        <p class = "hint one" v-if = "pastAnswers.length >= 1">Hint: {{ problem.hintOne }}</p>
        <p class = "hint one" v-if = "pastAnswers.length >= 2 && problem.hintTwo !== null">Hint: {{ problem.hintTwo }}</p>
      </div>
      <div id = "previous-answers" v-if = "pastAnswers.length >= 1 && result === ''">Past Answers:
        <span class = "previous-answer" v-bind:key = "answer" v-for = "(answer, index) in pastAnswers"><vue-mathjax v-bind:formula = "'$' + Mathml2latex.convert(answer) + '$'" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax>{{ (index === pastAnswers.length - 1 ? '' : ', ') }}</span>
      </div>
      <div class = "flex row problem" v-if = "result === ''">
        <div style = "width: 500px" id = "studentAnswer">
          <FormulaEditor v-bind:text = "currAnswer" v-on:update = "updateAnswer" />
        </div>
        <div class = "buttons">
          <button id = "submit-pr" class = "button blue top" v-on:click = "onSubmit">Submit</button>
          <button id = "give-up" class = "button bottom red" v-on:click = "gaveUp">Give Up</button>
          <button id = "skip" class = "button bottom" v-on:click = "skip">Skip</button>
        </div>
      </div>

      <div id = "solution" v-if = "result !== ''">
        <div id = "student-answers">
          <div v-for = "(answer, index) in pastAnswers" v-bind:key = "answer" v-bind:class = "(result === 'correct' && index === pastAnswers.length - 1) ? 'correct' : 'incorrect'">{{ ordinalNumbers[index] }} Response: <vue-mathjax v-bind:formula = "'$' + Mathml2latex.convert(answer) + '$'" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></div>
        </div>
        <div id = "answer" v-if = "result !== 'correct'">Answer: <vue-mathjax class = "correct"  v-bind:formula = "'$' + Mathml2latex.convert(problem.answer) + '$'" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></div>
        <div id = "solution-text">
          <vue-mathjax v-bind:formula = "problem.solution" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax>
          <div id = "solution-diagram" v-if = "problem.solutionDiagram !== null" v-html = "problem.solutionDiagram"></div>
        </div>
      </div>
      <div class = "solution buttons" v-if = "result !== ''">
        <!--<button id = "save" class = "button blue"><i class = "fa fa-plus"></i>Save</button>-->
        <button id = "report" class = "button"><i class = "fa fa-flag"></i>Report an Error</button>
      </div>
      <button id = "next" v-on:click = "next" v-if = "result !== ''">Next<div class = "arrow"><div></div><div></div><div></div></div></button>
    </div>
  </div>
</template>

<script>

  import axios from 'axios';
  import {VueMathjax} from 'vue-mathjax'
  import FormulaEditor from "./FormulaEditor";
  import { mapGetters } from "vuex";
  import Mathml2latex from 'mathml-to-latex';

  export default {
    name: "Problem",
    components: {
      'vue-mathjax': VueMathjax,
      FormulaEditor
    },
    props: {
      problem: {
        type: Object
      }
    },
    computed: {
      ...mapGetters({
        pastAnswers: 'PastAnswers',
        result: 'Result',
        userStats: 'UserStats'
      }),
      currAnswer: {
        get() {
          return this.$store.getters.CurrAnswer;
        },
        set(value) {
          this.$store.commit('setCurrAnswer', value);
        }
      },
      otherFociList: function() {
        if (this.problem.otherFoci.length === 0) {
          return null;
        }
        let string = "Also Includes: ";
        for (let i = 0; i < this.problem.otherFoci.length; i++) {
          string += this.problem.otherFoci[i];
          if (i === 0 && this.problem.otherFoci.length === 2) {
            string += " and ";
          } else if (i < this.problem.otherFoci.length - 2 && this.problem.otherFoci.length > 2) {
            string += ", ";
          } else if (i === this.problem.otherFoci.length - 2) {
            string += ", and ";
          }
        }
        return string;
      }
    },
    watch: {
      pastAnswers: {
        handler() {
          this.$store.commit('setPastAnswers', this.pastAnswers);
        },
        deep: true
      }
    },
    data() {
      return {
        submitData: this.$store.getters.ProblemMetaData,
        ordinalNumbers: ["First", "Second", "Third", "Fourth", "Fifth"],
        Mathml2latex: Mathml2latex,
        wrong: false
      }
    },
    methods: {
      onSubmit: function() {
        let self = this;
        console.log(self.currAnswer.replace(" xmlns=\"http://www.w3.org/1998/Math/MathML\"", ""));
        console.log(self.problem.answer.replace(" xmlns='http://www.w3.org/1998/Math/MathML'", "").replace(" xmlns=\"http://www.w3.org/1998/Math/MathML\"", ""));
        axios.post("wp-json/physics_genie/external-request", {
          method: "POST",
          url: "www.wiris.net/demo/editor/evaluate?mml=" + self.currAnswer.replace(" xmlns=\"http://www.w3.org/1998/Math/MathML\"", "")
        }).then((response) => {
          let studentAnswer = parseFloat(response.data);
          axios.post("wp-json/physics_genie/external-request", {
            method: "POST",
            url: "www.wiris.net/demo/editor/evaluate?mml=" + self.problem.answer.replace(" xmlns='http://www.w3.org/1998/Math/MathML'", "").replace(" xmlns=\"http://www.w3.org/1998/Math/MathML\"", "")
          }).then((res) => {
            let actualAnswer = parseFloat(res.data);

            if (self.currAnswer.replace(" xmlns=\"http://www.w3.org/1998/Math/MathML\"", "") === self.problem.answer.replace(" xmlns='http://www.w3.org/1998/Math/MathML'", "").replace(" xmlns=\"http://www.w3.org/1998/Math/MathML\"", "") || (studentAnswer < actualAnswer * 1.05 && studentAnswer > actualAnswer * 0.95)) {
              console.log("Correct");
              self.correct();
            } else {
              console.log("Incorrect");
              self.incorrect();
            }

          });
        });
      },
      correct: function() {
        this.$set(this.pastAnswers, this.pastAnswers.length, this.currAnswer);
        this.currAnswer = "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"/>";
        this.$store.commit('setResult', "correct");
        this.showResult();
      },
      incorrect: function() {
        this.$set(this.pastAnswers, this.pastAnswers.length, this.currAnswer);
        this.currAnswer = "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"/>";
        if (this.pastAnswers.length === 3) {
          this.$store.commit('setResult', "incorrect");
          this.showResult();
        }
      },
      gaveUp: function() {
        this.currAnswer = "<math xmlns=\"http://www.w3.org/1998/Math/MathML\"/>";
        this.$store.commit('setResult', "gave up");
        this.showResult();
      },
      skip: function() {

      },
      showResult: function() {
        this.$store.dispatch('submitAttempt');
      },
      next: function() {
        this.$store.commit('setPastAnswers', []);
        this.$store.commit('setResult', "");
        this.$store.dispatch('GetCurrProblem', {token: this.$store.getters.Token, submitData: this.$store.getters.ProblemMetaData});
      },
      updateAnswer: function(answer) {
        this.currAnswer = answer;
      }
    },
    mounted() {
      // this.$store.commit('setPastAnswers', []);
    }
  }
</script>

<style scoped>

  #problem {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content {
    border: 1px solid rgba(17, 21, 33, 0.4);
    padding: 35px;
    font-size: 14px;
    color: rgb(29,34,41);
    background: white;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    margin-top: 20px;
    font-family: 'Nunito', sans-serif;
  }

  #progress-bars {
    height: 110px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  #progress-bars > div {
    border: 1px solid #285380;
    height: 100%;
    width: 49%;
  }

  #progress-bars .focus {
    border: 1px solid rgba(56, 100, 155, 0.8);
  }

  #progress-bars h4 {
    font-family: "Antic", sans-serif;
    font-style: italic;
    background: #285380;
    color: white;
    padding: 8px 15px;
    font-size: 19px;
    margin: 0;
  }

  #progress-bars .focus h4 {
    background: rgba(56, 100, 155, 0.8);
  }

  #progress-bars .badge {
    width: 55px;
    height: 55px;
    border-radius: 27.5px;
    background: #f1f4ff;
    border: 1px solid #285380;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 27px;
    font-family: "Caveat", sans-serif;
    font-weight: 700;
    top: -30px;
    left: 5%;
  }

  #progress-bars .badge .img {
    /*background: url("../assets/MechanicsBadge.png") no-repeat center;*/
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    width: 37px;
    height: 37px;
    position: absolute;
    top: 8px;
    left: 10px;
    transition: width .4s ease, height .4s ease, top .4s ease;
  }

  #progress-bars .focus .badge {
    border: 1px solid rgba(56, 100, 155, 0.8);
  }

  #progress-bars .focus .badge .img {
    background: url("../assets/logo.svg") no-repeat center;
    width: 45px;
    height: 45px;
    top: 1.5px;
    left: 9px;
    transition: width .4s ease, height .4s ease;
  }

  #progress-bars .bar {
    width: 80%;
    height: 35px;
    border: 1px solid #285380;
    position: relative;
    top: 15px;
    left: calc(5% + 40px);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  #progress-bars .bar > div {
    height: 100%;
  }

  #progress-bars .bar .curr-progress {
    background: #f1f4ff;
    border-right: 1px solid #a5a9b4;
    width: 0;
    transition: width .8s ease;
  }

  #progress-bars .bar .advancement-progress {
    border-right: 1px solid #b0b3cd;
    background-image: linear-gradient(to right, transparent, #d8dcff);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 2px;
    font-size: 10px;
    color: rgba(74, 87, 94, 0.81);
    width: 0;
    transition: width .8s ease;
  }

  #progress-bars .focus .bar {
    border: 1px solid rgba(56, 100, 155, 0.8);
  }

  #summary {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    font-style: italic;
    margin-bottom: 17px;
    margin-top: -5px;
    height: 50px;
    background: rgba(56, 100, 155, 0.1);
    box-shadow: 0 0 8px 1px rgba(56, 100, 155, 0.3);
  }

  #summary .topic {
    margin-right: 8px;
  }

  #summary .focus {
    margin-left: 8px;
  }

  #summary .secondary-focus {
    font-size: 13px;
    margin-top: 3px;
  }

  #hints {
    margin-top: 10px;
    margin-bottom: 50px;
  }

  #student-answers .incorrect {
    color: red;
  }

  .error {
    position: absolute;
    background: rgb(29,34,41);
    padding: 15px 30px;
    color: white;
    top: 0;
    left: -2px;
    opacity: 0;
    font-size: 12px;
    text-align: center;
    transition: top .25s ease, opacity .25s ease;
    z-index: -1;
  }


  .flex.row {
    display: flex;
    flex-direction: row;
  }

  #problem-text {
    line-height: 30px;
    color: rgb(29, 34, 41);
    font-weight: lighter;
  }

  .flex.problem .buttons {
    margin-left: 30px;
    width: 250px;
    display: flex;
    justify-content: space-around;
  }

  .hint {
    overflow: hidden;
    background: rgba(197, 210, 255, 0.6);
    color: rgba(40, 83, 128, 0.71);
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
    padding: 12px 20px;
    box-sizing: border-box;
    margin: 20px 85px 20px 30px;
    font-size: 13px;
  }

  #previous-answers {
    font-size: 11px;
    font-style: italic;
    margin-left: 30px;
    position: relative;
    top: -10px;
    color: #ff6469;
  }


  #result div {
    width: calc(100% + 70px);
    width: -moz-calc(100% + 70px);
    width: -webkit-calc(100% + 70px);
    margin: -35px 35px 35px -35px;
    height: 60px;
    font-weight: 900;
    font-size: 20px;
    font-family: 'Nunito', sans-serif;
    font-style: italic;
    vertical-align: middle;
    line-height: 60px;
    border-bottom: 1px solid #111521;
    box-shadow: 0 0 10px rgba(39, 43, 80, 0.61) inset;
    color: #111521;
  }

  #result #correct {
    border-bottom: 1px solid rgb(5, 178, 0);
    box-shadow: 0 0 10px rgba(5, 178, 0, 0.6) inset;
    color: rgb(5, 178, 0);
  }

  #result #incorrect {
    border-bottom: 1px solid #ff6469;
    box-shadow: 0 0 10px rgb(255, 207, 209) inset;
    color: #ff6469;
  }

  #result div .fa {
    font-size: 35px;
    height: 100%;
    margin-left: 40px;
    line-height: 45px;
    vertical-align: middle;
    padding-top: 8px;
    margin-right: 15px;
  }

  #student-answers div {
    background: rgba(255, 207, 209, 0.6);
    color: #ff6469;
    font-size: 12px;
    padding: 15px;
    margin: 10px 100px 20px 50px;
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
  }

  #student-answers .correct {
    background: rgba(191, 218, 197, 0.6);
    color: rgb(5, 178, 0);
  }


  #answer {
    font-style: italic;
    font-size: 16px;
    margin-top: 15px;
    color: green;
  }

  #answer .correct {
    color: green;
  }

  #solution-text {
    margin-top: 25px;
    border: 1px solid #111521;
    padding: 15px;
  }

  .solution.buttons {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  #save {
    margin-right: 10px;
  }

  #next {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    text-align: right;
    border-radius: 0;
    border: none;
    background: rgba(56, 100, 155, 0.05);
    padding-right: 80px;
    padding-top: 8px;
    padding-bottom: 8px;
    cursor: pointer;
    color: #111521;
    font-size: 16px;
    font-family: 'Montserrat', sans-serif;
    font-style: italic;
    font-weight: 500;
    transition: background .4s ease;
  }

  #next .arrow {
    position: absolute;
    top: 5px;
    right: 80px;
    width: 25px;
    height: 25px;
    opacity: 0;
    transition: right .3s ease .1s, opacity .3s ease 0s;
  }

  #next .arrow div {
    position: absolute;
    background: #111521;
    height: 1.25px;
  }

  #next .arrow div:nth-child(1) {
    top: 11.5px;
    left: 0;
    width: 25px;
  }

  #next .arrow div:nth-child(2) {
    right: -0.7px;
    top: 7.5px;
    width: 15px;
    transform: rotate(35deg);
  }

  #next .arrow div:nth-child(3) {
    right: -0.7px;
    bottom: 7.8px;
    width: 15px;
    transform: rotate(-35deg);
  }

  #next:hover .arrow {
    right: 45px;
    opacity: 1;
    transition: right .3s ease, opacity .3s ease .1s;
  }

  #next:hover {
    background: rgba(56, 100, 155, 0.1);
  }



  /* Math Editor Styling */
  #studentAnswer {
    height: 52px;
    transition: height .5s ease;
  }

  #studentAnswer .wrs_panelContainer {
    height: 0;
    opacity: 0;
    position: relative;
    top: 0;
    transition: top .4s ease, height .25s ease, opacity .25s ease;
  }

  #studentAnswer .wrs_formulaDisplay {
    height: inherit !important;
    overflow: hidden !important;
    padding: 6px;
  }

  #studentAnswer .wrs_formulaDisplayWrapper {
    position: relative;
    top: 0;
    transition: top .25s ease;
  }


  #studentAnswer .wrs_container > .wrs_underlineCaret {
    display: none;
  }

  #studentAnswer .wrs_linksContainer.wrs_noTabs > a {
    display: none;
  }
</style>
