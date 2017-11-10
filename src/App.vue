<template>
  <div id="app" ref="wib">
    <router-view></router-view>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'app',
  mounted () {
    this.$refs.wib.style.height = $(window).height() + 'px'
    console.log($(window).height())
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}
</style>
