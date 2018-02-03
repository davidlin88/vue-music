<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {createSong} from 'common/js/song'
import {getRankDetail} from 'api/rank'
import {ERR_OK} from 'api/config'

export default {
  data() {
    return {
      rank: true,
      rankDetail: {},
      songs: []
    }
  },
  computed: {
    title() {
      return this.rankItem.topTitle
    },
    bgImage() {
      if (this.songs.length) {
        return this.songs[0].image
      }
      return ''
    },
    ...mapGetters([
      'rankItem'
    ])
  },
  created() {
    this._getRankDetail()
  },
  methods: {
    _normalizeSongs(list) {
      let ret = [] // 定义返回值
      list.forEach((item) => {
        let {data} = item // 解构
        if (data.songid && data.albummid) {
          ret.push(createSong(data))
        }
      })
      return ret
    },
    _getRankDetail() {
      if (!this.rankItem.id) {
        this.$router.push('/rank')
      } else {
        getRankDetail(this.rankItem.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          } else {
            console.log('没,没有排行歌曲')
          }
        })
      }
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable'
.slide-enter-active, .slide-leave-active
  transition all .3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>