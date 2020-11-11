import React, { Component } from 'react';
import { View, Image, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './baseInfo.less'

class BaseInfo extends Component {
  static defaultProps = {
    details: {},
  }

  render() {
    const { details, showPrice, unSalePrice } = this.props
    return (
      <View className='base_info' >
        <View className='top'>
          <View className='left'>
            <View className='name'>{details.name}</View>
            <View className='sale_point'>{details.sale_point}</View>
          </View>
        </View>
        <View className='bottom'>
          <Text className='price'>
            <Text className='sign'>￥</Text><Text className='text'>{showPrice}</Text>
            {details.sale
            ? <Text className='unSalePrice'><Text className='sign'>￥</Text>{unSalePrice}</Text>
            : ''}
          </Text>
        </View>
      </View>
    )
  }
}

export default BaseInfo;