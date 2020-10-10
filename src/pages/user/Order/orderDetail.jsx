import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import './orderDetail.scss'
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import request from '../../../utils/request'
import ListGood from './list_good'



@connect(({ order, goods }) => ({
  ...order,
}))
class orderDetail extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    order_id:Current.router.params.id,  //当前订单id
    order_info:{},
    address_info:{},
  }
  async componentDidMount () {
    this.getOrderInfo();
    
  }
  //获取订单信息
  async getOrderInfo(){
    await this.props.dispatch({
      type: 'order/mgetOrderList',
      payload: {
        ids:[ parseInt(this.state.order_id)]
      }
    })
    const {orderInfoList} = this.props;
    this.setState({
      order_info : orderInfoList[0]
    })
    this.getAddressInfo();
  }
  //获取地址信息
  async getAddressInfo(){
    const id = get(this.state.order_info,'address_id')
    const info = await request(`/address/info/get/${id}`, {
      method: 'GET'
    })
    this.setState({
      address_info: info 
    })
  }

 

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;

    return (
      <View className='order-detail-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='订单详情'
        ></Navbar>
        <View className='order-detail'>
          <View className='address-wrap'>
            <View className='name-phone'>
              <View className='name'>收货人：{get(this.state.address_info,'name')}</View>
              <View className='phone'>电话：{get(this.state.address_info,'phone')}</View>
            </View>
            <View className='address-detail'>
              地址：{get(this.state.address_info,'province_name')}
              {get(this.state.address_info,'city_name')}
              {get(this.state.address_info,'district_name')}
              {get(this.state.address_info,'detail')}
            </View>
          </View>
          <View className='goods-wrap'>
            {get(this.state.order_info,'order_detail',[]).map(item => (
              <View key={item.id}>
                <ListGood 
                  goodId={get(item,'goods_id','')} 
                  speId={get(item,'goods_specification_id','')} 
                  price={get(item,'order_amount','')} 
                  quality={get(item,'purchase_qty','')} 
                />   
              </View>
            ))}
            <View className='total_fee_wrap'>
              <View className='all_fee'>总价：</View>
              <View className='money'>¥{get(this.state.order_info,'child_goods_amount')},&ensp;</View>
              <View className='all_coupon'> 优惠：</View>
              <View className='money'> ¥{get(this.state.order_info,'child_total_coupon')},&ensp;</View>
              <View className='pay_fee'> 实付款：</View>
              <View className='money'> ¥{get(this.state.order_info,'child_order_amount')}</View>
            </View>
          </View>
              
        </View>
      </View>
    )
  }
}

export default orderDetail;