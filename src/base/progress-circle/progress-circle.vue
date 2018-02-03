<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default{
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable'

  .progress-circle
    position relative
    font-size 0
    circle
      stroke-width 8px
      transform-origin center
      &.progress-background
        transform scale(0.8)
        stroke $color-theme-l
      &.progress-bar
        transform scale(0.8) rotate(-90deg) // 修改圆的起始位置
        stroke $color-theme
</style>