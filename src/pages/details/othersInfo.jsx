import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './othersInfo.less'

class OthersInfo extends Component {
  render() {
    let {info} = this.props;
    if(info.carriage && typeof info.carriage == 'number') info.carriage = info.carriage.toFixed(2);
    return (
      <View className='others_info' >
        <View className='info_wrap'>
          <Text className='title'>发货地</Text>
          <Text className='content'>广东江门</Text>
        </View>
        <View className='info_wrap'>
          <Text className='title'>运费</Text>
          <Text className='content'>￥{info.carriage}</Text>
        </View>
        <View className='info_wrap'>
          <Text className='title'>月销</Text>
          <Text className='content'>{info.month_sale}件</Text>
        </View>
      </View>
    )
  }
}

export default OthersInfo;
