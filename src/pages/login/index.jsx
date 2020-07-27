import React, { Component } from 'react'
import { View, Text, Button, OpenData } from '@tarojs/components'
import Taro from '@tarojs/taro';
import Menu from '../../components/menu/menu';

class LoginView extends Component {
  constructor() {
    super(...arguments)
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleWXGetUserInfo = (event) => {
    console.log(event.detail)
  }
  onloginTest = (event) => {
    console.log(event);
    Taro.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          Taro.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
          console.log('登录！' + res.errMsg)
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
  // wx.getUserInfo({
  //   success: function(res) {
  //     var userInfo = res.userInfo //用户基本信息
  //     var nickName = userInfo.nickName //用户名
  //     var avatarUrl = userInfo.avatarUrl //头像链接
  //     var gender = userInfo.gender //性别 0：未知、1：男、2：女
  //     var province = userInfo.province //所在省
  //     var city = userInfo.city //所在市
  //     var country = userInfo.country //所在国家
  //   }
  // })
  render () {
    return (
      <View className='loginViewWrap'>
        {/* <button openType='getUserInfo'>获取用户登录信息</button> */}
        <Button openType='getUserInfo' onGetUserInfo={this.handleWXGetUserInfo.bind(this)} >微信授权登录</Button>
        <Button onloginTest={this.onloginTest.bind(this)} >登录</Button>
        <Button
          className='login-buttoNor'
          type="primary"
          open-type="getUserInfo"
          onGetUserInfo={this.tobegin}
        >微信获取用户信息</Button>

      </View>
    )
  }
}

export default LoginView;

