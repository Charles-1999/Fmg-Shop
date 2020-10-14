import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'
import './app.scss'
import request from './utils/request'
import login, {appLogin} from './utils/login'
import dva from './utils/dva'
import models from './model'

import { set as setGlobalData } from './global_data'

//const store = configStore()
const dvaApp = dva.createApp({
  initialState: {},
  models: models,
  onError() {
    
  }
});
const store = dvaApp.getStore();

class App extends Component {
  // async onLaunch() {
  //   const userInfo = Taro.getStorageSync("userInfo");
  //   if(!userInfo) {
  //     Taro.redirectTo({ url:"/pages/login/index" });
  //   }
  //   else {
  //     try {
  //       const js_code = await appLogin();
  //       const res = await login(js_code);
  //       console.log(res)
  //     }catch(err) {
  //       console.log(err)
  //       Taro.showToast({
  //         title: '小程序登录失败，请重新进入小程序。',
  //         icon: 'none',
  //         duration: 2500
  //       })
  //     }
  //   }
  // }

  componentWillMount(){
    this.getSysInfo();
  }

  /* 获取设备信息 */
  getSysInfo() {
    // 先缓存获取
    let isIphoneX = Taro.getStorageSync('isIphoneX') || false;
    // 获取设备信息
    const sysInfo = Taro.getSystemInfoSync();
    // 状态栏高度
    const statusBarHeight = sysInfo.statusBarHeight;
    // 窗口宽度
    const windowWidth = sysInfo.windowWidth;
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
    Taro.setStorageSync('isIphoneX', isIphoneX);
    Taro.setStorageSync('sysInfo', sysInfo);
    // 设置全局变量
    setGlobalData('isIphoneX', isIphoneX);
    setGlobalData('statusBarHeight', statusBarHeight);
    setGlobalData('capsule', capsule);
    setGlobalData('windowWidth', windowWidth);
  }
  
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
