import React, { Component } from 'react';
import { View, Image, Text, Button, Navigator } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './toolBar.less'

class ToolBar extends Component {
  state = {
    isIphoneX: false
  }

  componentDidMount() {
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    this.setState({ isIphoneX })
  }

  render() {
    const {isIphoneX} = this.state;
    const {callback} = this.props;
    return (
      <View className={isIphoneX ? 'isIphoneX tool_bar' : 'tool_bar'} >
        <View className='tool_item'>
          <Image src='http://qiniu.daosuan.net/picture-1598882867000' mode='heightFix' />
          <Text>转发</Text>
          <Button openType='share'></Button>
        </View>
        <View className='tool_item'>
          <Image src='http://qiniu.daosuan.net/picture-1598883925000' mode='heightFix' />
          <Text>收藏</Text>
        </View>
        <Navigator className='tool_item' url='/pages/cart/index' openType='switchTab'>
          <Image src='http://qiniu.daosuan.net/picture-1598883445000' mode='heightFix' />
          <Text>购物车</Text>
        </Navigator>
        <View className='tool_item_2 add_cart' onClick={callback.bind(this,1)}>
          加入购物车
        </View>
        <View className='tool_item_2' onClick={callback.bind(this,2)}>
          立即购买
        </View>
      </View>
    )
  }
}

export default ToolBar; 