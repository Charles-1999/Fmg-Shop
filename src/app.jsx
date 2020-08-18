import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'
import './app.scss'
import dva from './utils/dva'
<<<<<<< HEAD
import models from './model/index'
=======
import models from './model'

import { set as setGlobalData } from './global_data'
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7

//const store = configStore()
const dvaApp = dva.createApp({
  initialState: {},
  models: models,
  onError() {
    
  }
});
const store = dvaApp.getStore();


class App extends Component {
  // 先看看有没有用 //网上搬过来的
  componentWillMount(){
<<<<<<< HEAD
=======
    this.getSysInfo();
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7
    Taro.getSetting()
      .then(res=>{
        if(res.authSetting["scope.userInfo"]){
          return true;
        }else {
          throw new Error('没有授权')
        }
      })
      .then(res=>{
        return Taro.getUserInfo();
      })
      .then(res=>{
        Taro.setStorage({
          key: 'userInfo',
          data: res.userInfo
        })
      })
      .catch(err=>{
        console.log(err)
      })
    Taro.checkSession({
      success() {
        return Taro.getStorage({key: 'session3rd'})
      },
      fail() {
        return Taro.login()
          .then(response=>{
            console.log(response.code)
            return Taro.request({
              url: 'https://test.com/onLogin',
              code: response.code,
<<<<<<< HEAD
            },
            )
=======
            })
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7
              .then(res=>{
                if(res.statusCode===200){
                  Taro.setStorage({
                    key: 'session3rd',
                    data: res.data.data.session3rd
                  })
                }else if(res.status === 500){
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
    })
  }

<<<<<<< HEAD
=======
  getSysInfo() {
    // 先缓存获取
    let isIphoneX = Taro.getStorageSync('isIphoneX') || false;
    // 获取设备信息
    const sysInfo = Taro.getSystemInfoSync();
    // 状态栏高度
    const statusBarHeight = sysInfo.statusBarHeight;
    // 胶囊信息
    const capsule = Taro.getMenuButtonBoundingClientRect();
    console.log(capsule);
    // 缓存没有 再获取
    if (!isIphoneX) {
      if (sysInfo.model.includes('iPhone')) {
        const reg = /X|11/;
        isIphoneX = reg.test(sysInfo.model.split(' ')[1])
      }
    }
    // 存储到缓存中
    Taro.setStorageSync('isIphoneX', isIphoneX)
    // 设置全局变量
    setGlobalData('isIphoneX', isIphoneX);
    setGlobalData('statusBarHeight', statusBarHeight);
    setGlobalData('capsule', capsule);
  }

>>>>>>> 45991747250e5e0c203065310304ba03a78913c7
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
