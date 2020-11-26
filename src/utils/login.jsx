import Taro from '@tarojs/taro'
import request from './request'

/*
  小程序登录
*/
export function appLogin() {
  return new Promise((resolve, reject) => {
    Taro.login({
      success: res => resolve(res.code),
      fail: err => reject(err)
    })
  })
}

/*
  后端登录
*/
export default function login(js_code) {
  return new Promise(async(resolve, reject) => {
    try {
      const res = await request("/account/login/wx_login", {
        body: {
          js_code
        },
        method: "POST"
      })
      console.log('login',res);
      Taro.setStorageSync('userId',res.id);
      Taro.setStorageSync('token',res.token);
      Taro.setStorageSync('open_id',res.open_id);
      Taro.switchTab({ url: '/pages/index/index' });
      resolve(res);
    }
    catch(err) {
      reject(err);
    }
  })
}

/*
  注册功能
*/
export function register(key, userInfo) {
  return new Promise(async(resolve, reject) => {
    try {
      const res = await request("/account/login/register", {
        body: {
          city: userInfo.city,
          country: userInfo.country,
          province: userInfo.province,
          nickName: userInfo.nickName,
          avator: userInfo.avatarUrl,
          key
        },
        method: 'POST'
      })
      console.log('register',res);
      Taro.setStorageSync('userId',res.id);
      Taro.setStorageSync('token',res.token);
      Taro.setStorageSync('open_id',res.openid);
      Taro.reLaunch({ url: '/pages/index/index' });
      resolve(res);
    }catch(err) {
      Taro.showToast({
        title: '注册账号失败，请重新尝试。',
        icon: 'none',
        duration: 2500
      })
      reject(err);
    }
  })
}
