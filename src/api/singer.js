import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    uin: 0,
    needNewCode: 0,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all', // 查看所有歌手
    pagesize: 100, // 查多少数据
    pagenum: 1, // 查第几页数据
    g_tk: 1595941909,
    hostUin: 0
  })

  return jsonp(url, data, options)
}