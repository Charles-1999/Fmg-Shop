import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import './index.scss'
import { connect } from 'react-redux';
import Taro from '@tarojs/taro'; 
import { get as getGlobalData } from '../../global_data'

import headerjpg from '../../assets/img/TouXiang.jpg'
import Navbar from '../../components/navbar/navbar'


@connect(({ icon }) => ({
  ...icon,
}))
class UserList extends Component {
  static defaultProps = {
    iconList: [],
  };
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    numberInfo: [
      { id:1, title:'余额', info:'37.90'},
      { id:2, title:'积分', info:'1'},
      { id:3, title:'卡', info:'3'},
      { id:4, title:'优惠卷/码', info:'4'},
    ],
    orderIcon: [
      {id :1, title:'待付款', pic:''},
      {id :2, title:'待付款', pic:''},
      {id :3, title:'待付款', pic:''},
      {id :4, title:'待付款', pic:''},
      {id :5, title:'待付款', pic:''}
    ]
  }
  componentDidMount () {
    // const user = Taro.getStorageSync('userInfo');
    this.props.dispatch({
      type: 'icon/getIconList',
      payload:{
        page:1,
        limit:50,
      }
    });
  
  }

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    const userInfo = Taro.getStorageSync('userInfo'); //获取当前用户信息
    const {iconList} = this.props;
    const data = Array.from(iconList)
    console.log(iconList)
    const currentIcon = data.filter(item => item.title == '个人中心/我的订单');
    console.log(get(data.filter(item => item.name == '待付款')[0],'picture',''))
   

    return (
      <View className='userlist' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          title='我的'
        ></Navbar>
        <View className='top-wrap'>
          <View className='touxiang'>
            <Image circle size='large' src={userInfo.avatarUrl}></Image>
          </View>
          <View className='info'>
            <View className='name'>
              {userInfo.nickName}
            </View>
            <View className='edit-info'>
              个人信息
            </View>
          </View>
        </View>
        <View className='num-info-wrap at-row'>
          {this.state.numberInfo.map(item => (
            <View className='num-item at-col' key={item.id}>
              <View className='number'>{item.info}</View>
              <View className='title'>{item.title}</View>
            </View>
          ))}
        </View>
        <View className='myorder-list-wrap'>
          <View className='myorder-title'>我的订单</View>
          <View className='myorder-list'>
            <View className='myorder-list-item'>
              <Image src={'http://qiniu.daosuan.net/'+get(data.filter(item => item.name == '待付款')[0],'picture','')} style='width:90rpx;height:90rpx' />
              <View className='name'>待付款</View>
            </View>
            <View className='myorder-list-item'>
              <Image src={'http://qiniu.daosuan.net/'+get(data.filter(item => item.name == '待发货')[0],'picture','')} style='width:90rpx;height:90rpx' />
              <View className='name'>待发货</View>
            </View>
            <View className='myorder-list-item'>
              <Image src={'http://qiniu.daosuan.net/'+get(data.filter(item => item.name == '待收货')[0],'picture','')} style='width:90rpx;height:90rpx' />
              <View className='name'>待收货</View>
            </View>
            <View className='myorder-list-item'>
              <Image src={'http://qiniu.daosuan.net/'+get(data.filter(item => item.name == '待评价')[0],'picture','')} style='width:90rpx;height:90rpx' />
              <View className='name'>待评价</View>
            </View>
            <View className='myorder-list-item'>
              <Image src={'http://qiniu.daosuan.net/'+get(data.filter(item => item.name == '退款/售后')[0],'picture','')} style='width:90rpx;height:90rpx' />
              <View className='name-last'>退款/售后</View>
            </View>
          </View>
        </View>
        <View className='other-service-wrap'>
          <View className='other-service-title'>其他服务</View>
          <View className='other-service-list'>
            <View className='other-service-item'>
              <Image src={'http://qiniu.daosuan.net/'+get(data.filter(item => item.name == '收货')[0],'picture','')} style='width:90rpx;height:90rpx' />
              <View className='name'>收货地址</View>
            </View>
            <View className='other-service-item'>
              <Image src={'http://qiniu.daosuan.net/'+get(data.filter(item => item.name == '账号设置')[0],'picture','')} style='width:90rpx;height:90rpx' />
              <View className='name'>账号设置</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default UserList;

