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
      userInfo: Taro.getStorageSync('userInfo')
    }
  }

  componentDidMount(){  
    if(!this.state.userId) {
      this.login();
    }
    if(this.state.userInfo) {
      Taro.switchTab({ url: '/pages/index/index' })
    }
  }

  login(){
    Taro.login({
      success: res => {
        console.log('小程序登录成功！')
        // request('/account/login/wx_login', {
        //   body: {
        //     js_code: res.code
        //   },
        //   method: 'POST'
        // }).then( data => {
        //   console.log(data)
        //   Taro.setStorageSync('userId',data.id)
        //   Taro.setStorageSync('token',data.token)
        // })
      },
      fail: err => {
        console.log(err)
      }
    })
  }

  getUserInfo(e) {
    if(e.detail.userInfo){
      Taro.setStorageSync('userInfo', e.detail.userInfo)
      Taro.switchTab({ url: '/pages/index/index' })
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

