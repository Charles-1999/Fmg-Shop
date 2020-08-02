import Taro from '@tarojs/taro'

const isDev = false
const devUrl = 'http://47.101.163.80:8083'
const productionUrl = 'https://www.mygoodslist.com'
const BASE_URL = isDev ? devUrl : productionUrl
// const BASE_URL = 'http://fpy229.imwork.net'

const setToken = token => Taro.setStorage({ key: 'token', data: token })
const getToken = () =>
  Taro.getStorage({ key: 'token' })
    .then(res => res.data)
    .catch(() => '')

const getLoginToken = () =>
  new Promise((resolve, reject) => {
    Taro.login({
      success: function(res) {
        if (res.code) {
          // 利用code获取登录状态
          return fetch({
            url: '/app/auth/loginByJsCode',
            method: 'POST',
            data: {
              jsCode: res.code,
              channel: 'weixin',
            },
          }).then(async loginData => {
            await setToken(loginData.token)
            resolve(loginData.token)
          })
        } else {
          Taro.showToast({
            title: '登录失败',
            icon: 'none',
            duration: 2000,
          })
          reject('登录失败')
        }
      },
    })
  })

async function fetch(options) {
  const { url, method = 'GET', data: paramsData, header } = options
  let token = await getToken()

  if (!token && url !== '/app/auth/loginByJsCode') {
    token = await getLoginToken()
  }

  return Taro.request({
    url: `${BASE_URL}${url}`,
    method,
    data: paramsData,
    header: {
      ...header,
      'Content-Type': 'application/json',
      'Mini-Token': token,
    },
  })
    .then(async response => {
      const {
        data: { data, code },
      } = response

      if (code === '1005') {
        // token失效，重新登录，后再次返回该接口
        await getLoginToken()
        return fetch({
          url,
          method,
          data,
          header,
        })
      }

      if (code !== '0000') {
        return Promise.reject(response.data)
      }

      return data
    })
    .catch(error => {
      Taro.showToast({
        title: (error && error.msg) || '接口报错，请稍后在试',
        icon: 'none',
        duration: 2000,
      })
      return Promise.reject()
    })
}

export { setToken, getToken, BASE_URL }
export default fetch
