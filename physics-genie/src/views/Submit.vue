/* eslint-disable */
<template>
  <div class = "container">
    <Menu />
    <User />
    <div v-if = "problemPreview !== null" class = "preview" v-bind:style = "{height: windowHeight + 'px'}">
      <div class = "preview-container">
        <div class = "view-box">
          <Problem v-bind:problem = "problemPreview" class = "problem" />
        </div>
        <button v-on:click = "problemPreview = null" class = "exit"><span>Exit Preview</span><i class = "fa fa-times"></i></button>
      </div>
    </div>
    <div class = "content">
      <h1>Welcome Problem Submitter!</h1>
      <div class = "divider"></div>
      <button class = "button orange" v-on:click = "navigate('submit-portal')">Submit a Problem</button>
      <div id = "past-problems">
        <div v-for = "problem in problems" class = "problem">
          <div class = "buttons">
            <button class = "button orange" v-on:click = "edit(problem.problemID)"><i class = "fa fa-pencil"></i>Edit</button>
            <button class = "button" v-on:click = "previewProblem(problem)"><i class = "fa fa-eye"></i>Preview</button>
          </div>
          <div class = "topic-focus"><span class = "topic">{{ problem.topicName }}</span>><span class = "focus">{{ problem.mainFocusName }}</span></div>
          <p class = "problem-text"><vue-mathjax :formula = "problem.problemTextShortened" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>
          <div class = "info">
            <h6 class = "source">{{ problem.sourceName }}</h6>
            <div class = "difficulty">
              <i v-for = "_ in parseInt(problem.difficulty)" class = "fa fa-star"></i>
              <i v-for = "_ in (5 - problem.difficulty)" class = "fa fa-star-o"></i>
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
  import Problem from "../components/Problem";
  import {VueMathjax} from 'vue-mathjax'

  export default {
    name: "Submit",
    components: {
      Menu,
      User,
      Problem,
      'vue-mathjax': VueMathjax
    },
    data() {
      return {
        problems: this.$store.getters.SubmittedProblems,
        problemPreview: null,
        submitData: this.$store.getters.ProblemMetaData,
        windowHeight: window.innerHeight
      }
    },
    methods: {
      previewProblem: function(problem) {
        this.problemPreview = problem;
      },
      edit: function(problemID) {
        window.scrollTo({top: 0, left: 0});
        this.$router.push("/submit-portal/" + problemID);
      },
      navigate: function(place) {
        this.$router.push("/" + place);
      }
    },
    created() {

    }
  }
</script>

<style scoped>

  .preview {
    position: fixed;
    top: 0;
    left: 50px;
    width: 100%;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .preview .preview-container {
    width: 75%;
    border-radius: 50px;
    position: relative;
    background: white;
    padding: 80px;
    box-sizing: border-box;
    height: auto;
    max-height: 85%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 10px 2px rgba(17, 21, 33, 0.3);
  }

  .preview .view-box {
    width: 100%;
    height: 100%;
    padding: 0 80px;
    margin: 0;
    overflow-y: auto;
  }

  .preview .problem {

  }

  .preview .exit {
    position: absolute;
    right: 35px;
    top: 25px;
    background: none;
    outline: none;
    font-size: 20px;
    cursor: pointer;
    color: #ff3f49;
    border-radius: 10px;
    border: 1px solid #ff3f49;
    transition: transform .3s ease;
    display: flex;
    padding: 0 7px;
    height: 35px;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  .preview .exit span {
    width: 0;
    display: inline-block;
    overflow: hidden;
    font-size: 13px;
    margin: 0;
    transition: width .3s ease, margin-right .3s ease;
  }

  .preview .exit:hover span {
    width: inherit;
    margin: 0 5px;
  }

  .preview .exit:hover .fa {
    transform: rotate(90deg);
  }

  .content {
    width: calc(90% - 100px);
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    position: relative;
    margin: 100px 0 -50px calc(5% + 100px);
    display: flex;
    flex-direction: column;
    align-items: center;
    background: white;
  }

  h1 {
    font-family: "Nanum Gothic", sans-serif;
    font-size: 40px;
    color: black;
    font-weight: 500;
    margin-top: 100px;
    position: relative;
    background: white;
  }

  .divider {
    width: 70%;
    height: 2px;
    margin: 0 0 40px 0;
    background: #111521;
  }

  #past-problems {
    width: 95%;
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  #past-problems .problem {
    color: #4a4a4a;;
    font-family: "Nunito", sans-serif;
    font-size: 14px;
    border: 0.5px solid rgba(17, 21, 33, 0.4);
    margin: 15px;
    width: 320px;
    background: white;
    border-radius: 25px;
    position: relative;
    top: 0;
    transition: box-shadow .3s ease, border .3s ease, top .3s ease;
  }

  #past-problems .problem:hover {
    box-shadow: 0 0 10px 2px rgba(17, 21, 33, 0.3);
    border: 1px solid rgba(17, 21, 33, 0.4);
    top: -10px;
  }

  #past-problems .problem .buttons {
    background: rgba(255, 255, 255, 0.65);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    opacity: 0;
    border-radius: 25px;
    z-index: -1;
    transition: opacity .3s ease, z-index 0s ease .3s;
  }

  #past-problems .problem .buttons .button {
    background: white;
  }

  #past-problems .problem .buttons .button:nth-child(1) {
    margin-right: 20px;
  }

  #past-problems .problem:hover .buttons {
    opacity: 1;
    z-index: 1;
    transition: opacity .3s ease, z-index 0s ease 0s;
  }


  #past-problems .topic-focus {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-style: italic;
    margin: 20px 20px 15px 20px;
    padding: 10px 0;
    background: rgba(56, 100, 155, 0.1);
    box-shadow: 0 0 8px 1px rgba(56, 100, 155, 0.3);
  }

  #past-problems .topic-focus span {
    margin: 0 10px;
  }

  #past-problems .problem-text {
    margin: 0 20px;
    line-height: 25px;
  }

  #past-problems .info {
    border-top: 1px solid rgba(56, 100, 155, 0.3);
    margin-top: 8px;
    padding: 0 25px 15px 25px;
    position: relative;
    font-size: 21px;
    color: #111521;
    font-weight: bolder;
  }

  #past-problems .info::before {
    content: "";
    background: rgba(56, 100, 155, 0.1);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: .2;
  }

  #past-problems .source {
    margin-bottom: 5px;
    margin-top: 25px;
  }


  #past-problems .difficulty .fa {
    margin: 0 2px;
    font-size: 15px;
  }




</style>
