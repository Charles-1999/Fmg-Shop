import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro  from '@tarojs/taro'; 
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { connect } from 'react-redux';
import { get } from 'lodash';
import './index.scss'

import { get as getGlobalData } from '../../global_data'

import Navbar from '../../components/navbar/navbar'

@connect(({ order }) => ({
  ...order,
}))
class UserList extends Component {
  static defaultProps = {
    iconList: [],
  };
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    uid: Taro.getStorageSync('userId'),
    capsule: getGlobalData('capsule'),
    numberInfo: [
      { id:1, title:'余额', info:'37.90'},
      { id:2, title:'积分', info:'1'},
      { id:3, title:'卡', info:'3'},
      { id:4, title:'优惠卷/码', info:'4'},
    ],
    code1: 0, //待付款
    code2: 0, //待发货
    code3: 0, //待收货
    code4: 0, //待评价
    code5: 0, //退款/售后
  }
  
  componentDidMount(){
    this.getOrderCode();
  }

  componentDidShow(){
    this.getOrderCode();
  }
  //获取订单信息code
  async getOrderCode(){
    console.log(this.state.uid)
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        account_id:this.state.uid,
      }
    });
    const total = get(this.props.orderList,'total');
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        limit:total,
        account_id:this.state.uid,
        status: 1,
      }
    });
    this.setState({
      code1: this.props.orderList.total
    })
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        limit:total,
        account_id:this.state.uid,
        status: 2,
      }
    });
    this.setState({
      code2: this.props.orderList.total
    })
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        limit:total,
        account_id:this.state.uid,
        status: 3,
      }
    });
    this.setState({
      code3: this.props.orderList.total
    })
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        limit:total,
        account_id:this.state.uid,
        status: 4,
      }
    });
    this.setState({
      code4: this.props.orderList.total
    })
  }

  handlePage(e){
    if(e == 'address'){
      Taro.navigateTo({
        url: `/pages/user/Address/addressList`,
      });
    }
  }
  handleOrder = (status) => {
    console.log(status);
    Taro.navigateTo({
      url: `/pages/user/Order/myOrder?status=${status}`,
    });
  }

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    const userInfo = Taro.getStorageSync('userInfo'); //获取当前用户信息

   
    return (
      <View className='userlist' >
        {/* <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          title='我的'
        ></Navbar> */}
        <View className='top-wrap' >
          <View className='user-info'>
            <View className='touxiang'>
              <Image circle size='large' src={userInfo.avatarUrl}></Image>
            </View>
            <View className='info'>
              <View className='name'>
                {userInfo.nickName}
              </View>
              <View className='edit-info'>
                <View className='info'>
                  个人信息
                </View>
                <image src='http://qiniu.daosuan.net/picture-1598883556000' />
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
        </View>
      
        <View className='myorder-list-wrap'>
          <View className='myorder-title' onClick={this.handleOrder.bind(this,0)}>我的订单</View>
          <View className='myorder-list'>
            <View className='myorder-list-item' onClick={this.handleOrder.bind(this,1)}>
              {this.state.code1 == 0 ?
                '':
                <View className='count'>{this.state.code1}</View>
              }
              <Image src='http://qiniu.daosuan.net/picture-1598882483000' style='width:90rpx;height:90rpx' />
              <View className='name'>待付款</View>
            </View>
            <View className='myorder-list-item' onClick={this.handleOrder.bind(this,2)}>
              {this.state.code2 == 0 ?
                '':
                <View className='count'>{this.state.code2}</View>
              }
              <Image src='http://qiniu.daosuan.net/picture-1598882446000' style='width:90rpx;height:90rpx' />
              <View className='name'>待发货</View>
            </View>
            <View className='myorder-list-item'onClick={this.handleOrder.bind(this,3)}>
              {this.state.code3 == 0 ?
                '':
                <View className='count'>{this.state.code3}</View>
              }
              <Image src='http://qiniu.daosuan.net/picture-1598882531000' style='width:90rpx;height:90rpx' />
              <View className='name'>待收货</View>
            </View>
            <View className='myorder-list-item' onClick={this.handleOrder.bind(this,4)}>
              {this.state.code4 == 0 ?
                '':
                <View className='count'>{this.state.code4}</View>
              }
              <Image src='http://qiniu.daosuan.net/picture-1598882509000' style='width:90rpx;height:90rpx' />
              <View className='name'>待评价</View>
            </View>
            <View className='myorder-list-item' onClick={this.handleOrder.bind(this,7)}>
              <Image src='http://qiniu.daosuan.net/picture-1599033897000' style='width:90rpx;height:90rpx' />
              <View className='name-last'>退款/售后</View>
            </View>
          </View>
        </View>
        <View className='other-service-wrap'>
          <View className='other-service-title'>其他服务</View>
          <View className='other-service-list'>
            <View className='other-service-item' onClick={this.handlePage.bind(this,'address')}>
              <Image src='http://qiniu.daosuan.net/picture-1598883667000' style='width:90rpx;height:90rpx' />
              <View className='name'>收货地址</View>
            </View>
            {/* <View className='other-service-item'>
              <Image src='http://qiniu.daosuan.net/picture-1598883277000' style='width:90rpx;height:90rpx' />
              <View className='name'>账号设置</View>
            </View> */}
          </View>
        </View>
      </View>
    )
  }
}

export default UserList;

