<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <transition name="slide" >
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="stylus">
.slide-enter-active, .slide-leave-active
  transition all .3s
.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(50%,0,0)
</style>
