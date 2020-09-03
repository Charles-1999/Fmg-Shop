import React, {Component} from 'react';
import { View } from '@tarojs/components';
import Navbar from '@components/navbar/navbar'
import Taro from '@tarojs/taro'
import { get as getGlobalData } from '../../global_data'

import './index.scss'


class CartListView extends Component {
  constructor() {
    super(...arguments)
  }
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule')
  }

  componentDidShow() {
  }

  render(){
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='cart' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar 
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          title='购物车'
        >
        </Navbar>
        <View className=''></View>
      </View>
    )
  }
}

export default CartListView;