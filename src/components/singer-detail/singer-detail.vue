<template>
  <transition name="slide">
    <div class="singer-detail">
<!--       <musiclist :title="title" :bg-image="bgImage" :songs="songs"></musiclist> -->
    </div>
  </transition>
</template>

<script>
// import MusicList from 'components/music-list/music-list'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/config'
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      songs: {}
    }
  },
  computed: {
    // 从state里取singer数据
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    this._getDetail()
  },
  methods: {
    _normallizeSongs(data) {
      let a = {}
      a.name = data.singer_name
      let list = data.list
      let songnames = []
      let albumnames = []
      for (var i = 0; i < list.length; i++) {
        songnames[i] = list[i].musicData.songname
        albumnames[i] = list[i].musicData.albumname
        console.log(i)
      }
      a.songnames = songnames
      a.albumnames = albumnames
      return a
    },
    _getDetail() {
      // 没取到数据(如用户刷新),则跳回歌手页
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normallizeSongs(res.data)
          console.log(this.songs)
        } else {
          console.log('没,没有歌曲')
        }
      })
    }
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/variable'

.singer-detail
  position fixed
  z-index 100
  top 0
  left 0
  right 0
  bottom 0
  background-color $color-background
.slide-enter-active, .slide-leave-active
  transition all .3s
.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>