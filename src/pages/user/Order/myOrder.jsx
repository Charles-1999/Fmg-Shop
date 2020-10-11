import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import Loading from '../../../components/Loading'
import './myOrder.scss'

import ListGood from './list_good'

@connect(({ order, goods }) => ({
  ...order,
}))
class MyOrderList extends Component {
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

  //跳转到详情页面
  toDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/user/Order/orderDetail?id=${id}`,
    });
  }

  onReachBottom() {
    console.log("addddd")
    // this.setState({ isLoading: true });
    // const userId = Taro.getStorageSync('userId'); //获取当前用户信息
    // await this.props.dispatch({
    //   type: 'order/getOrderList',
    //   payload: {
    //     account_id:userId,
    //     status: this.state.currentIndex,
    //     page: 2,
    //   }
    // })
    // const {orderList} = this.props
    // const Ids = orderList.map((arr) => {return arr.id})
    // console.log(Ids)
    // await this.props.dispatch({
    //   type: 'order/mgetOrderList',
    //   payload: {
    //     ids:Ids
    //   }
    // })
    // const {orderInfoList} = this.props;
    // this.setState({
    //   orderList: [...orderInfoList],
    // })
  }


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
                  <View className='list-item' key={item.id} onClick={this.toDetail.bind(this,item.id)}>
                    <View className='order-code'>
                      <View className='name'>
                        订单编号：
                      </View>
                      <View className='code'>
                        {get(item,'order_num')}
                      </View>
                    </View>
                    {/* <View className='order_status_wrap'>
                      <View className='status'>
                        {item.order_status == 1 ? <View>待付款</View> : ''}
                        {item.order_status == 2 ? <View>买家已付款</View> : ''}
                        {item.order_status == 3 ? <View>卖家已发货</View> : ''}
                        {item.order_status == 4 ? <View>交易成功</View> : ''}
                        {item.order_status == 5 ? <View>退款</View> : ''}
                      </View>
                    </View> */}
                    <View key={item.id}>
                      {get(item,'order_detail',[]).map(goods_item=>(
                        <View className='good-item' key={goods_item.id}>
                          <ListGood 
                            goodId={get(goods_item,'goods_id','')} 
                            speId={get(goods_item,'goods_specification_id','')} 
                            price={get(goods_item,'goods_amount','')} 
                            quality={get(goods_item,'purchase_qty','')} 
                          />                      
                        </View>
                      ))}
                    </View>
                    <View className='total-fee-wrap'>
                      <View className='all-fee'>总价：</View>
                      <View className='money'>¥{get(item,'child_goods_amount')},&ensp;</View>
                      <View className='all-coupon'> 优惠：</View>
                      <View className='money'> ¥{get(item,'child_total_coupon')},&ensp;</View>
                      <View className='pay-fee'> 实付款：</View>
                      <View className='money'> ¥{get(item,'child_order_amount')}</View>
                    </View>
                    <View className='btn'>
                      {item.order_status == 1  ? <View><View className='pay'>付款</View></View> : ''}
                      {item.order_status == 2  ? <View>买家已付款</View> : ''}
                      {item.order_status == 3  ? <View><View className='dilivery'>查看物流</View></View> : ''}
                      {item.order_status == 4  ? <View><View className='add_cart'>加入购物车</View></View> : ''}
                      {item.order_status == 5  ? <View>退款</View> : ''}
                    </View>
                    <View style='clear:both'></View>
                  </View>             
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