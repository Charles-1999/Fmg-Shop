import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import './myOrder.scss'
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../global_data'
import Navbar from '../../components/navbar/navbar'

import ListGood from './myOrderComponent/list_good'

@connect(({ order, goods }) => ({
  ...order,
}))
class MyOrderList extends Component {
  static defaultProps = {
    iconList: [],
  };
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    tabList:[
      {id:0, title:'全部'},
      {id:1, title:'待付款'},
      {id:2, title:'待发货'},
      {id:3, title:'待收货'},
      {id:4, title:'待评价'},
      {id:5, title:'退款/售后'},
    ],
    orderList:[],
    currentIndex: Current.router.params.status,
  }
  async componentDidMount () {
    // const user = Taro.getStorageSync('userInfo');
    const userId = Taro.getStorageSync('userId'); //获取当前用户信息
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        account_id:userId,
        limit: 30
      }
    })
    const {orderList} = this.props
    const Ids = orderList.map((arr) => {return arr.id})
    Ids.map(item => (
      this.props.dispatch({
        type: 'order/getUserOrder',
        payload: {
          oid:item
        }
      }).then(()=>{
        const {userOrderInfo} = this.props
        console.log(userOrderInfo)
        this.setState({
          orderList: [...this.state.orderList,userOrderInfo],
        })
       
      })
    ))

    // await this.props.dispatch({
    //   type: 'order/getUserOrder',
    //   payload: {
    //     oid:get(orderList[12],'id')
    //   }
    // })
  
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
          
          <View className='list-item-wrap'>
          {this.state.orderList.filter(item => get(item,'detail').length !== 0 && this.state.currentIndex == 0).map(item=>(
              <View className='list-item' key={item.id}>
                {get(item,'detail',[]).map((list,list_index)=> (
                  <View className='good-item' key={list_index}>
                    <ListGood 
                      goodId={get(list,'goods_id')} 
                      speId={get(list,'goods_specification_id')} 
                      price={get(list,'price')} 
                      quality={get(list,'purchase_qty')} 
                    />
                  </View>
                 ))}
                <View className='total_fee'>
                  共计： ¥{get(get(item,'data'),'total_fee')*0.01}
                </View>
                <View className='btn'>
                  <View className='dilivery'>查看物流</View>
                </View>
                <View style='clear:both'></View>
              </View>
            ))}
            {this.state.orderList.filter(item => get(item,'detail').length !== 0 && get(get(item,'data',[]),'order_status') == this.state.currentIndex).map(item=>(
              <View className='list-item' key={item.id}>
                {get(item,'detail',[]).map((list,list_index)=> (
                  <View className='good-item' key={list_index}>
                    <ListGood 
                      goodId={get(list,'goods_id')} 
                      speId={get(list,'goods_specification_id')} 
                      price={get(list,'price')} 
                      quality={get(list,'purchase_qty')} 
                    />
                  </View>
                 ))}
                <View className='total_fee'>
                  共计： ¥{get(get(item,'data'),'total_fee')*0.01}
                </View>
                <View className='btn'>
                  <View className='dilivery'>查看物流</View>
                </View>
                <View style='clear:both'></View>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }
}

export default MyOrderList;