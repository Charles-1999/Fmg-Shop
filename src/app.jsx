import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { Provider } from 'react-redux'
import './app.scss'
import dva from './utils/dva'
import models from './model/index'

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
            },
            )
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
