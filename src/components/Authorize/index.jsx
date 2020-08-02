import Taro, { Component } from '@tarojs/taro'
import { Image, View, Text, Button } from '@tarojs/components'

import taroFetch from '../../utils/request'
import { setStorage, getStorage } from '../../utils/storage'

import bkImg from '../../assets/authorize/background.png'
import logoImg from '../../assets/authorize/logo.png'
import logoDesImg from '../../assets/authorize/logo-des.png'
import weixinImg from '../../assets/authorize/weixin.png'

//import OpenTypeButton from '../OpenTypeButton'
import './index.scss'

export default class Authorize extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasAuthorize: true,
    }
  }

  async componentDidShow() {
    let userInfo = await getStorage('userInfo')
    if (userInfo) {
      userInfo = JSON.parse(userInfo)
    }
    if (!userInfo || !userInfo.nickName) {
      // 没有用户昵称，则意味着没有更新用户信息，此时跳授权页面
      userInfo = await this.getServiceInfo()
      if (!userInfo || !userInfo.nickName) {
        this.setState({
          hasAuthorize: false,
        })
        return
      }
      await setStorage('userInfo', JSON.stringify(userInfo))
    }
  }

  getSystemInfo = () =>
    Taro.getSystemInfo()
      .then(res => res)
      .catch(error => error)

  getUserInfo = () => {
    Taro.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          this.setState({
            hasAuthorize: false,
          })
        } else {
          Taro.authorize({
            scope: 'scope.userInfo',
            success: () => {
              Taro.getUserInfo({
                success: response => {
                  this.updateUserInfoToService(response)
                },
              })
            },
          })
        }
      },
    })
  }

  getServiceInfo = () =>
    taroFetch({
      url: '/app/member/getMemberInfo',
    })
      .then(res => res)
      .catch(error => error)

  updateUserInfoToService = async userData => {
    const { brand, system, model } = await this.getSystemInfo()
    const params = {
      userInfo: {
        ...userData.userInfo,
        encryptedData: userData.encryptedData,
        iv: userData.iv,
      },
      systemInfo: {
        brand,
        system,
        model,
      },
    }
    taroFetch({
      url: '/app/member/updateMemberInfo',
      method: 'POST',
      data: params,
    }).then(() => {
      taroFetch({
        url: '/app/member/getMemberInfo',
      }).then(res => {
        console.log('/app/member/getMemberInfo', res)
      })
    })
  }

  handleUserInfo = info => {
    console.log(info)
    this.setState(
      {
        hasAuthorize: true,
      },
      () => {
        this.updateUserInfoToService(info.target)
      }
    )
  }

  render() {
    const { hasAuthorize } = this.state
    if (!hasAuthorize) {
      return (
        <View className='authorize'>
          <View className='authorize-top'>
            <View className="authorize-top-content">
              <Image className="authorize-img-logo" src={logoImg} />
              <Image className="authorize-img-logodes" src={logoDesImg} />
            </View>
            <Image className="authorize-top-bk" src={bkImg} />
          </View>
          <View className="authorize-bottom">
            <Button
              openType="getUserInfo"
              onGetUserInfo={this.handleUserInfo}
            >
              <View className="authorize-bottom-action">
                <Image className="authorize-img-weixin" src={weixinImg} />
                <Text>授权登录</Text>
              </View>
            </Button>
          </View>
        </View>
      )
    }
    return <View>{this.props.children}</View>
  }
}
