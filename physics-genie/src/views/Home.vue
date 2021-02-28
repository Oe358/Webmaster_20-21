<template>
  <div class = "container">
    <Menu />
    <User />
  </div>
</template>

<script>

  import Menu from "../components/Menu";
  import User from "../components/User";

  export default {
    name: "Home",
    components: {
      Menu,
      User
    },
    data() {
      return {

      }
    },
    mounted() {

    }
  }
</script>

<style scoped>



</style>
