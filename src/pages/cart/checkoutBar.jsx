import React, {Component} from 'react';
import { View } from '@tarojs/components';
import Taro from '@tarojs/taro'

import './index.scss'


class CheckoutBar extends Component {
  constructor() {
    super(...arguments)
  }


  render(){
    return (
      <View className='checkout_bar'>
      </View>
    )
  }
}

export default CheckoutBar;