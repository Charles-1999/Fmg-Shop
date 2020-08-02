import React, { Component } from 'react'
import { View, Text, Button, OpenData, Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import './index.scss'
import Menu from '../../components/menu/menu';
import headerjpg from '../../assets/img/fmgLoginLogo.png'

class LoginView extends Component {
  constructor() {
    super(...arguments)
  }

  tobegin = () => {
    Taro.switchTab({
      url: '/pages/index/index'
    });
  };

  componentDidMount(){
    try {
      const value = Taro.getStorageSync('userInfo')
      if (value) {
        Taro.redirectTo({
          url: '/pages/index/index'
        })
      }
    } catch (e) {
      console.log("error: " + e);
      // Do something when catch error
    }
    
  }
  // handleWXGetUserInfo = (event) => {
  //   console.log(event.detail)
  // }


  render () {
    return (
      <View className='loginViewWrap'>
        <Image src={headerjpg} className='fmg-logo' />
        <View className='fmg-name'>凤鸣谷</View>
        <View className='fmg-login'>该程序将获取以下授权</View>
        <View className='fmg-login-info'>·获得您的公开信息（昵称，头像等）</View>
        {/* <Button openType='getUserInfo' onGetUserInfo={this.handleWXGetUserInfo.bind(this)} >微信授权登录</Button> */}
        <Button className='btn' openType='getUserInfo' onGetUserInfo={this.tobegin} type='primary' lang='zh_CN'>
            微信授权登录
        </Button>
      </View>
    )
  }
}

export default LoginView;

