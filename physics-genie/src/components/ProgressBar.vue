<template>
  <div class = "progress-bar">
    <div class = "level curr"><h6>{{ level }}</h6></div>
    <div class = "bar">
      <div class = "badge"><div class = "img"></div></div>
      <div class = "curr-progress" v-bind:style = "{width: (completedXP/levelXP*100) + '%'}">
        <p v-bind:style = "((completedXP)/levelXP < 0.25) ? [{left: '5px'}, {top: '-16px'}, {minWidth: '100px'}] : [{right: '0'}]">{{ completedXP }} / {{ levelXP }}</p>
      </div>
      <div v-if = "add !== null" class = "advancement-progress" v-bind:style = "{width: (completedXP + add > levelXP ? (levelXP-completedXP)/levelXP*100 : add/levelXP*100) + '%'}"></div>
      <p v-if = "add !== null && add !== 0" class = "advancement-value" v-bind:style = "((completedXP + add)/levelXP > 0.9) ? [{right: '-5px'}, {top: '-16px'}] : [{right: '0'}]">+ {{ add }}</p>
    </div>
    <div class = "level target"><h6>{{ level + 1 }}</h6></div>
  </div>
</template>

<script>
  export default {
    name: "ProgressBar",
    props: {
      xp: {
        type: Number
      },
      add: {
        type: Number
      }
    },
    computed: {
      level: function() {
        return Math.floor(Math.sqrt(this.xp+9))-2;
      },
      completedXP: function() {
        return this.xp-Math.pow(Math.floor(Math.sqrt(this.xp+9)), 2)+9;
      },
      levelXP: function() {
        return 2*Math.floor(Math.sqrt(this.xp+9))+1;
      }
    }
  }
</script>

<style scoped>

  .progress-bar {
    width: 100%;
    height: 85px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .level {
    height: 35px;
    display: flex;
    font-size: 25px;
    font-family: "Antic", sans-serif;
    font-weight: 100;
    align-items: center;
    justify-content: center;
    width: 30px;
    background: #99a1e3;
    border: 1px solid rgba(117, 122, 167, 0.2);
    box-shadow: 0 0 3px 0 rgba(117, 122, 167, 0.5);
  }

  .level.target {
    background: #e8d2a9;
    border: 1px solid rgba(168, 148, 117, 0.2);
    box-shadow: 0 0 3px 0 rgba(168, 148, 117, 0.5);
  }

  .bar {
    width: 67%;
    height: 35px;
    border: 1px solid #285380;
    background: linear-gradient(to right, transparent, transparent, transparent, transparent, rgba(232, 210, 169, 0.5));
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 0 10px;
    box-shadow: 0 0 5px 0 rgba(17, 21, 33, 0.3);
  }

  .badge {
    width: 30px;
    height: 100%;
    position: absolute;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 27px;
    font-family: "Caveat", sans-serif;
    font-weight: 700;
    left: 10px;
  }

  .badge .img {
    background: url("../assets/logo.svg") no-repeat center;
    width: 100%;
    height: 100%;
    transition: width .4s ease, height .4s ease, top .4s ease;
  }

  .bar > div {
    height: 100%;
  }

  .bar .curr-progress {
    background: linear-gradient(to right, #285380, #8d94d1);
    width: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    box-sizing: border-box;
    transition: width .8s ease;
  }

  .bar p {
    font-size: 10px;
    font-family: 'Nunito', sans-serif;
    margin-right: 10px;
    position: absolute;
    right: 0;
    overflow: auto;
    color: rgba(24, 47, 75, 0.7);
    transition: right .5s ease, left .5s ease, top .5s ease;
  }

  .bar .advancement-progress {
    background: linear-gradient(to right, rgba(173, 182, 255, 0.8), rgba(172, 180, 255, 0.3));
    transition: width .8s ease;
  }

  .bar p.advancement-value {
    color: rgba(69, 59, 45, 0.7);
  }

</style>
