<template>
  <div id = "edit">
    <div class = "background" v-bind:style = "[{height: height + 'px'}, {background: 'url(' + (inverted ? treeB : treeC) + ') center center / 120% ' + height + 'px no-repeat'}]">
      <div class = "colored" v-bind:style = "[{background: 'url(' + (inverted ? treeC : treeB) + ') center center / 120% ' + height + 'px no-repeat'}, {clipPath: 'ellipse(' + clipPath.width + 'px ' + clipPath.height + 'px at ' + clipPath.centerX + 'px ' + clipPath.centerY + 'px)'}]"></div>
      <div class = "toolbar">
        <div class = "nav">
          <router-link class = "link" to = "/">Back</router-link>
        </div>
        <div class = "right">
          <div class = "reset action" v-on:click = "resetClicked"><i class = "fa fa-history"></i>Reset</div>
          <div class = "delete action" v-if = "!deletingWord" v-on:click = "deleteClicked"><i class = "fa fa-trash"></i>Delete Word</div>
          <div class = "delete action" v-else v-on:click = "deleteCancel">CANCEL DELETE</div>
          <div class = "add action" v-if = "!addingWord" v-on:click = "addClicked"><i class = "fa fa-plus"></i>Add Word</div>
          <div class = "add action delete" v-else v-on:click = "addCancel">CLOSE EDITOR</div>
          <div class = "button invert" v-on:click = "invertClicked">INVERT</div>
          <div class = "add-dropdown" v-bind:class = "addingWord ? 'showing' : ''">
            <div class = "selectors">
              <label>
                Type:
                <select ref = "addInputType">
                  <option value = "leaves" selected>Leaves</option>
                  <option value = "trunk">Trunk</option>
                  <option value = "roots">Roots</option>
                </select>
              </label>
              <label>
                Size:
                <select ref = "addInputSize">
                  <option value = "large" selected>Large</option>
                  <option value = "medium">Medium</option>
                  <option value = "small">Small</option>
                </select>
              </label>
            </div>
            <div class = "text">
              <input type = "text" ref = "addInputText">
              <i class = "fa fa-check" v-on:click = "addWord"></i>
            </div>
          </div>
        </div>
      </div>
      <div class = "word" v-for = "word in words" v-bind:key = "word.word"
           v-bind:style = "[{top: word.top + '%'}, {left: word.left + '%'}, {color: colors[word.type]}, {fontSize: fontSizes[word.size]}, {cursor: uneditableWords.includes(word.word) ? 'auto' : 'pointer'}]"
           ref = "words" v-on:mouseup = "wordMouseUp" v-on:mousemove = "wordMouseMove($event, word)" v-on:mousedown = "wordMouseDown($event, word)" v-on:mouseover = "wordMouseOver($event)" v-on:mouseout = "wordMouseOut">
        {{ word.word }}
        <div class = "delete-word" v-if = "deletingWord && !uneditableWords.includes(word.word)"><i class = "fa fa-trash"></i></div>
      </div>
    </div>
  </div>
</template>

<script>

  import treeB from '../assets/TreeB.png';
  import treeC from '../assets/TreeC.png';

  export default {
    name: 'edit',
    data() {
      return {
        treeB,
        treeC,
        width: window.innerWidth,
        height: 1.294 * window.innerWidth,
        words: this.$store.getters.Words,
        uneditableWords: this.$store.getters.UneditableWords,
        colors: this.$store.getters.Colors,
        fontSizes: this.$store.getters.FontSizes,
        clipPath: {
          width: 0,
          height: 0,
          centerX: 0,
          centerY: 0
        },
        inverted: this.$store.getters.Inverted,
        moveWord: {
          offsetX: 0,
          offsetY: 0,
          moving: false,
          index: 0
        },
        addingWord: false,
        deletingWord: false
      }
    },
    watch: {
      words: {
        handler() {
          this.$store.commit('setWords', this.words);
        },
        deep: true
      },
      inverted: {
        handler() {
          this.$store.commit('setInverted', this.inverted);
        },
        deep: true
      }
    },
    methods: {
      wordMouseOver: function(event) {
        if (!this.deletingWord) {
          let rect = event.target.getBoundingClientRect();
          let finalWidth = rect.width;
          let finalHeight = rect.height;
          this.clipPath.width = 0;
          this.clipPath.height = 0;
          this.clipPath.centerX = rect.left + rect.width / 2;
          this.clipPath.centerY = rect.top + window.pageYOffset + rect.height / 2;
          let self = this;
          let duration = 200;
          let start = Date.now();
          let animation = setInterval(function() {
            let timePassed = Date.now() - start;
            if (timePassed >= duration) {
              clearInterval(animation);
            }
            self.clipPath.width = timePassed / duration * finalWidth;
            self.clipPath.height = timePassed / duration * finalHeight;
          }, 1);
        }
      },
      wordMouseOut: function() {
        let initialWidth = this.clipPath.width;
        let initialHeight = this.clipPath.height;
        let self = this;
        let duration = 200;
        let start = Date.now();
        let animation = setInterval(function() {
          let timePassed = Date.now() - start;
          if (timePassed >= duration) {
            clearInterval(animation);
          }
          self.clipPath.width = (1 - timePassed / duration) * initialWidth;
          self.clipPath.height = (1 - timePassed / duration) * initialHeight;
        }, 1);
      },
      wordMouseDown: function(event, word) {
        if (this.deletingWord) {
          if (confirm("Are you sure you would like to proceed and delete '" + word.word + "'? This action cannot be undone")) {
            this.words.splice(this.words.indexOf(word), 1);
            this.deletingWord = false;
          }
        } else {
          let rect = event.target.getBoundingClientRect();
          this.moveWord.offsetX = event.clientX - rect.left;
          this.moveWord.offsetY = event.clientY - rect.top;
          this.moveWord.moving = true;
          this.moveWord.index = this.words.indexOf(word);
          this.wordMouseOut();
        }
      },
      wordMouseMove: function(event, word) {
        if (this.moveWord.moving && this.moveWord.index === this.words.indexOf(word) && !this.uneditableWords.includes(word.word)) {
          this.words[this.words.indexOf(word)].left = (event.clientX - this.moveWord.offsetX) / this.width * 100;
          this.words[this.words.indexOf(word)].top = (event.clientY + window.pageYOffset - this.moveWord.offsetY) / this.height * 100;
        }
      },
      wordMouseUp: function() {
        this.moveWord.moving = false;
      },
      invertClicked: function() {
        this.inverted = !this.inverted;

        let style = document.createElement("style");

        if (this.inverted) {
          style.innerHTML = "div {--main-color: #805b00; --highlight-color: #AA8726}";
          this.colors.leaves = "#80442d";
          this.colors.trunk = "#45801b";
          this.colors.roots = "#805b00";
        } else {
          style.innerHTML = "div {--main-color: #285380; --highlight-color: #99A1E3}";
          this.colors.leaves = "#45801b";
          this.colors.trunk = "#805b00";
          this.colors.roots = "#80442d";
        }

        document.getElementById("edit").removeChild(document.getElementById("edit").childNodes[0]);
        document.getElementById("edit").prepend(style);
      },
      addClicked: function() {
        this.addingWord = true;
        this.$refs.addInputText.focus();
      },
      addCancel: function() {
        this.addingWord = false;
        this.$refs.addInputText.value = "";
        this.$refs.addInputType.value = "leaves";
        this.$refs.addInputSize.value = "large";
      },
      addWord: function() {
        let self = this;
        if (this.$refs.addInputText.value === "") {
          alert("Please enter a word");
        } else if (this.words.filter(function(word) {return word.word === self.$refs.addInputText.value}).length > 0) {
          alert("Please enter a word that is not already on the tree");
        } else {
          if (this.$refs.addInputType.value === "leaves") {
            this.words.push({word: this.$refs.addInputText.value, type: this.$refs.addInputType.value, size: this.$refs.addInputSize.value, top: 10, left: 10});
            window.scrollTo({top: 0, left: 0, behavior: "smooth"});
          } else if (this.$refs.addInputType.value === "trunk") {
            this.words.push({word: this.$refs.addInputText.value, type: this.$refs.addInputType.value, size: this.$refs.addInputSize.value, top: 50, left: 10});
            window.scrollTo({top: this.height / 3, left: 0, behavior: "smooth"});
          } else {
            this.words.push({word: this.$refs.addInputText.value, type: this.$refs.addInputType.value, size: this.$refs.addInputSize.value, top: 73, left: 10});
            window.scrollTo({top: 2 / 3 * this.height, left: 0, behavior: "smooth"});
          }
          this.addCancel();
        }
      },
      deleteClicked: function() {
        this.deletingWord = true;
      },
      deleteCancel: function() {
        this.deletingWord = false;
      },
      resetClicked: function() {
        if (confirm("Are you sure you would like to reset your tree? All your edits will be lost and this action cannot be undone")) {
          this.$store.commit('resetWords');
          this.words = this.$store.getters.Words;
        }
      }
    },
    mounted() {
      if (this.inverted) {
        let style = document.createElement("style");
        style.innerHTML = "div {--main-color: #805b00; --highlight-color: #AA8726}";
        document.getElementById("edit").prepend(style);
      } else {
        let style = document.createElement("style");
        style.innerHTML = "div {--main-color: #285380; --highlight-color: #99A1E3}";
        document.getElementById("edit").prepend(style);
      }
    }
  }
</script>

<style>

  .right {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    z-index: 100;
  }

  .right div {
    margin: 0 10px;
  }

  .invert {
    position: relative;
    right: -10px;
  }

  .action {
    background: none;
    border: 1px solid var(--main-color);
    border-radius: 20px;
    cursor: pointer;
    padding: 5px 10px;
    color: var(--main-color);
    margin-top: 5px;
    font-family: "Nunito", sans-serif;
    font-size: 15px;
    transition: font-weight .2s ease;
  }

  .delete, .reset {
    color: #ff1e1e;
    border: 1px solid #ff1e1e;
  }

  .action .fa {
    margin-right: 5px;
  }

  .action:hover {
    font-weight: 900;
  }

  .add-dropdown {
    position: absolute;
    background: white;
    border-bottom-left-radius: 40px;
    border-bottom-right-radius: 40px;
    width: 400px;
    right: 0;
    z-index: -10;
    top: 20px;
    opacity: 0;
    transition: top .5s ease, opacity .5s ease, z-index .5s ease, visible .5s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 18px 20px 25px 20px;
    box-sizing: border-box;
    visibility: hidden;
  }

  .showing {
    top: 70px;
    opacity: 1;
    z-index: 1;
    visibility: visible;
  }

  .add-dropdown > div {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .add-dropdown .selectors {
    margin-bottom: 15px;
  }

  .add-dropdown .selectors label {
    margin-right: 30px;
    font-family: "Nunito", sans-serif;
  }

  .add-dropdown .selectors select {
    outline: none;
    border-radius: 10px;
    padding: 0 5px;
  }

  .add-dropdown input {
    width: 100%;
    text-align: left;
    border-radius: 40px;
    border: none;
    background: #f7f7f7;
    height: 40px;
    outline: none;
    padding: 10px 25px;
    box-sizing: border-box;
    font-family: "Nunito", sans-serif;
    font-size: 18px;
  }

  .add-dropdown .fa {
    color: green;
    border: 1px solid green;
    border-radius: 50%;
    padding: 5px;
    margin-left: 15px;
    cursor: pointer;
  }


  .delete-word {
    position: absolute;
    top: -15%;
    left: -15%;
    width: 130%;
    height: 130%;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    color: #ff1e1e;
    opacity: 0;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity .5s ease, background .5s ease;
  }

  .word:hover .delete-word {
    opacity: 1;
  }

</style>
