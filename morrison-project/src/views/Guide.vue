<template>
  <div id = "guide">
    <div class = "background" v-bind:style = "{minHeight: windowHeight + 'px'}">
      <div class = "toolbar">
        <div class = "nav">
          <router-link class = "link" to = "/">Back</router-link>
        </div>
      </div>
      <div class = "content">
        <h1>"Morrison Tree" Guide</h1>
        <p>	Morrison’s writing is all about intertwining stories and understanding how changing the perspective changes this resultant narrative. I wanted my project to reflect these ideas by having a strong interactive component so that the viewer could add their own perspective and narrative to the story told by the product — the perfect job for a webpage!
          <br><br>
          The product itself shows a tree — not only a motif through both books but also a symbol for the importance of “roots” and history — with three distinct sections: the roots (representing the past and family history), the trunk (representing the struggles of the present), and the leaves (representing what the future holds). Different words, themes, and characters are scattered throughout the tree — arranged spatially to show how they connect to each other and to these three sections. The interactivity comes from being able to invert the tree, hover effects, and colors (representative of changing perspective), and also adding new words to the tree (representative of contributing a narrative to the story).
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Guide",
    data() {
      return {
        windowHeight: window.innerHeight
      }
    }
  }
</script>

<style scoped>

  .background {
    background: url("../assets/TreeC.png") center center no-repeat;
    width: 100%;
    position: relative;
    overflow: hidden;
    transition: background .5s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .toolbar {
    border-bottom: none;
  }

  .content {
    margin-top: 100px;
    width: 65%;
    min-width: 400px;
    background: white;
    border-radius: 40px;
    padding: 50px 80px;
    text-align: left;
    box-sizing: border-box;
  }

  h1 {
    margin-bottom: 20px;
    font-size: 45px;
    color: black;
    font-family: "Antic", sans-serif;
  }

  p {
    font-family: "Nunito", sans-serif;
    line-height: 30px;
    font-size: 19px;
  }

</style>
