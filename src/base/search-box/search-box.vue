<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" class="box" :placeholder="placeholder" v-model="query">
    <i @click="clear" class="icon-dismiss" v-show="query"></i>
  </div>
</template>

<script>
import {debounce} from 'common/js/util'

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲,歌手'
    }
  },
  data() {
    return {
      query: ''
    }
  },
  methods: {
    setQuery(query) {
      this.query = query
    },
    clear() {
      this.query = ''
    },
    blur() {
      this.$refs.query.blur()
    }
  },
  created() {
    // 调用节流函数
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery)
    }, 200))
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable'

  .search-box
    display flex
    align-items center
    box-sizing border-box
    width 100%
    padding 0 6px
    height 40px
    background-color $color-background-g
    border-radius 6px
    .icon-search
      font-size 24px
      color $color-text-g
    .box
      flex 1
      margin 0 5px
      line-height 18px
      color $color-text
      font-size $font-size-medium
      &::placeholder
        color $color-text-g
    .icon-dismiss
      font-size 16px
      color $color-text-g
</style>