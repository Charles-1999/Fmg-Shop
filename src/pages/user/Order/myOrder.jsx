import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import './myOrder.scss'
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import Loading from '../../../components/Loading'

import ListGood from './list_good'

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
    isLoading:false,
    currentPage:1, //当前页面数量
    allPage:1, //总页面数量
  }
  async componentDidMount () {
   
    this.getOrderList();
    
  }
  async getOrderList(){
    console.log("reloading");
    this.setState({ isLoading: true });
    const userId = Taro.getStorageSync('userId'); //获取当前用户信息
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        account_id:userId,
        status: this.state.currentIndex,
      }
    })
    const {orderList} = this.props
    const Ids = orderList.map((arr) => {return arr.id})
    console.log(Ids)
    await this.props.dispatch({
      type: 'order/mgetOrderList',
      payload: {
        ids:Ids
      }
    })
    const {orderInfoList} = this.props;
    console.log(222);
    console.log(orderInfoList)
    this.setState({
      orderList: orderInfoList,
    })
    this.setState({ isLoading: false });
  }
  /**改变当前订单列表状态tab*/
  setCurrentIndex(status){
    this.setState({
      currentIndex: status,
    })
    this.getOrderList()
  }

  // onPullDownRefresh() {
  //   console.log('下拉刷新')
  //   setTimeout(() => {
  //       // 停止下拉刷新
  //       Taro.stopPullDownRefresh()
  //   }, 1000)
  // }

  // onReachBottom() {
  //     console.log('触底事件，做上拉加载')
  // }


  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;

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
          {this.state.orderList !== null ? 
            <View className='list-item-wrap' key={this.state.currentIndex}>
              {this.state.orderList.map(item=>(
                <View key={item.id}>
                  {get(item,'child_order',[]).map(child=>(
                    <View className='list-item' key={child.id}>
                      <View className='order_status_wrap'>
                          <View className='status'>
                            {child.order_status == 1 ? <View>待付款</View> : ''}
                            {child.order_status == 2 ? <View>买家已付款</View> : ''}
                            {child.order_status == 3 ? <View>卖家已发货</View> : ''}
                            {child.order_status == 4 ? <View>交易成功</View> : ''}
                            {child.order_status == 5 ? <View>退款</View> : ''}
                          </View>
                      </View>
                      <View key={child.id}>
                        {get(child,'order_detail',[]).map(goods_item=>(
                          <View className='good-item' key={goods_item.id}>
                            <ListGood 
                              goodId={get(goods_item,'goods_id','')} 
                              speId={get(goods_item,'goods_specification_id','')} 
                              price={get(goods_item,'order_amount','')} 
                              quality={get(goods_item,'purchase_qty','')} 
                            />                      
                          </View>
                        ))}
                      </View>
                      <View className='total_fee_wrap'>
                          <View className='all_fee'>商品总额：</View>
                          <View className='money'>¥{get(item,'total_goods_amount')},&ensp;</View>
                          <View className='all_coupon'> 共优惠：</View>
                          <View className='money'> ¥{get(item,'total_coupon')},&ensp;</View>
                          <View className='pay_fee'> 实付金额：</View>
                          <View className='money'> ¥{get(item,'total_order_amount')}</View>
                        </View>
                      <View className='btn'>
                          {child.order_status == 1  ? <View><View className='pay'>付款</View></View> : ''}
                          {child.order_status == 2  ? <View>买家已付款</View> : ''}
                          {child.order_status == 3  ? <View><View className='dilivery'>查看物流</View></View> : ''}
                          {child.order_status == 4  ? <View><View className='add_cart'>加入购物车</View></View> : ''}
                          {child.order_status == 5  ? <View>退款</View> : ''}
                        </View>
                      <View style='clear:both'></View>
                    </View>
                  ))}
               </View>
              ))}
            </View>
          : ''}          
      </View>
        <Loading isLoading={this.state.isLoading} />
      </View>
    )
  }
}

export default MyOrderList;