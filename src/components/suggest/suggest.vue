<template>
  <scroll
  class="suggest"
  :pullup="pullup"
  @scrollToEnd="searchMore"
  :beforeScroll="beforeScroll"
  @beforeScroll="listScroll"
  @data="result"
  ref="scroll">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-text="getDisplayName(item)"></p>
        </div>
      </li>
      <loading @v-show="hasMore" :title="''"></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="没,没有结果..."></no-result>
    </div>
  </scroll>
</template>

<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import Loading from 'base/loading/loading'
import {mapMutations, mapGetters, mapActions} from 'vuex'
import Singer from 'common/js/singer'
import NoResult from 'base/no-result/no-result'
import Scroll from 'base/scroll/scroll'

const TYPE_SINGER = 'singer'
const perpage = 30

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      hasMore: true,
      beforeScroll: true
    }
  },
  methods: {
    refresh() {
      this.$refs.scroll.refresh()
    },
    search() {
      this.hasMore = true
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._handleResult(res.data)
          this._checkMore(res.data)
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._handleResult(res.data))
          this._checkMore(res.data)
        }
      })
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name} - ${item.singer}`
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        if (item.singerid) {
          this.$router.push({
            path: `/search/${item.singerid}`
          })
          // 创建歌手对象
          let singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          // vuex设置歌手数据
          this.setSinger(singer)
        }
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    listScroll() {
      this.$emit('listScroll')
    },
    _checkMore(data) {
      const song = data.song
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    _handleResult(data) {
      let ret = []
      // 如果有zhidao属性和zhidao的singerid --> 将zhidao属性和type属性作为一个对象传入ret数组
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if (data.song) {
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    ...mapActions([
      'insertSong'
    ]),
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  watch: {
    query(newQuery) {
      this.search(newQuery)
    }
  },
  components: {
    Loading,
    NoResult,
    Scroll
  }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"] // class以icon-开头
          font-size: 14px
          color: $color-text
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>