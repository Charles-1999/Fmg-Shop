import Taro from '@tarojs/taro'
// import taroFetch from './request'

const setStorage = (key, value) => Taro.setStorage({ key, data: value })
const getStorage = key =>
  Taro.getStorage({ key })
    .then(res => res.data)
    .catch(() => '')

const getUserInfo = () => {
  // let userInfo = await getStorage('userInfo')
  // if (!userInfo) {
  //   userInfo = await taroFetch({
  //     url: '/app/member/getMemberInfo',
  //   })
  //     .then(res => res)
  //   await setStorage('userInfo', JSON.stringify(userInfo))
  // }
}

export { setStorage, getStorage, getUserInfo }
