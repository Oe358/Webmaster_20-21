<template>
  <div id = "problem">
    <div id = "progress-bars">
      <div class = "topic">
        <h4>{{ problem.topic }}</h4>
        <div class = "bar">
          <div class = "curr-progress"></div>
          <div class = "advancement-progress">+10</div>
        </div>
        <div class = "badge"><div class = "img"></div></div>
      </div>
      <div class = "focus">
        <h4>{{ problem.mainFocus }}</h4>
        <div class = "bar">
          <div class = "curr-progress"></div>
          <div class = "advancement-progress">+10</div>
        </div>
        <div class = "badge"><div class = "img"></div></div>
      </div>
    </div>
    <div class = "content">
      <div id = "already-entered" class = "error">You have already tried this response</div>
      <div id = "blank" class = "error">Please enter a response</div>
      <div id = "add-saved" class = "error">Problem added to saved</div>
      <div id = "remove-saved" class = "error">Problem remove from saved</div>
      <div id = "result" style = "display: none">
        <div id = "correct" style = "display: none"><i class = "fa fa-check"></i>Correct</div>
        <div id = "incorrect" style = "display: none"><i class = "fa fa-times"></i>Incorrect</div>
        <div id = "gave-up" style = "display: none"><i class = "fa fa-minus-circle"></i>You Gave Up</div>
      </div>
      <div id = "summary">
        <div class = "difficulty">
          <span>Difficulty:</span>
          <i class = "fa fa-star-o one" style = "margin-left: 5px;"></i>
          <i class = "fa fa-star-o two"></i>
          <i class = "fa fa-star-o three"></i>
          <i class = "fa fa-star-o four"></i>
          <i class = "fa fa-star-o five"></i>
        </div>
        <div class = "main-focus"><span class = "topic">{{ problem.topic }}</span>><span class = "focus">{{ problem.mainFocus }}</span></div>
        <div class = "secondary-focus" v-if = "problem.otherFoci.length > 0">
          Also Includes: <span v-for = "focus in problem.otherFoci">{{ focus }}</span>
        </div>
      </div>
      <p id = "problem-text"><vue-mathjax :formula = "problem.problemText" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>
      <div id = "diagram"></div>
      <div id = "hints">
        <p class = "hint one" style = "display: none"></p>
        <p class = "hint two" style = "display: none"></p>
      </div>
      <div id = "previous-answers">
        <span class = "previous-answer one"></span>
        <span class = "previous-answer two"></span>
      </div>
      <div class = "flex row problem">
        <div style = "width: 500px" id = "studentAnswer"><span></span></div>
        <div class = "buttons">
          <button id = "submit-pr" class = "button blue top">Submit</button>
          <button id = "give-up" class = "button bottom">Give Up</button>
        </div>
      </div>

      <div id = "solution" style = "display: none">
        <div id = "student-answers"></div>
        <p style = "display: none" id = "answer">Answer: <span class = "correct"></span></p>
        <p id = "solution-text"></p>
      </div>
      <div class = "buttons">
        <button id = "save" class = "blue top" style = "display: none"><i class = "fa fa-plus"></i>Save</button>
        <button id = "report" class = "bottom" style = "display: none"><i class = "fa fa-flag"></i>Report an Error</button>
      </div>
      <button id = "next" style = "display: none">Next<div class = "arrow"><div></div><div></div><div></div></div></button>
    </div>
  </div>
</template>

<script>

  import {VueMathjax} from 'vue-mathjax'

  export default {
    name: "Problem",
    components: {
      'vue-mathjax': VueMathjax
    },
    props: {
      problem: {
        type: Object,
        required: true,
      }
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
    width: 190px;
    display: flex;
    justify-content: space-around;
  }

  .hint {
    overflow: hidden;
    background: rgba(197, 210, 255, 0.6);
    color: #285380;
    box-shadow: -0.1px 0 10px rgba(120, 120, 120, 0.5);
    padding: 8px 15px;
    margin-left: 30px;
    margin-right: 85px;
    font-size: 13px;
  }

  #previous-answers {
    font-size: 11px;
    font-style: italic;
    margin-left: 30px;
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
    line-height: 100%;
    vertical-align: middle;
    padding-top: 8px;
    margin-right: 15px;
  }

  #student-answers div {
    background: rgba(255, 207, 209, 0.6);
    color: #ff6469;
    font-size: 12px;
    padding: 15px;
    margin-left: 50px;
    margin-right: 100px;
    margin-bottom: 20px;
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
  }

  #answer .correct {
    color: green;
  }

  #solution-text {
    margin-top: 25px;
    border: 1px solid #111521;
    padding: 15px;
  }

  #save {
    margin-right: 10px;
    margin-bottom: 35px;
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
    color: #111521;
    font-size: 16px;
    font-family: 'Montserrat', sans-serif;
    font-style: italic;
    font-weight: 500;
    transition: background .4s ease;
  }

  #next .arrow {
    position: absolute;
    top: 10px;
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
