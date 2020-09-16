import React, { Component } from 'react'
import { View, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import request from '../../utils/request'
import './index.scss'
import headerjpg from '../../assets/img/fmgLoginLogo.png'

class LoginView extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      userId: Taro.getStorageSync('userId'),
    }
  }

  componentDidMount(){
    if(this.state.userId) {
      Taro.switchTab({ url: '/pages/index/index' })
    }
  }

  login(){
    Taro.login({
      success: res => {
        console.log('小程序登录成功！',res.code);
        request('/account/login/wx_login', {
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
    Taro.setStorageSync('open_id',data.open_id);
  }

  getUserInfo = (e) => {
    if(e.detail.userInfo){
      Taro.setStorageSync('userInfo', e.detail.userInfo);
      this.login();
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

