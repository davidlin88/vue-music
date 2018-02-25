<template>
  <div class="rank">
    <scroll class="toplist" ref="rank">
      <ul>
        <li class="item" v-for="(item, index) in topList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, i) in item.songList" :key="i">
              <span>{{i + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import {getToplist} from 'api/rank'
import {ERR_OK} from 'api/config'
import Scroll from 'base/scroll/scroll'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      topList: []
    }
  },
  created() {
    this._getToplist()
  },
  methods: {
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this._setRankItem(item)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rank.$el.style.bottom = bottom
      this.$refs.rank.refresh()
    },
    _setRankItem(item) {
      let {id, topTitle} = item
      let ret = {id, topTitle}
      this.setRankItem(ret)
    },
    _getToplist() {
      getToplist().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        } else {
          console.log('没,没有排行')
        }
      })
    },
    ...mapMutations({
      setRankItem: 'SET_RANKITEM'
    })
  },
  components: {
    Scroll
  }
}
</script>

<style lang="stylus" scoped>
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .rank
    position fixed
    width 100%
    top 88px
    bottom 0
    background-color $color-background-g
    .toplist
      height 100%
      overflow hidden
      .item
        display flex
        margin 0 20px
        padding-top 20px
        height 100px
        &:first-child
          padding-top 0
        &:last-child
          padding-bottom 20px
        .icon
          flex 0 0 100px
          width 100px
          height 100px
        .songlist
          flex 1
          display flex
          flex-direction column
          justify-content center
          padding 0 20px
          height 100px
          overflow hidden
          color $color-text
          font-size $font-size-small
          background-color $color-background
          .song
            no-wrap()
            line-height 26px
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translate3dY(-50%)
</style>