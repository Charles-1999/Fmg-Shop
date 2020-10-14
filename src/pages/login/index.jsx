/* 
  页面：登录
  作者：Charles_十七
*/

import React, { Component } from 'react'
import { View, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import request from '../../utils/request'
import login,{ appLogin, register } from '../../utils/login'
import './index.scss'
import headerjpg from '../../assets/img/fmgLoginLogo.png'

class LoginView extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      userId: Taro.getStorageSync('userId'),
      js_code: null
    }
  }

  login(){
    Taro.login({
      success: res => {
        console.log('小程序登录成功！',res.code);
        request(
          '/account/login/wx_login', 
          {
          body: {
            js_code: res.code
          },
          method: 'POST'
        }).then( data => {
          console.log('wx_login',data);
          if(data.key){
            this.register(data.key);
          }
          Taro.setStorageSync('userId',data.id);
          Taro.setStorageSync('token',data.token);
          Taro.setStorageSync('open_id',data.open_id);
          Taro.switchTab({ url: '/pages/index/index' })
        })
      },
      fail: err => {
        console.log(err);
      }
    })
  }

  /* 尝试登录 */
  tryLogin() {
    const {js_code} = this.state;
    request("/account/login/wx_login", {
      body: {
        js_code
      },
      method: "POST"
    }).then( data => {
      console.log('wx_login',data);
      if(data.key){
        // 登录失败，走注册
        this.register(data.key);
      }
      // 登录成功，跳转
      Taro.setStorageSync('userId',data.id);
      Taro.setStorageSync('token',data.token);
      Taro.setStorageSync('open_id',data.open_id);
      Taro.switchTab({ url: '/pages/index/index' });
    })
  }

  /* 注册功能 */
  async register(key){
    const userInfo = Taro.getStorageSync('userInfo');
    const data = await request('/account/login/register', {
      body: {
        city: userInfo.city,
        country: userInfo.country,
        province: userInfo.province,
        nickName: userInfo.nickName,
        key
      },
      method: 'POST'
    })
    console.log('register',data);
    Taro.setStorageSync('userId',data.id);
    Taro.setStorageSync('token',data.token);
    Taro.setStorageSync('open_id',data.openid);
    Taro.switchTab({ url: '/pages/index/index' });
  }

  /* 获取用户信息 */
  getUserInfo = async(e) => {
    if(e.detail.userInfo){
      const userInfo = e.detail.userInfo;
      Taro.setStorageSync('userInfo', userInfo);
      try {
        const js_code = await appLogin();
        const res = await login(js_code);
        // res中存在key，即账号没注册
        if(res.key) {
          await register(res.key, userInfo);
        }
        console.log(res)
      }catch(err) {
        console.log(err)
        Taro.showToast({
          title: '小程序登录失败，请重新进入小程序。',
          icon: 'none',
          duration: 2500
        })
      }
    }
  }

  render () {
    return (
      <View className='loginViewWrap'>
        <Image src={headerjpg} className='fmg-logo' />
        <View className='fmg-name'>凤鸣谷</View>
        <View className='fmg-login'>该程序将获取以下授权</View>
        <View className='fmg-login-info'>·获得您的公开信息（昵称，头像等）</View>
        <Button className='btn' openType='getUserInfo' onGetUserInfo={this.getUserInfo} type='primary' lang='zh_CN'>
            微信授权登录
        </Button>
      </View>
    )
  }
}

export default LoginView;