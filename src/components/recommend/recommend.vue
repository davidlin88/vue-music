<template>
  <div class="recommend">
    <div class="recommend-content">
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
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {getRecommend} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'

export default{
  data() {
    return {
      recommends: []
    }
  },
  components: {
    Slider
  },
  created() {
    this._getRecommend()
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider
        } else {
          console.log('没,没有推荐')
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
.recommend
  .recommend-content
    .slider-wrapper
      position relative
      width 100%
      overflow hidden
    .recommend-list
      .list-title
        color $color-text-l
        font-size $font-size-medium
        text-align center
        line-height 28px

</style>