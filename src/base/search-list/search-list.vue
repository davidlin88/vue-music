<template>
  <div class="search-list">
    <ul>
      <li @click="selectItem(item)" class="search-item" v-for="(item, index) in searches" :key="index">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    deleteOne(item) {
      this.$emit('delete', item)
    }
  }
}
</script>

<style lang="stylus">
  @import '~common/stylus/variable'

  .search-list
    .search-item
      display flex
      align-items center
      height 40px
      .text
        flex 1
        color $color-text
      .icon
        extend-click()
        .icon-delete
          font-size $font-size-small
          color $color-text
</style>