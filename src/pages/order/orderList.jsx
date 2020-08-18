import React, { Component } from 'react'
import { View, Button, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import { AtGrid, AtTabs, AtTabsPane } from "taro-ui"
import './index.scss';
import product from '../../assets/img/shangPing.jpg';

class OrderList extends Component {
  state = {
    current: 0,
    orderList:[
      {
        id:1,
        orderId:'Ex23454965486345245',
        status:'交易关闭',
        pic:product,
        title:'季的胜·百除螨沐浴露|百年秘方，强力除螨',
        type:'肉桂除螨沐浴露',
        price:39,
        quality:177.00,
      },
      {
        id:2,
        orderId:'Ex23454965486345245',
        status:'交易关闭',
        pic:product,
        title:'季的胜·百除螨沐浴露|百年秘方，强力除螨',
        type:'肉桂除螨沐浴露',
        price:39,
        quality:177.00,
      },
      {
        id:3,
        orderId:'Ex23454965486345245',
        status:'待付款',
        pic:product,
        title:'季的胜·百除螨沐浴露|百年秘方，强力除螨',
        type:'肉桂除螨沐浴露',
        price:39,
        quality:177.00,
      },
      {
        id:4,
        orderId:'Ex23454965486345245',
        status:'待收货',
        pic:product,
        title:'季的胜·百除螨沐浴露|百年秘方，强力除螨',
        type:'肉桂除螨沐浴露',
        price:39,
        quality:177.00,
      },
    ],
  }

  handleClick (value) {
    this.setState({
      current: value
    })
  }
  render () {
    return (
      <View className='orderlist-wrap'>
        <AtTabs
          animated={false}
          current={this.state.current}
          className='toplist'
          tabList={[
            { title: '全部' },
            { title: '待付款' },
            { title: '待发货' },
            { title: '已发货' },
            { title: '待评价' },
          ]}
          onClick={this.handleClick.bind(this)}
        >
          <AtTabsPane current={this.state.current} index={0} >
            {this.state.orderList.map(item => 
              <View className='allList' key={item.id}>
                <View className='orderId'>订单编号：${item.orderId}</View>
                <View className='orderStatus'>{item.status}</View>
                <View style='clear: both;'></View>
                <View className='midCard'>
                  <View className='orderPic'><Image src={item.pic} style='width:90px;height:90px'></Image></View>
                  <View className='orderTitle'>{item.title}</View>
                  <View className='orderType'>{item.type}</View>
                  <View className='orderPrice'>¥ {item.price}</View>
                  <View className='orderQuality'>x {item.quality}</View>
                </View>
                <View style='clear: both;'></View>
                <View className='orderTotal'>合计：¥{item.price*item.quality}</View>
                <View style='clear: both;'></View>
             </View>
            )}
           
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            {this.state.orderList.map(item => 
                {item.status==='待付款' ?
                <View className='allList' key={item.id}>
                  <View className='orderId'>订单编号：${item.orderId}</View>
                  <View className='orderStatus'>{item.status}</View>
                  <View style='clear: both;'></View>
                  <View className='midCard'>
                    <View className='orderPic'><Image src={item.pic} style='width:90px;height:90px'></Image></View>
                    <View className='orderTitle'>{item.title}</View>
                    <View className='orderType'>{item.type}</View>
                    <View className='orderPrice'>¥ {item.price}</View>
                    <View className='orderQuality'>x {item.quality}</View>
                  </View>
                  <View style='clear: both;'></View>
                  <View className='orderTotal'>合计：¥{item.price*item.quality}</View>
                  <View style='clear: both;'></View>
              </View>: null }
              )}
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
          {this.state.orderList.map(item => 
                {item.status==='待收货' ?
                <View className='allList' key={item.id}>
                  <View className='orderId'>订单编号：${item.orderId}</View>
                  <View className='orderStatus'>{item.status}</View>
                  <View style='clear: both;'></View>
                  <View className='midCard'>
                    <View className='orderPic'><Image src={item.pic} style='width:90px;height:90px'></Image></View>
                    <View className='orderTitle'>{item.title}</View>
                    <View className='orderType'>{item.type}</View>
                    <View className='orderPrice'>¥ {item.price}</View>
                    <View className='orderQuality'>x {item.quality}</View>
                  </View>
                  <View style='clear: both;'></View>
                  <View className='orderTotal'>合计：¥{item.price*item.quality}</View>
                  <View style='clear: both;'></View>
              </View>: null }
              )}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}
export default OrderList;

