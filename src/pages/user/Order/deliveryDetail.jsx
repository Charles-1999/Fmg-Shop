import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import request from '../../../utils/request'
import './deliveryDetail.scss'
import formatTime from '../../.../../../utils/time'

@connect(({ order }) => ({
  ...order,
}))
class deliveryDetail extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    currentOrder: Current.router.params.id,
    deliveryInfo: [],
    orderInfo:{},
    addressInfo:{},
    isGetMessage:true,
    deliveryNameList:[
      {code:'zhongtong',title:'中通'},
      {code:'yuantong',title:'圆通'},
      {code:'shentong',title:'申通'},
      {code:'yunda',title:'韵达'},
      {code:'tiantian',title:'天天'},
      {code:'huitongkuaidi',title:'百世（汇通）'},
      {code:'zhaijisong',title:'宅急送'},
      {code:'jexpress',title:'极兔'},
    ]
  }
  async componentDidMount(){
    this.getOrderInfo();
   // this.getDeliveryInfo();
  }
  /**获取快递信息 */
  async getDeliveryInfo(){
    console.log(get(this.state.orderInfo,'tracking_id',''))
    const info = await request('/delivery/info/post', {
      body: {
        "delivry_corp_name":"zhongtong",
        "delivry_sheet_code":get(this.state.orderInfo,'tracking_id','')   
      },
      method: 'POST'
    })
    this.setState({
      deliveryInfo:get(info,'info'),
    })
    console.log(this.state.deliveryInfo)
    if(this.state.deliveryInfo.status == ""){
      this.setState({
        isGetMessage:false
      })
    }
  }
  /**获取订单信息 */
  async getOrderInfo(){
    const orderInfoList = await request('/_order/_mget', {
      body: {
        ids:[parseInt(this.state.currentOrder)]
      },
      method: 'POST'
    })
    this.setState({
      orderInfo: orderInfoList[0],
    })
    console.log(this.state.orderInfo)
    this.getDeliveryInfo();
    this.getAddressInfo();
  }
  //获取地址信息
  async getAddressInfo(){
    const id = get(this.state.orderInfo,'address_id')
    const info = await request(`/address/info/get/${id}`, {
      method: 'GET'
    })
    this.setState({
      addressInfo: info 
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
          title='物流详情'
        ></Navbar>
        {this.state.isGetMessage?
        <view class='g_con'>
        {/* <view class='topExpress'>
          <view class='topExpress-left'>
            {/* <image src='/images/Exchange_goods_map_1.png' style='width:60rpx;height:60rpx;border-radius:50%;'></image> 
          </view>
          <view class='topExpress-right'>
            <view class='topExpress-right-top'>{get(this.state.deliveryNameList.filter(item => item.code == get(this.state.deliveryInfo,'com'))[0],'title')}</view>
            <view class='topExpress-right-middle'>运单号：{get(this.state.deliveryInfo,'nu')}</view>
            {/* <view class='topExpress-right-bottom'>官方电话 95554 ></view> 
          </view>
        </view> */}
        <view class='topExpress-info'>
          <view class='topExpress-name'>快递公司：{get(this.state.deliveryNameList.filter(item => item.code == get(this.state.deliveryInfo,'com'))[0],'title')}</view>
          <view class='topExpress-code'>运单号：{get(this.state.deliveryInfo,'nu')}</view>
          {/* <view class='topExpress-right-bottom'>官方电话 95554 ></view> */}
        </view>
        {/* <!-- 物流时间轴 --> */}
        <view class='expressRecord'>

          {/* <!-- 顶部收货地址 --> */}
          <view class='expressRecord-getAddress'>
            <view class='expressRecord-top'>
              <view class='getAddress-icon'>
                收
              </view>
              <view class='getAddress-text'>[收货地址] {get(this.state.addressInfo,'province_name')}
            {get(this.state.addressInfo,'city_name')}
            {get(this.state.addressInfo,'district_name')}
            {get(this.state.addressInfo,'detail')}</view>
            </view>
          </view>

          {/* <!-- 顶部收货地址半个时间轴线 --> */}
          <view class='noReach-online-top-close'></view>


          {/* <!-- 单个物流记录点时间轴：当前正在进行的物流状态 --> */}
         

          {/* <!-- 单个物流记录点时间轴：已经过去的物流状态 --> */}
          {get(this.state.deliveryInfo,'data',[]).map((item,index)=>(
            <View  key={index} >
              {index == 0 ? 
               <view class='expressRecord-single-close'>

               {/* <!-- 左边子容器 --> */}
               <view class='expressRecord-single-noReach-online-top-close'>
                 {/* <!-- 正在进行的时间轴上半个时间线 --> */}
                 <view class='online-top-closing'></view>
                 {/* <!-- 正在进行的时间轴点 --> */}
                 <view class='dot-closing'></view>
                 {/* <!-- 正在进行的时间轴下半个时间线 --> */}
                 <view class='online-bottom'></view>
               </view>
 
               {/* <!-- 右边子容器 --> */}
               <view class='expressRecord-text'>
                 <view class='expressRecord-statusing'></view>
                 <view class='expressRecord-status-addressing'>{get(item,'context')}</view>
               </view>
 
               {/* <!-- 相对父级容器绝对定位的日期 --> */}
               <view class='expressRecord-dating'>
                 <view class='expressRecord-date-text'>
                  {get(item,'ftime').substring(5,10)}
                 </view>
                 <view class='expressRecord-date-time'>
                  {get(item,'ftime').substring(10,16)}
                 </view>
               </view>
              </view>:
              <view class='expressRecord-single-close'>
              <view class='expressRecord-single-noReach-online-top-close'>
                <view class='online-top-close'></view>
                <view class='dot-close'></view>
                <view class='online-bottom'></view>
              </view>

              <view class='expressRecord-text'>
                <view class='expressRecord-status'></view>
                <view class='expressRecord-status-address'>{get(item,'context')}</view>
              </view>

              <view class='expressRecord-date'>
                <view class='expressRecord-date-text'>
                  {get(item,'ftime').substring(5,10)}
                </view>
                <view class='expressRecord-date-time'>
                  {get(item,'ftime').substring(10,16)}
                </view>
              </view>
            </view>
            }

            </View>
          ))}   

          <view class='expressRecord-single-close'>
            <view class='expressRecord-single-noReach-online-top-close'>
              <view class='online-top-close'></view>
              <view class='dot-close'></view>
              {/* <!-- 起始位置，下半个时间轴线不用 --> */}
              <view class='online-bottom-start'></view>
            </view>

            <view class='expressRecord-text'>
              <view class='expressRecord-status'>已发货</view>
              <view class='expressRecord-status-address'>卖家发货</view>
            </view>

            <view class='expressRecord-date'>
              <view class='expressRecord-date-text'>
                {formatTime(get(this.state.orderInfo,'delivery_time',''),'Y/M/D h:m:s').substring(5,10)}
              </view>
              <view class='expressRecord-date-time'>
                {formatTime(get(this.state.orderInfo,'delivery_time',''),'Y/M/D h:m:s').substring(10,16)}
              </view>
            </view>
          </view> 
          
            

        </view>
        </view>:
        <view className=''>查询不到物流信息</view>
        }

        
      </View>
    )
  }
}

export default deliveryDetail;