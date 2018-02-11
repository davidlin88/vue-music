import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 数组插入元素
// compare:findindex传入的是function,所以不能直接传val
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val) // 插入到数组最前
  if (maxLen && arr.length > maxLen) {
    arr.pop() // 删除末位元素
  }
}

// 数组删除元素
function deleteFormArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 存储搜索历史
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 加载本地缓存的搜索历史
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 删除搜索历史
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFormArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 清空搜索历史
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}