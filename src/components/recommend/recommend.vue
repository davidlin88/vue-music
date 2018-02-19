<template>
  <div class="recommend" ref="recommends">
    <scroll ref="scroll" class="recommend-content">
      <div>
        <!-- 轮播图 -->
        <div class="slider-wrapper" v-if="recommends.length">
          <slider>
            <div v-for="(item, index) in recommends" :key="index">
              <a :href="item.linkUrl" >
                <img :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" @click="change">热门歌单推荐</h1>
          <ul>
            <li v-for="(item, index) in discList" class="item" :key=index @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60">
              </div>
              <div class="text">
                <h2 class="name">{{item.creator.name}}</h2>
                <p class="desc">{{item.dissname}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <!-- loading -->
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'

export default{
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    change(e) {
      if (e.target.className.indexOf('list-title') === 0) {
        console.log(e.target.className.indexOf('list-title'))
        e.target.className = 'active list-title'
      } else {
        e.target.className = 'list-title'
      }
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    // 处理有迷你播放器时,scroll高度不全的情况
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.recommends.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        } else {
          console.log('没,没有轮播')
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      }).catch(() => {
        console.log('没,没有推荐,开始请求模拟数据...')
        setTimeout(() => {
          this.discList = require('../../../static/recommend.json').data.list
        }, 2000)
      })
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
    // loadImage() {
    //   if (!this.checkLoading) {
    //     this.$refs.scroll.refresh()
    //     this.checkLoading = true
    //   }
    // }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  background-color #fff
  .recommend-content
    height 100%
    overflow hidden
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .recommend-list
      .list-title
        color $color-text-l
        font-size $font-size-medium
        text-align center
        line-height 40px
      .item
        display flex
        align-items center
        box-sizing border-box
        padding 0 20px 20px 20px
        .icon
          width 60px
          padding-right 20px
        .text
          display flex
          flex 1
          flex-direction column
          justify-content center
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            color $color-text
            font-weight 600
          .desc
            color $color-text
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>