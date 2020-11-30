import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import request from '../../../utils/request'
import ListGood from './list_good'
import './orderDetail.scss'
import formatTime from '../../.../../../utils/time'


@connect(({ order, goods }) => ({
  ...order,...goods,
}))
class OrderDetail extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    order_id:Current.router.params.oid,  //当前订单id
    test_order_id:Current.router.params.ooid,  //当前订单的总订单id
    order_info:[],
    goods_info:[],
    address_info:{},
    ids:[],  //商品ids
    deliveryInfo: [], //物流信息
    deliveryNameList:[  //物流公司编码
      {code:'zhongtong',title:'中通'},
      {code:'yuantong',title:'圆通'},
      {code:'shentong',title:'申通'},
      {code:'yunda',title:'韵达'},
      {code:'tiantian',title:'天天'},
      {code:'huitongkuaidi',title:'百世（汇通）'},
      {code:'zhaijisong',title:'宅急送'},
      {code:'jexpress',title:'极兔'},
    ],
    status:'', //改订单目前状态
    delivery_time: '',  //发货时间
    IsRefund: true,
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
    console.log(this.state.order_info)
    this.getgoodsInfo();
    this.getDeliveryInfo();
    this.getAddressInfo();
  }
  //获取商品信息
  async getgoodsInfo(){
    get(this.state.order_info,'order_detail').map(good => {
      this.setState({
        ids:[...this.state.ids,get(good,'goods_id')]
      })
      return this.state.ids
    })
    await this.props.dispatch({
      type: 'goods/mgetGoodsListEntity',
      payload: 
        this.state.ids
    })
    this.setState({
      goods_info:this.props.goodsList
    })
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
  /**获取快递信息 */
  async getDeliveryInfo(){
    const info = await request('/delivery/info/post', {
      body: {
        "delivry_corp_name":"zhongtong",
        "delivry_sheet_code":get(this.state.order_info,'tracking_id','') 
      },
      method: 'POST'
    })
    this.setState({
      deliveryInfo:get(info,'info'),
    })
    console.log(get(this.state.order_info,'tracking_id','' ))
    if(get(this.state.order_info,'tracking_id','' ) !== '0' && get(this.state.deliveryInfo,'data')!== null){
      this.setState({
        delivery_time:get(get(this.state.deliveryInfo,'data',[])[0],'ftime',''),
      })
      const delivery_status = get(this.state.deliveryInfo,'status');
      console.log(delivery_status)
      switch(delivery_status){
        case '99':
          this.setState({
            status:'订单已取消'
          })
        case '200':
          this.setState({
            status:'运输中'
          }) 
        
      }
    }
    else if(get(this.state.order_info,'delivery') == 2){
      this.setState({
        status:'同城配送'
      })
    }
    else if(get(this.state.order_info,'delivery') == 4){
      this.setState({
        status:'自取'
      })
    }
    else{
      this.setState({
        status:'暂无发货信息'
      })
    }
  }

  //跳转物流详情页面
  toDeliveryDetail(){
    Taro.navigateTo({
      url: `/pages/user/Order/deliveryDetail?id=${this.state.order_id}`,
    });
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
          <View className='status-wrap'>
            <View className='status'>
              {get(this.state.order_info,'order_status') == 1 ? <View>·待付款</View> : ''}
              {get(this.state.order_info,'order_status') == 2 ? <View>·买家已付款</View> : ''}
              {get(this.state.order_info,'order_status')  == 3 ? <View>·卖家已发货</View> : ''}
              {get(this.state.order_info,'order_status')  == 4 ? <View>·待评价</View> : ''}
              {get(this.state.order_info,'order_status')  == 5 ? <View>·订单已完成</View> : ''}
              {get(this.state.order_info,'order_status')  == 6 ? <View>·订单已取消</View> : ''}
            </View>
          </View>
          {get(this.state.deliveryInfo,'data') == null? 
          <View className='delivery-wrap'>
            <Image className='none-img' src='http://qiniu.daosuan.net/picture-1598882531000' />
            <View className='info'>
              <View className='none-status'>{this.state.status}</View>
            </View>
          </View>:
          <View className='delivery-wrap' onClick={this.toDeliveryDetail.bind(this)}>
            <Image className='img' src='http://qiniu.daosuan.net/picture-1598882531000' />
            <View className='info'>
              <View className='delivery-status'>{this.state.status}</View>
              <View className='newest-status'>{get(get(this.state.deliveryInfo,'data',[])[0],'context','')}</View>
              <View className='newest-time'>{this.state.delivery_time}</View>
            </View>
          </View>
          }
          <View className='address-wrap'>
            <Image className='icon-address' src='http://qiniu.daosuan.net/picture-1598883667000' ></Image>
            <View className='info'>
              <View className='name-phone'>
                <View className='name'>{get(this.state.address_info,'name')}</View>
                <View className='phone'>{get(this.state.address_info,'phone')}</View>
              </View>
              <View className='address-detail'>
                {get(this.state.address_info,'province_name')}
                {get(this.state.address_info,'city_name')}
                {get(this.state.address_info,'district_name')}
                {get(this.state.address_info,'detail')}
              </View>
            </View>
          </View>
          <View className='goods-wrap'>
            {get(this.state.order_info,'order_detail',[]).map(item => (
              <View key={item.id}>
                <ListGood 
                  key={this.state.goods_info}
                  goodId={get(item,'goods_id','')} 
                  speId={get(item,'goods_specification_id','')} 
                  price={get(item,'goods_amount','')} 
                  quality={get(item,'purchase_qty','')} 
                  message={get(item,'message','')}
                  goodsInfo={this.state.goods_info}
                  status={get(this.state.order_info,'order_status')}
                  detailID={get(item,'id')}
                  oId={this.state.order_id}
                  ooId={this.state.test_order_id}
                  IsRefund
                /> 
              </View>
            ))}
            <View className='total-fee-wrap'>
              <View className='list'>
                <View className='all-fee'>总价：</View>
                <View className='money'>¥{Number(get(this.state.order_info,'child_goods_amount') / 100).toFixed(2)}</View>
              </View>
              <View className='list'>
                <View className='dil-fee'>运费：</View> 
                <View className='money'>¥{Number(get(this.state.order_info,'child_exp_fare') / 100).toFixed(2)}</View>
              </View>
              {get(this.state.order_info,'sale','') ? 
                <View className='list'>
                  <View className='all-coupon'> 优惠：</View>
                  <View className='money'> -¥{Number(get(this.state.order_info,'child_total_coupon')/ 100).toFixed(2)*0.01}</View>
                </View>
              :''}
              { get(this.state.order_info,'order_status','') == 6 || get(this.state.order_info,'order_status','') == 1 ?
                <View className='list'>
                  <View className='pay-fee'> 应付款：</View>
                  <View className='pay-money'> ¥{Number(get(this.state.order_info,'child_order_amount') / 100).toFixed(2)}</View>
                </View>
              :
                <View className='list'>
                  <View className='pay-fee'> 实付款：</View>
                  <View className='pay-money'> ¥{Number(get(this.state.order_info,'child_order_amount') / 100).toFixed(2)}</View>
                </View>
              }
           
            </View>
          </View>
          <View className='order-detail'>

            <View className='info-wrap'>
              <View className='list'>
                <View className='name'>订单编号：</View>
                <View className='info'>{get(this.state.order_info,'order_num','')}</View>
              </View>
              <View className='list'>
                <View className='name'>发货方式：</View>
                {get(this.state.order_info,'delivery','') == 1 ?
                  <View className='info'>快递 </View>
                :''}
                {get(this.state.order_info,'delivery','') == 2 ?
                  <View className='info'>同城配送 </View>
                :''}
                {get(this.state.order_info,'delivery','') == 4 ?
                  <View className='info'>自提 </View>
                :''}
              </View>
              <View className='list'>
                <View className='name'>下单时间：</View>
                <View className='info'>{formatTime(get(this.state.order_info,'create_time',''),'Y/M/D h:m:s') }</View>
              </View>
              <View className='list'>
                <View className='name'>更新时间：</View>
                <View className='info'>{formatTime(get(this.state.order_info,'update_time',''),'Y/M/D h:m:s') }</View>
              </View>
              {get(this.state.order_info,'delivery_time','') ? 
                <View className='list'>
                  <View className='name'>发货时间：</View>
                  <View className='info'>{formatTime(get(this.state.order_info,'delivery_time',''),'Y/M/D h:m:s') }</View>
                </View>
              :''
              }
              {get(this.state.order_info,'get_time','') ? 
                <View className='list'>
                  <View className='name'>收货时间：</View>
                  <View className='info'>{formatTime(get(this.state.order_info,'get_time',''),'Y/M/D h:m:s') }</View>
                </View>
              :''
              }
            </View>  
          </View>
        </View>
        </View>
    )
  }
}

export default OrderDetail;