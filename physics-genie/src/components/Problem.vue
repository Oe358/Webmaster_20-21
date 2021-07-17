/* eslint-disable *
<template>
  <div id = "problem">
    <ReportError v-if = "reportError" v-bind:problemID = "problem.problemID" v-on:close = "reportErrorClose" style = "z-index: 500;" />
    <div id = "progress-bars">
      <div class = "topic">
        <h4>{{ problem.topicName }}</h4>
        <ProgressBar class = "progress-bar" v-bind:xp = "topicStatsXP" v-bind:add = "add" />
      </div>
      <div class = "focus">
        <h4>{{ problem.mainFocusName }}</h4>
        <ProgressBar class = "progress-bar" v-bind:xp = "focusStatsXP" v-bind:add = "add" />
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
        <p class = "hint one" v-if = "pastAnswers.length >= 1">Hint: <vue-mathjax v-bind:formula = "problem.hintOne" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>
        <p class = "hint one" v-if = "pastAnswers.length >= 2 && problem.hintTwo !== null">Hint: <vue-mathjax v-bind:formula = "problem.hintTwo" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>
      </div>
      <div id = "previous-answers" v-if = "pastAnswers.length >= 1 && result === ''">Past Answers:
        <span class = "previous-answer" v-bind:key = "answer" v-for = "(answer, index) in pastAnswers"><vue-mathjax v-bind:formula = "'$' + answer + '$'" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax>{{ (index === pastAnswers.length - 1 ? '' : ', ') }}</span>
      </div>
      <div class = "flex row problem" v-if = "result === ''">
        <div style = "width: 500px" id = "answer-container">
          <mathlive-mathfield class = "math-input" v-on:focus = "mathInputFocusStyle = [{boxShadow: '0 0 10px 0 rgba(40, 46, 91, 0.4)'}]" v-on:blur = "mathInputFocusStyle = null" v-bind:style = "mathInputFocusStyle" v-model = "currAnswer"></mathlive-mathfield>
          <span class = "expecting">Expecting: {{ algebraicAnswer ? (problem.mustMatch ? "Exact algebraic expression (must match form exactly)" : "Algebraic expression (as simplified as possible)") : (problem.mustMatch ? "Exact numerical expression (must match both form and value exactly)" : (problem.error === "0" ? "Exact numerical answer" : "Numerical answer (must match value within a " + problem.error + "% error)")) }}</span>
        </div>
        <div class = "buttons">
          <button id = "submit-pr" class = "button blue top" v-on:click = "onSubmit">Submit</button>
          <button id = "give-up" class = "button bottom red" v-on:click = "gaveUp">Give Up</button>
          <button id = "skip" class = "button bottom" v-on:click = "skip" v-bind:class = "pastAnswers.length > 0 ? 'disabled' : ''">Skip</button>
        </div>
      </div>

      <div id = "solution" v-if = "result !== ''">
        <div id = "student-answers">
          <div v-for = "(answer, index) in pastAnswers" v-bind:key = "answer" v-bind:class = "(result === 'correct' && index === pastAnswers.length - 1) ? 'correct' : 'incorrect'">{{ ordinalNumbers[index] }} Response: <vue-mathjax v-bind:formula = "'$' + answer + '$'" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></div>
        </div>
        <div id = "answer" v-if = "result !== 'correct'">Answer: <vue-mathjax class = "correct"  v-bind:formula = "'$' + Mathml2latex.convert(problem.answer) + '$'" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></div>
        <div id = "solution-text">
          <vue-mathjax v-bind:formula = "problem.solution" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax>
          <div id = "solution-diagram" v-if = "problem.solutionDiagram !== null" v-html = "problem.solutionDiagram"></div>
        </div>
      </div>
      <div class = "solution buttons" v-if = "result !== ''">
        <!--<button id = "save" class = "button blue"><i class = "fa fa-plus"></i>Save</button>-->
        <button id = "report" v-on:click = "reportErrorPressed" class = "button" v-if = "problem.problemID !== null"><i class = "fa fa-flag"></i>Report an Error</button>
      </div>
      <button id = "next" v-on:click = "next" v-if = "result !== ''">Next<div class = "arrow"><div></div><div></div><div></div></div></button>
    </div>
  </div>
</template>

<script>

  import axios from 'axios';
  import {VueMathjax} from 'vue-mathjax'
  import { mapGetters } from "vuex";
  import Mathml2latex from 'mathml-to-latex';
  import * as MathLive from 'mathlive/dist/mathlive.min.mjs';
  import ProgressBar from './ProgressBar';
  import ReportError from './ReportError';

  export default {
    name: "Problem",
    components: {
      'vue-mathjax': VueMathjax,
      ProgressBar,
      ReportError
    },
    props: {
      problem: {
        type: Object
      },
      official: {
        type: Boolean
      }
    },
    computed: {
      ...mapGetters({
        userStats: 'UserStats',
        submitData: 'ProblemMetaData'
      }),
      pastAnswers: {
        get() {
          if (this.official) {
            return this.$store.getters.PastAnswers;
          } else {
            return this.pastAnswersUnofficial;
          }
        },
        set(value) {
          if (this.official) {
            this.$store.commit('setPastAnswers', value);
          } else {
            this.pastAnswersUnofficial = value;
          }
        }
      },
      result: {
        get() {
          if (this.official) {
            return this.$store.getters.Result;
          } else {
            return this.resultUnofficial;
          }
        },
        set(value) {
          if (this.official) {
            this.$store.commit('setResult', value);
          } else {
            this.resultUnofficial = value;
          }
        }
      },
      currAnswer: {
        get() {
          if (this.official) {
            return this.$store.getters.CurrAnswer;
          } else {
            return this.currAnswerUnofficial;
          }
        },
        set(value) {
          if (this.official) {
            this.$store.commit('setCurrAnswer', value);
          } else {
            this.currAnswerUnofficial = value;
          }
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
      },
      algebraicAnswer: function() {
        const regexp = new RegExp(/((?<!\\|[A-Za-z])[A-Za-z]+)|(\\alpha)|(\\beta)|(\\[Gg]amma)|(\\[Dd]elta)|(\\epsilon)|(\\varepsilon)|(\\zeta)|(\\eta)|(\\[Tt]heta)|(\\vartheta)|(\\iota)|(\\kappa)|(\\[Ll]ambda)|(\\mu)|(\\nu)|(\\[Xx]i)|(\\[Pp]i)|(\\rho)|(\\varrho)|(\\[Ss]igma)|(\\tau)|(\\[Uu]psilon)|(\\[Pp]hi)|(\\varphi)|(\\chi)|(\\[Pp]si)|(\\[Oo]mega)/);
        return regexp.test(this.problem.answer);
      },
      focusStats: function() {
        let self = this;
        return this.userStats.topics.filter(function(topic) {return topic.topicId === self.problem.topic})[0].foci.filter(function(focus) {return focus.focusId === self.problem.mainFocus})[0];
      },
      topicStatsXP: function() {
        let self = this;
        let xp = this.userStats.topics.filter(function(topic) {return topic.topicId === self.problem.topic})[0].xp;
        if (this.processingResult === "correct" && this.focusStats.streak > 0 && (this.focusStats.streak + 1) % 5 === 0) {
          return xp + Math.floor(1.2*(this.focusStats.xp+this.problem.difficulty*(4-this.pastAnswers.length))) - this.focusStats.xp;
        } else if (this.processingResult === "correct") {
          return xp + this.problem.difficulty*(4-this.pastAnswers.length);
        } else if (this.processingResult === "incorrect" && this.focusStats.streak < 0 && (this.focusStats.streak - 1) % 3 === 0) {
          return xp - this.focusStats.xp + parseInt(0.8*this.focusStats.xp);
        } else {
          return xp;
        }
      },
      focusStatsXP: function() {
        if (this.processingResult === "correct" && this.focusStats.streak > 0 && (this.focusStats.streak + 1) % 5 === 0) {
          return this.focusStats.xp + Math.floor(1.2*(this.focusStats.xp+this.problem.difficulty*(4-this.pastAnswers.length)));
        } else if (this.processingResult === "correct") {
          return this.focusStats.xp + this.problem.difficulty*(4-this.pastAnswers.length);
        } else if (this.processingResult === "incorrect" && this.focusStats.streak < 0 && (this.focusStats.streak - 1) % 3 === 0) {
          return parseInt(0.8*this.focusStats.xp);
        } else {
          return this.focusStats.xp;
        }
      },
      add: function() {
        if (this.result !== "") {
          return 0;
        } else if (this.focusStats.streak > 0 && (this.focusStats.streak + 1) % 5 === 0) {
          return Math.floor(1.2*(this.focusStats.xp+this.problem.difficulty*(3-this.pastAnswers.length))) - this.focusStats.xp;
        } else {
          return this.problem.difficulty*(3-this.pastAnswers.length);
        }
      }
    },
    data() {
      return {
        ordinalNumbers: ["First", "Second", "Third", "Fourth", "Fifth"],
        Mathml2latex: Mathml2latex,
        pastAnswersUnofficial: [],
        currAnswerUnofficial: "",
        resultUnofficial: "",
        wrong: false,
        mathInputFocusStyle: null,
        reportError: false,
        processingResult: ""
      }
    },
    methods: {
      reportErrorPressed: function() {
        this.reportError = true;
      },
      reportErrorClose: function() {
        this.reportError = false;
      },
      onSubmit: function() {
        let self = this;
        if (this.currAnswer === "") {
          this.$store.dispatch('Confirmation', "Please enter an answer before submitting");
        } else if (this.pastAnswers.includes(this.currAnswer)) {
          this.$store.dispatch('Confirmation', "You cannot enter an answer that you have already tried");
        } else {
          this.$store.commit('setProcessing', true);

          if (self.problem.answer.substring(0, 5) === "<math") {
            console.log("Student Answer: ", "<math>" + MathLive.convertLatexToMathMl(self.currAnswer) + "</math>");
            console.log("Correct Answer: ", self.problem.answer.replace(" xmlns='http://www.w3.org/1998/Math/MathML'", "").replace(" xmlns=\"http://www.w3.org/1998/Math/MathML\"", ""));
            axios.post("wp-json/physics_genie/external-request", {
              method: "POST",
              url: "www.wiris.net/demo/editor/evaluate?mml=" + ("<math>" + MathLive.convertLatexToMathMl(self.currAnswer) + "</math>")
            }).then((response) => {
              let studentAnswer = parseFloat(response.data);
              axios.post("wp-json/physics_genie/external-request", {
                method: "POST",
                url: "www.wiris.net/demo/editor/evaluate?mml=" + self.problem.answer.replace(" xmlns='http://www.w3.org/1998/Math/MathML'", "").replace(" xmlns=\"http://www.w3.org/1998/Math/MathML\"", "")
              }).then((res) => {
                let actualAnswer = parseFloat(res.data);

                if (("<math>" + MathLive.convertLatexToMathMl(self.currAnswer) + "</math>") === self.problem.answer.replace(" xmlns='http://www.w3.org/1998/Math/MathML'", "").replace(" xmlns=\"http://www.w3.org/1998/Math/MathML\"", "") || (!self.problem.mustMatch && studentAnswer <= actualAnswer * 1.05 && studentAnswer >= actualAnswer * 0.95) || (studentAnswer === actualAnswer)) {
                  console.log("Correct");
                  self.correct();
                } else {
                  console.log("Incorrect");
                  self.incorrect();
                }

              });
            });
          } else {
            console.log("Student Answer: ", self.currAnswer);
            console.log("Correct Answer: " + self.problem.answer);

            const wolframURL = "https://www.wolframcloud.com/obj/16fd1fd7-c20e-4957-98dc-6667d81ad0e9";

            const request = encodeURI(wolframURL + "?studentAnswer=" + self.currAnswer + "&correctAnswer=" + self.problem.answer + "&error=" + self.problem.error + "&mustMatch=" + (self.problem.mustMatch ? "true" : "false"));

            console.log(request);

            axios.post("wp-json/physics_genie/external-request", {
              method: "GET",
              url: request
            }).then((response) => {
              if (response.data === "True") {
                console.log("Correct");
                self.correct();
              } else {
                console.log("Incorrect");
                self.incorrect();
              }
            });
          }


        }
      },
      correct: async function() {
        this.pastAnswers.push(this.currAnswer);
        this.processingResult = "correct";
        this.result = "correct";
        this.currAnswer = "";
        this.$store.commit('setProcessing', false);
        if (this.official) {
          await this.$store.dispatch('SubmitAttempt', "correct");
          await this.$store.dispatch('GetUserStats');
        }
        this.processingResult = "";
      },
      incorrect: async function() {
        this.pastAnswers.push(this.currAnswer);
        this.currAnswer = "";
        this.$store.commit('setProcessing', false);
        if (this.pastAnswers.length === 3) {
          this.result = "incorrect";
          this.processingResult = "incorrect";
          if (this.official) {
            await this.$store.dispatch('SubmitAttempt', "incorrect");
            await this.$store.dispatch('GetUserStats');
          }
        }
        this.processingResult = "";
      },
      gaveUp: async function() {
        this.currAnswer = "";
        this.result = "gave up";
        this.processingResult = "incorrect";
        if (this.official) {
          await this.$store.dispatch('SubmitAttempt', "gave up");
          await this.$store.dispatch('GetUserStats');
        }
        this.processingResult = "";
      },
      skip: async function() {
        if (this.official) {
          this.$store.commit('setProcessing', true);
          await axios.put("wp-json/physics_genie/reset-curr-problem", null, {headers: {'Authorization': 'Bearer ' + this.$store.getters.Token}});
          await this.$store.dispatch('GetCurrProblem');
          this.$store.commit('setProcessing', false);
        }
        this.pastAnswers = [];
        this.result = "";
      },
      next: async function() {
        if (this.official) {
          this.$store.commit('setProcessing', true);
          await this.$store.dispatch('GetCurrProblem');
          this.$store.commit('setProcessing', false);
        }
        this.pastAnswers = [];
        this.result = "";
      },
      updateAnswer: function(answer) {
        this.currAnswer = answer;
      }
    },
    mounted() {

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
    height: 120px;
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
    height: 35px;
    line-height: 35px;
    padding-left: 15px;
    font-size: 19px;
    margin: 0;
  }

  #progress-bars .focus h4 {
    background: rgba(56, 100, 155, 0.8);
  }

  #progress-bars .progress-bar {
    width: 100%;
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

  #answer-container .expecting {
    margin: 10px 0 0 20px;
    display: inline-block;
    font-size: 10px;
    color: #285380;
    font-family: "Montserrat", sans-serif;
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

  .button.disabled {
    pointer-events: none;
    opacity: 0.3;
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

  .math-input {
    border: 1px solid rgba(40, 46, 91, 0.4);
    border-radius: 5px;
    outline: none;
    padding: 3px 0 3px 12px;
    line-height: 20px;
    transition: box-shadow .3s ease;
    cursor: text;
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

</style>
