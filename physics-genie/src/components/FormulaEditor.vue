<template>
  <div id = "formula-editor">
    <div ref = "input" id = "input"><span></span></div>
  </div>
</template>

<script>
  let editor;

  function equationSetup() {

    document.getElementById("formula-editor").style.height = "59px";
    document.getElementById("input").style.height = "59px";
    document.querySelector("#input .wrs_panelContainer").style.height = "0";
    document.querySelector("#input .wrs_panelContainer").style.opacity = "0";
    document.querySelector("#input .wrs_panelContainer").style.top = "0";
    document.querySelector("#input .wrs_formulaDisplayWrapper").style.top = "-8px";
  }

  document.addEventListener("click", function(event) {
    if (document.getElementById("input") !== null) {
      let rect = document.getElementById("input").getBoundingClientRect();
      if (event.clientX > rect.left && event.clientX < rect.left + rect.width && event.clientY > rect.top && event.clientY < rect.top + rect.height) {
        document.getElementById("formula-editor").style.height = (document.querySelector("#input .wrs_formulaDisplay").clientHeight + 60) + "px";
        document.getElementById("input").style.height = (document.querySelector("#input .wrs_formulaDisplay").clientHeight + 48) + "px";
        document.querySelector("#input .wrs_panelContainer").style.height = "40px";
        document.querySelector("#input .wrs_panelContainer").style.opacity = "1";
        document.querySelector("#input .wrs_panelContainer").style.top = document.querySelector("#input .wrs_formulaDisplay").clientHeight + "px";
        document.querySelector("#input .wrs_formulaDisplayWrapper").style.top = "-42px";
      } else {
        document.getElementById("formula-editor").style.height = "59px";
        document.getElementById("input").style.height = "59px";
        document.querySelector("#input .wrs_panelContainer").style.height = "0";
        document.querySelector("#input .wrs_panelContainer").style.opacity = "0";
        document.querySelector("#input .wrs_panelContainer").style.top = "0";
        document.querySelector("#input .wrs_formulaDisplayWrapper").style.top = "-8px";
      }
    }
  });

  export default {
    name: "FormulaEditor",
    props: {
      text: String
    },
    watch: {
      text: function(newText) {
        editor.setMathML(newText);
        console.log(newText);
      }
    },
    methods: {
      update: function() {
        this.$emit("update", editor.getMathML().toString());
        console.log("Update: ", editor.getMathML().toString());
      }
    },
    mounted() {
      editor = com.wiris.jsEditor.JsEditor.newInstance({'language': 'en',
        'toolbar': '<toolbar ref = "quizzes"/>'
      });
      editor.insertInto(this.$refs.input);

      editor.setMathML(this.text);

      setInterval(this.update, 1000);

      setTimeout(equationSetup, 500);

    }
  }
</script>

<style scoped>

  #formula-editor {
    width: 100%;
    background: white;
    position: relative;
    box-sizing: border-box;
    height: 52px;
    transition: height .5s ease;
  }

  #input {
    width: 100% !important;
    height: 45px;
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
  }

</style>
