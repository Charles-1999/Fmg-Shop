import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import './myOrder.scss'
import { connect } from 'react-redux';
import Taro from '@tarojs/taro'; 
import { get as getGlobalData } from '../../global_data'
import Navbar from '../../components/navbar/navbar'


class MyOrderList extends Component {
  static defaultProps = {
    iconList: [],
  };
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    tabList:[
      {id:0, title:'待付款'},
      {id:1, title:'待发货'},
      {id:2, title:'待收货'},
      {id:3, title:'待评价'},
      {id:4, title:'退款/售后'},
    ],
    currentIndex:0,
  }
  componentDidMount () {
    // const user = Taro.getStorageSync('userInfo');
  
  }
  setCurrentIndex(status){
    this.setState({
      currentIndex: status,
    })
  }

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    const userInfo = Taro.getStorageSync('userInfo'); //获取当前用户信息

    return (
      <View className='my-order' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='我的订单'
        ></Navbar>
        <View className='my-order-list'>
          <View className='my-order-bar'>
          {this.state.tabList.map(item =>(
            item.id == this.state.currentIndex ? 
            <View className='tab-item-active' key={item.id} onClick={this.setCurrentIndex.bind(this,item.id)} >
              {item.title}
            </View>
            :
            <View className='tab-item' key={item.id} onClick={this.setCurrentIndex.bind(this,item.id)} >
              {item.title}
            </View>
          ))}
          
          </View>
        </View>
      </View>
    )
  }
}

export default MyOrderList;