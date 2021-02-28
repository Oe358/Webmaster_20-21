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
    name: "Review",
    components: {
      Menu,
      User
    }
  }
</script>

<style scoped>

</style>
