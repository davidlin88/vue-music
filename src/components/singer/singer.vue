<template>
  <div class="singer">
    <list-view @select="selectSinger" :data="singerList"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default{
  data() {
    return {
      singerList: []
    }
  },
  created() {
    this._getSinger()
  },
  methods: {
    selectSinger(singer) {
      // $router是vue-router的编程跳转接口 --> 执行一个路由跳转
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // 往state里写singer的值
      this.setSinger(singer)
    },
    _getSinger() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singerList = this._normallizeSinger(res.data.list)
        } else {
          console.log('没,没有歌手')
        }
      })
    },
    _normallizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为得到有序列表,需要处理map
      let hot = []
      let rest = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          rest.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 按Findex的字母的ASCII码升序排序
      rest.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 按需求 --> 顺序返回hot数组和首字母数字
      return hot.concat(rest)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER' // 方法映射
    })
  },
  components: {
    ListView
  }
}
</script>

<style lang="stylus">
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>