<template>
  <div id = "full-edit" v-if = "data.open">
    <div class = "content">
      <button class = "return button orange" v-on:click = "exit"><i class = "fa fa-paper-plane"></i>Save and Exit</button>
      <h2 v-if = "data.type === 'problemText'">Problem <span class = "smaller">(LaTeX)</span></h2>
      <h2 v-else-if = "data.type === 'solution'">Solution <span class = "smaller">(LaTeX)</span></h2>
      <h2 v-else-if = "data.type === 'diagram' || data.type === 'diagramFile'">Diagram <span class = "smaller">(svg)</span></h2>
      <h2 v-else>Solution Diagram <span class = "smaller">(svg)</span></h2>
      <textarea v-if = "data.type !== 'diagramFile' && data.type !== 'solutionDiagramFile'" type = "text" v-model = "data.text"></textarea>
      <div class = "output" v-bind:style = "(data.type === 'diagramFile' || data.type === 'solutionDiagramFile') ? {height: '100%'} : {height: '20%', borderTop: '1px solid rgb(29, 34, 41)', marginTop: '20px'}">
        <button v-if = "data.type !== 'diagramFile' && data.type !== 'solutionDiagramFile'">Output<i class = "fa fa-angle-down"></i></button>
        <p v-if = "data.type === 'problemText' || data.type === 'solution'"><vue-mathjax :formula = "data.text" v-bind:options = "{tex2jax: {inlineMath: [['$', '$']]}, showProcessingMessages: false}"></vue-mathjax></p>
        <div v-else><span v-html = "data.text"></span></div>
      </div>
    </div>
  </div>
</template>

<script>

  import {VueMathjax} from 'vue-mathjax'

  export default {
    name: "FullEdit",
    components: {
      'vue-mathjax': VueMathjax
    },
    props: {
      text: String,
      open: Boolean,
      type: String
    },
    data() {
      return {
        data: {
          text: this.text,
          open: this.open,
          type: this.type
        }
      }
    },
    watch: {
      text: function(newText) {
        this.data.text = newText;
      },
      open: function(newOpen) {
        this.data.open = newOpen;
      },
      type: function(newType) {
        this.data.type = newType;
      }
    },
    methods: {
      exit: function() {
        this.fullEditOpen = false;
        this.$emit("exit", this.data.text, this.data.type);
      }
    }
  }
</script>

<style scoped>

  button {
    outline: none;
  }

  #full-edit {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 5;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10% 0;
    box-sizing: border-box;
  }

  .content {
    position: relative;
    background: white;
    width: 50%;
    min-width: 500px;
    padding: 30px 50px 50px 50px;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    transition: opacity .3s ease, top .3s ease;
  }

  .content:not(.diagram-preview) {
    height: 100%;
  }

  .content.diagram-preview {
    padding: 30px 50px 20px 50px;
  }

  .content h2 {
    width: 100%;
    padding: 10px 5px;
    font-size: 50px;
    font-family: "Nanum Gothic", sans-serif;
    font-weight: 500;
    border-bottom: 1px solid rgba(17, 21, 33, 0.51);
    margin-bottom: 20px;
  }

  .content h2 .smaller {
    font-size: 30px;
    font-style: italic;
  }

  .content .return {
    position: absolute;
    right: 50px;
    top: 45px;
    font-size: 18px;
    padding: 0 15px;
    height: 50px;
    box-sizing: border-box;
    transition: color .25s ease;
  }

  .content .return .fa {
    margin-right: 8px;
  }

  .content .return:hover {
    color: white;
  }

  .content textarea {
    border: solid 1px rgba(17, 21, 33, 0.51);
    font-family: "Montserrat", sans-serif;
    font-size: 17px;
    color: rgba(29, 34, 41, 0.7);
    padding: 10px;
    resize: none;
    width: 100%;
    flex-grow: 10;
    outline: none;
    position: relative;
    transition: border .15s ease, box-shadow .15s ease;
  }

  .content .output {
    font-family: "Nunito", sans-serif;
    font-size: 14px;
    overflow: auto;
    color: rgb(29, 34, 41);
    margin-left: -50px;
    margin-right: -50px;
    padding: 45px 50px 0 50px;
    position: relative;
    transition: height .3s ease;
  }

  .content .output button {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 35px;
    overflow: hidden;
    padding-left: 50px;
    text-align: left;
    border: none;
    background: none;
    transition: background .2s ease;
  }

  .content .output button .fa {
    transform: rotate(0deg);
    margin-left: 10px;
    position: relative;
    top: 2px;
    font-size: 18px;
    transition: transform .3s ease;
  }

  .content .output button:hover {
    background: #e6e6e6;
  }

  .content .output p, .full-edit .output .svg-output {
    visibility: visible;
    overflow: auto;
    padding: 0;
    margin: 0;
    transition: visibility 0s ease .3s;
  }

</style>
