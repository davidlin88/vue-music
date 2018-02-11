<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="suggest-wrapper" v-show="query">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <div class="shortcut-wrapper">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li v-for="(item, index) in hotKey" :key="index" class="item" @click="addQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list @select="addQuery" @delete="deleteOne" :searches="searchHistory"></search-list>
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import {getHotkey} from 'api/search'
import Suggest from 'components//suggest/suggest'
import {ERR_OK} from 'api/config'
import {mapActions, mapGetters} from 'vuex'
import SearchList from 'base/search-list/search-list'

export default{
  data() {
    return {
      hotKey: [],
      query: ''
    }
  },
  created() {
    this._getHotkey()
  },
  components: {
    SearchBox,
    Suggest,
    SearchList
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },
    clear() {
      this.clearSearchHistory()
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    _getHotkey() {
      getHotkey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        } else {
          console.log('没,没有热词')
        }
      })
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .suggest-wrapper
      position fixed
      bottom 0
      top 168px
      left 0
      right 0
      z-index 20
      background-color $color-background
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      z-index 18
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            font-size: $font-size-medium
            background-color $color-text-w
            color: $color-text
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>