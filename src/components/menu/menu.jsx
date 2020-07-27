import React, { Component } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtTabBar, AtIcon } from 'taro-ui';
import './menu.scss';

class Menu extends Component {
  constructor() {
    super(...arguments);
  }
  goHref = (value) => {
    switch (value) {
      case 0:
        Taro.redirectTo({
          url: '/pages/index/index'
        });
        break;
      case 1:
        Taro.redirectTo({
          url: '/pages/category/index'
        });
        break;
      case 2:
        Taro.redirectTo({
          url: '/pages/find/index'
        });
        break;
      case 3:
        Taro.redirectTo({
          url: '/pages/cart/index'
        });
        break;
      case 4:
        Taro.redirectTo({
          url: '/pages/user/index'
        });
        // 获取用户信息
        // Taro.getUserInfo({
        //   success: async(res) => {
        //     await Taro.setStorageSync('userInfo', res.userInfo);
        //     Taro.redirectTo({
        //       url: '/pages/user/index'
        //     });
        //   }
        // });
        break;
      default:
        Taro.redirectTo({
          url: '/pages/index/index'
        });
    }
  }
  render(){
    const { isActive } = this.props;
    return (
      <View class='buttomlist-mwnu'>
        
        <AtTabBar
          fixed
          tabList={[
            { title: '首页', iconType: 'home'},
            { title: '分类', iconType: 'menu'},
            { title: '发现', iconType: 'streaming',},
            { title: '购物车', iconType: 'shopping-cart', text: '1'},
            { title: '我的', iconType: 'user'},
          ]}
          onClick={this.goHref.bind(this)}
          current={isActive}
        />
      </View>
    )
  }
}
export default Menu;