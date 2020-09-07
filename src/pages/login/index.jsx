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
    if(!this.state.userId) {
      this.getToken();
    }
  }

  getToken(){
    Taro.login({
      success: res => {
        console.log('小程序登录成功！')
        console.log(res.code)
        request('/account/login', {
          body: {
            js_code: res.code
          },
          method: 'POST'
        }).then( data => {
          Taro.setStorageSync('userId',data.id)
          console.log(data)
        })
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

