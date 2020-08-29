import React, { Component } from 'react'
import { View, Text, Button, OpenData, Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import './index.scss'
import { AtButton } from "taro-ui"
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
    //this.toLogin();
    try {
      const value = Taro.getStorageSync('userInfo')
      if (value) {
        Taro.switchTab({
          url: '/pages/index/index'
        })
      }
    } catch (e) {
      console.log("error: " + e);
      //Do something when catch error
    }  
  }
  // handleWXGetUserInfo = (event) => {
  //   console.log(event.detail)
  // }
  toLogin = () => {
    Taro.login()
          .then(response=>{
            console.log(response.code)
            return Taro.request({
              url: 'https://api.daosuan.net/account/login',
              code: response.code,
            })
              .then(res=>{
                if(res.statusCode===200){
                  console.log(res)
                  Taro.setStorage({
                    key: 'session3rd',
                    data: res.data.data.session3rd
                  })
                }else if(res.status === 500){
                  console.log('发生错误，请重试！')
                  Taro.showToast({
                    title: '发生错误，请重试！',
                    icon: 'none'
                  })
                }
              })
          })
          .catch(err=>{
            console.log(err);
            Taro.showToast({
              title: '发生错误，请重试!',
              icon: 'none'
            })
          })
      }
  

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

