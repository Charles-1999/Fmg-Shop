import React, { Component } from 'react';
import { View, Image, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './baseInfo.less'

class BaseInfo extends Component {
  static defaultProps = {
    details: {},
  }

  render() {
    const { details, showPrice } = this.props
    return (
      <View className='base_info' >
        <View className='top'>
          <View className='left'>
            <View className='name'>{details.name}</View>
            <View className='sale_point'>{details.sale_point}</View>
          </View>
          <View className='right'>
            <Image src='http://qiniu.daosuan.net/picture-1598882867000' />
            <Button openType='share'></Button>
          </View>
        </View>
        <View className='bottom'>
          <View className='price'>
            <Text style='font-size: 30rpx'>￥</Text>
            {showPrice}
          </View>
        </View>
      </View>
    )
  }
}

export default BaseInfo;