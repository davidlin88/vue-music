import {commonParams} from './config'
import axios from 'axios'

export function getLyric(songMid) {
  const url = '/api/lrc'

  const data = Object.assign({}, commonParams, {
    platform: 'yqq', // 加引号
    hostUin: 0,
    needNewCode: 0,
    loginUin: 0,
    format: 'json', // 改为json
    pcachetime: +new Date(), // 时间戳
    songmid: songMid
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
