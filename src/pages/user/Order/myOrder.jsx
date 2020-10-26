import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import Loading from '../../../components/Loading'
import request from '../../../utils/request'
import './myOrder.scss'

import ListGood from './list_good'

//要想下拉加载就不能用connect dva
@connect(({ order }) => ({
  ...order,
}))
class MyOrderList extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    goodsList:[],
    capsule: getGlobalData('capsule'),
    userId: Taro.getStorageSync('userId'),
    tabList:[
      {id:0, title:' 全 部 '},
      {id:1, title:'待付款'},
      {id:2, title:'待发货'},
      {id:3, title:'待收货'},
      {id:4, title:'待评价'},
      {id:6, title:'售后/退款'},
    ],
    orderList:[],
    currentIndex: Current.router.params.status,
    isLoading:false,
    page:1, //总页面数量
  }
  async componentDidMount () {
    this.getOrderList();   
  }
  // config = {
  //   "enablePullDownRefresh": true, 
  //   onReachBottomDistance:50
  // }  

  /**获取订单列表信息 */
  async getOrderList(){
    this.setState({ isLoading: true });
    const userId = Taro.getStorageSync('userId'); //获取当前用户信息
    const orderList = await request('/_order/list', {
      body: {
        author_id:userId,
        status: parseInt(this.state.currentIndex),
        limit:this.state.page*10,
      },
      method: 'GET'
    })
    const orders = get(orderList,'orders');
    const Ids = orders.map((arr) => {return arr.id})
    const orderInfoList = await request('/_order/_mget', {
      body: {
        ids:Ids
      },
      method: 'POST'
    })
    this.setState({
      orderList: orderInfoList,
    })
    orderInfoList.map(item => {
      get(item,'order_detail').map(good => {
        console.log(item);
        console.log(good);
        console.log(get(good,'goods_id'))
        this.setState({
          goodsList: [...this.state.goodsList,get(good,'goods_id')]
        })
        return get(good,'goods_id')
      })
    })
    this.setState({
      goodsList:this.unique(this.state.goodsList)
    })
    
    console.log(this.state.goodsList)
    this.setState({ isLoading: false });
  }

  //去重
  unique(arr) {
    const res = new Map();
    return arr.filter((a) => !res.has(a) && res.set(a,1))
  }

  //上拉加载
  onReachBottom() {
    this.setState({ isLoading: true });
    this.setState({
      page: this.state.page+1
    })
    this.getOrderList();
    this.setState({ isLoading: false });
  }

  /**改变当前订单列表状态tab*/
  setCurrentIndex(status){
    this.setState({
      currentIndex: status,
    })
    this.getOrderList()
  }
  /**暂时 最好不能///  手动修改订单状态 */
  async changeStatus(oid,ooid){
    await this.props.dispatch({
      type: 'order/editOrderInfo',
      payload:{
        status:4,
        oid:oid,
        ooid:ooid,
      }
    })
  }
  // 加入购物车
  async addCart(item){
    const {userId} = this.state;
    const order_detail = get(item,'order_detail');
    order_detail.map(good => {
      const data = request(`/good/_mget`,{
        method: 'POST',
        body: {
          ids: [get(good,'goods_id')]
        }
      }).then(()=> {
      const specification_list = data.specification
      const spe_index = specification_list.findIndex(i => i.id == get(good,'goods_specification_id'));
      const spe = get(specification_list[spe_index],'specification') 
      try{
        //const currChoose = get(good,'goods_specification_id')
        const res =  request(`/car/info/${userId}/${data.id}`,{
          method: 'POST',
          body: {
            goods_count: get(good,'purchase_qty'),
            goods_specification: spe,
            deliveryKind: get(item,'delivery'),
            goods_specification_id: get(good,'specification_id'),
          }
        });
        console.log(res)
        console.log('addCart_res',res)
        Taro.showToast({
          title: '加入购物车成功',
          icon: 'success'
        })
        this.hiddenFloat();
      }catch (error) {
        console.log('addCart_error',error)
        console.error(error.data.message);
        Taro.showToast({
          title: '加入购物车失败',
          icon: 'none'
        })
      }
      })   
    })
  }
  /* 统一下单 */
  pay = async (order_id) => {
    const { order_price } = this.state;
    const sysInfo = Taro.getStorageSync('sysInfo');
    const open_id = Taro.getStorageSync('open_id');
    const userId = Taro.getStorageSync('userId');
    try {
      const res_pay = await request(`/pay/unified/${order_id}`, {
        body: {
          body: '凤鸣谷-商城', // 
          detail: '测试', // 
          device_info: sysInfo.model, // 
        },
        method: 'POST'
      })
      console.log(res_pay)
      this.requestPayment(res_pay.request);
    }
    catch (err) {
      console.log(err)
    }
  }

  /* 发起微信支付 */
  requestPayment = async (data) => {
    Taro.requestPayment({
      timeStamp: data.timeStamp, // 时间戳
      nonceStr: data.nonceStr, // 随机字符串
      package: data.package, // 统一下单接口返回的 prepay_id
      signType: data.signType, // 签名算法
      paySign: data.paySign, // 签名
      success: res => {
        console.log('发起微信支付：' , res);
      },
      fail: err => {
        console.log(err)
        Taro.showToast({
          title: '发起微信支付失败，请重新尝试！',
          icon: 'none'
        })
      }
    })
  }

  //取消订单
  async cancelOrder(id){
    console.log(id)
    try{        
      await request(`/_order/${id}/cancel`,{
          method: 'POST',
      }).then(()=>{
        Taro.showToast({
          title: '订单取消成功',
          icon: 'success'
        })
        this.getOrderList()
      })
    }catch(error){
      Taro.showToast({
        title: '订单取消失败',
        icon: 'none'
      })
    }
  }

  //删除订单
  async delOrder(oid,ooid){
    const getOrderList = () => this.getOrderList();
    try{
      Taro.showModal({
        title: '删除订单',
        //icon: 'success',
        content: '请确认要删除订单？',
        confirmText: '确认',
        cancelText:'取消',
        async success(res) {
          console.log(res)
          if(res.confirm){
            console.log('deling')
            await request(`/_order/${ooid}/child_order/${oid}`,{
              method: 'DELETE',
            })
            getOrderList();
          }  
        }
      })
    }
    catch(error){
      Taro.showToast({
        title: '删除订单失败',
        icon: 'none'
      })
    }
  }

  //跳转到详情页面
  toDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/user/Order/orderDetail?id=${id}`,
    });
  } 
  //跳转到物流详情页面
  toDeliveryDetail= (id) => {
    Taro.navigateTo({
      url: `/pages/user/Order/deliveryDetail?id=${id}`,
    });
  } 
  //跳转到评论页面
  toComment= (id) => {
    Taro.navigateTo({
      url: `/pages/user/Order/comment?id=${id}`,
    });
  } 

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    const {goodsList} = this.state.goodsList
    console.log(this.state.goodsList)

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
                  <View className='list-item' key={item.id}>
                    <View className='top-wrap'>
                      <View className='order-code' onClick={this.toDetail.bind(this,item.id)}>
                        <View className='name'>
                          订单编号：
                        </View>
                        <View className='code' onClick={this.toDetail.bind(this,item.id)}>
                          {get(item,'order_num')}
                        </View>
                      </View>
                      <View className='order_status_wrap'>
                      <View className='status'>
                        {item.order_status == 1 ? <View>待付款</View> : ''}
                        {item.order_status == 2 ? <View>买家已付款</View> : ''}
                        {item.order_status == 3 ? <View>卖家已发货</View> : ''}
                        {item.order_status == 4 ? <View>待评价</View> : ''}
                        {item.order_status == 5 ? <View>订单已完成</View> : ''}
                        {item.order_status == 6 ? <View>订单已取消</View> : ''}
                      </View>
                    </View>
                                 
                    </View>
                    <View key={item.id}>
                      {get(item,'order_detail',[]).map(goods_item=>(
                        <View className='good-item' key={goods_item.id} onClick={this.toDetail.bind(this,item.id)}>
                          <ListGood 
                            goodId={get(goods_item,'goods_id','')} 
                            speId={get(goods_item,'goods_specification_id','')} 
                            price={get(goods_item,'goods_amount','')} 
                            quality={get(goods_item,'purchase_qty','')} 
                            goodsList={goodsList}
                            message={get(goods_item,'message','')}
                          />                      
                        </View>
                      ))}
                    </View>
                    <View className='total-fee-wrap'>
                      <View className='detail-fee'>
                      <View className='fee-wrap'>
                        <View className='all-fee'>总价：</View>
                        <View className='money'>¥{get(item,'child_goods_amount')*0.01},&ensp;</View>
                      </View>
                      {get(item,'child_total_coupon') ? 
                        <View className='fee-wrap'>
                          <View className='all-coupon'> 优惠：</View>
                          <View className='money'> ¥{get(item,'child_total_coupon')*0.01},&ensp;</View>
                        </View>
                      :''}
                      {get(item,'child_exp_fare') ? 
                        <View className='fee-wrap'>
                          <View className='all-coupon'> 运费：</View>
                          <View className='money'> ¥{get(item,'child_exp_fare')*0.01}</View>
                        </View>
                      :''}
                      </View>
                      <View className='fee-wrap'>
                        <View className='pay-fee'> 实付款：</View>
                        <View className='pay-fee-money'> ¥{get(item,'child_order_amount')*0.01}</View>
                      </View>
                    </View>
                    <View className='btn'>
                      {item.order_status == 1  ? <View style='display:inline-flex'>
                        <View className='cancel' onClick={this.cancelOrder.bind(this,get(item,'order_id'))}>取消订单</View>
                        <View className='pay' onClick={this.pay.bind(this,get(item,'order_id'))}>付款</View>
                        </View> : ''}
                      {item.order_status == 2  ? '' : ''}
                      {item.order_status == 3  ? <View><View className='delivery' onClick={this.toDeliveryDetail.bind(this,item.id)}>查看物流</View></View> : ''}
                      {item.order_status == 4  ? <View style='display:inline-flex'>
                        <View className='commit' onClick={this.addCart.bind(this,item)}>加入购物车</View>
                        <View className='commit' onClick={this.toComment.bind(this,item.id)}>我要评价</View>
                      </View> : ''}
                      {item.order_status == 5  ? <View style='display:inline-flex'> <View className='del' onClick={this.delOrder.bind(this,item.id,get(item,'order_id'))}>
                        <Image src='http://qiniu.daosuan.net/picture-1602728418000' /></View> </View> : ''}
                      {item.order_status == 6  ? <View style='display:inline-flex'> <View className='del' onClick={this.delOrder.bind(this,item.id,get(item,'order_id'))}>
                        <Image src='http://qiniu.daosuan.net/picture-1602728418000' /></View> 
                        <View className='pay' onClick={this.changeStatus.bind(this,item.id,get(item,'order_id'))}>修改订单状态</View>
                        </View> : ''}
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