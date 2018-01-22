<template>
  <div class="loading">
    <img src="./loading.gif" height="24" width="24">
    <p class="desc">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '正在载入...'
    }
  }
}
</script>

<style lang="stylus">
  .loading
    width 100%
    text-align center
    .desc
      line-height 20px
      font-size $font-size-small
      color $color-text
</style>