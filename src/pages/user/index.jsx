import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import './index.scss'
import Taro from '@tarojs/taro'; 
import headerjpg from '../../assets/img/TouXiang.jpg'
//import Menu from '../../components/menu/menu';

class UserList extends Component {
  state = {
    userInfo: {},
  }
  componentDidMount () {
    let user = Taro.getStorageSync('userInfo');
    console.log(user);
    this.setState({
      userInfo: user,
    })
    console.log(this.state.userInfo);
  }
  handleGetUserInfo = (event) => {
    console.log(event.detail);
  }
  myOrder = () => {
    Taro.navigateTo({
      url: '/pages/order/orderList'
    });
  }
  myInfoList = () => {
    Taro.navigateTo({
      url: '/pages/user/userInfoList'
    });
  }
  
  render () {
    return (
      <View className='userlist'>
        <View className='userHeader'>
          <View className='userSign'>
            <AtIcon className='sign-icon' value='edit' size='12' color='#e7e7e7' />
            <View className='sign-font'>签到</View>
          </View>
          <View className='userImage'>
            <AtAvatar circle image={headerjpg}></AtAvatar>
          </View>
          <View className='userName'>
            Eva
          </View>
        </View>
        <View className='numberInfo'>
          <View className='at-row'>
            <View className='at-col'>
              <View className='number'>0.00</View>
              <View className='text'>余额</View>
            </View>
            <View className='at-col'>
              <View className='number'>1</View>
              <View className='text'>积分</View>
            </View>
            <View className='at-col'>
              <View className='number'>0</View>
              <View className='text'>卡</View>
            </View>
            <View className='at-col'>
              <View className='number'>0.00</View>
              <View className='text'>优惠卷/码</View>
            </View>
          </View>
        </View>
        <AtList className='all-order'>
          <AtListItem
            title='我的订单'
            extraText='查看全部订单'
            arrow='right'
            onClick={this.myOrder}
          />
        </AtList>
        <View className='IconTab'>
        <AtTabBar
          iconSize={20}
          fontSize={12}
          tabList={[
            { title: '待付款', iconType: 'credit-card', text:'1' },
            { title: '待发货', iconType: 'shopping-bag' },
            { title: '待收货', iconType: 'lightning-bolt' },
            { title: '待评价', iconType: 'message' },
            { title: '退款/售后', iconType: 'money' },
          ]}
          // onClick={this.handleClick.bind(this)}
          // current={this.state.current}
        />
        </View>
        <View className='menu-list-tab'>
          <AtList>
            <AtListItem
              title='购物车'
              arrow='right'
              iconInfo={{ size: 20, color: 'black', value: 'shopping-cart', }}
            />
            <AtListItem
              title='收货地址'
              arrow='right'
              iconInfo={{ size: 20, color: 'black', value: 'map-pin', }}
            />
            <AtListItem
              title='个人信息'
              arrow='right'
              onClick={this.myInfoList}
              iconInfo={{ size: 20, color: 'black', value: 'list', }}
            />
            <AtListItem
              title='账号设置'
              arrow='right'
              iconInfo={{ size: 20, color: 'black', value: 'settings', }}
            />
          </AtList>
        </View>
      </View>
    )
  }
}

export default UserList;

