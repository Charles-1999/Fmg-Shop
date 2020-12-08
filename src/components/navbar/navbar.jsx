import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { get as getGlobalData } from '../../global_data'
import SearchBar from './searchbar'
import './navbar.less'

export default class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      windowWidth: getGlobalData('windowWidth'),
      capsule: getGlobalData('capsule'),
    }
  }

  back = () => {
    const {backType, url} = this.props;
    console.log(backType,url)
    if(backType === 'back') Taro.navigateBack();
    else if(backType === 'navigate') Taro.navigateTo({ url });
    else if(backType === 'redirect') Taro.redirectTo({ url });
    else if(backType === 'switchTab') Taro.switchTab({ url });
  }

  render() {
    const { windowWidth, capsule } = this.state;
    const { statusBarHeight, capsuleHeight, title, color, showBack, showLogo, showSearch, showTitle, backgroundColor, backgroundImageStatus, backgroundImageCapsule, backColor } = this.props;
    return (
      <View className='navbar'>
        <View className='status' style={{ height: statusBarHeight, backgroundColor, backgroundImage: backgroundImageStatus }}></View>
        <View className='capsule' style={{ height: capsuleHeight, backgroundColor, backgroundImage: backgroundImageCapsule }}>
          {showLogo ?
            <View className='logo' style={{ marginLeft: windowWidth - capsule.right }}>凤鸣谷</View>
            : ''
          }
          {showBack ?
            <View className='back' onClick={this.back} style={{ height: capsuleHeight, width: capsuleHeight }}>
              {backColor == 'black' ? <Image src={'http://qiniu.daosuan.net/picture-1604460100000'} /> : <Image src={'http://qiniu.daosuan.net/picture-1607398148000'} />}
            </View>
            : ''
          }
          {showTitle ?
            <View className='title' style={{ lineHeight: capsuleHeight + 'px', color: color }}>{title}</View>
            : ''
          }
          {showSearch ?
            <SearchBar marginRight={windowWidth * 2 - capsule.right - capsule.left} marginLeft={windowWidth - capsule.right} />
            : ''
          }
        </View>
      </View>
    )
  }
}

Navbar.defaultProps = {
  title: '标题',
  color: '#000',
  showBack: false,
  showLogo: false,
  showSearch: false,
  showTitle: false,
  backType: 'back',
  backColor: 'black',
  backgroundColor: '#e5e5e5',
  backgroundImageStatus: '',
  backgroundImageCapsule: '',
}
