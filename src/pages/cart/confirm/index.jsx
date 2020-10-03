import React, { Component, useCallback } from 'react'
import Taro, {Current} from '@tarojs/taro'
import { get } from 'lodash'
import { View,Text,Image,Navigator } from '@tarojs/components'
import Navbar from '@components/navbar/navbar'
import { get as getGlobalData } from '../../../global_data'
import request from '../../../utils/request'

import './index.less'


export default class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
      checkList: Taro.getStorageSync('checkList'),
      order_price: 0, // 订单总额（包括运费）
      total_conut: 0, // 总件数
      goodsList: null,
      name: '',
      phone: '',
      address: '',
      address_id: 0,
    }
  }



  UNSAFE_componentWillMount() {
    const goodsList = this.getGoodsList();
    this.getOrderPrice(goodsList);
    this.getTotalCount();
    this.getAddressInfo();
  }


  /* 获取商品列表 */
  getGoodsList = async() => {
    const {checkList} = this.state; 
    let goodsId = [];
    checkList.forEach(item => {
      goodsId.push(item.goods_id);
    })
    return await request('/goods/_mget', {
      body: {
        ids: goodsId
      },
      method: 'POST'
    }).then(res => {
      res.forEach(item => {
        item.cover = 'http://qiniu.daosuan.net/' + item.cover;
      })
      this.setData({
        goodsList: res
      })
      return res;
    })
  }

  /* 获取收货方式 */
  getGetWay = (id) => {
    let way = '';
    switch(id){
      case 1:
        way = '快递';
        break;
      case 2:
        way = '同城配送';
        break;
      case 3:
        way = '自取';
        break;
    }
    return way;
  }

  /* 获取商品总额（不包括运费） */
  getGoodsPrice = () => {
    const {checkList} = this.state;
    return checkList.reduce((prev,item) => prev + item.price, 0);
  }

  /* 获取订单总额（包括运费） */
  getOrderPrice = (result) => {
    const {checkList} = this.state;
    let order_price = 0;
    let goodsList;
    result.then(res => {
      goodsList = res;
      checkList.forEach((item,index) => {
        order_price += item.goods_count * item.price + goodsList[index].carriage;
      })
      this.setData({
        order_price
      })
    })
  }

  /* 获取地址 */
  getAddressInfo = async() => {
    const userId = Taro.getStorageSync('userId'); //获取当前用户信息
    const res_address = await request(`/address/info/${userId}`, {
      body: {},
      method: 'GET'
    })
    if(Current.router.params.id){
      this.setState({
        address_id: Current.router.params.id
      })
    }
    else{
      this.setState({
        address_id: get(res_address[0],'id'),
      })
    }
    console.log(res_address)
    const current_id = res_address.filter(item => item.id == this.state.address_id)[0];
    this.setState({
      name: get(current_id,'name',''),
      phone: get(current_id,'phone',''),
      address: get(current_id,'province_name','')+get(current_id,'city_name','')+get(current_id,'district_name','')+get(current_id,'detail','')
    })
  }

  /* 获取总件数 */
  getTotalCount = () => {
    const {checkList} = this.state;
    const total_conut = checkList.reduce((prev,item) => prev + item.goods_count, 0);
    this.setData({
      total_conut
    })
  }

  /* 提交订单 */
  order = async() => {
    const {total_conut,order_price} = this.state;
    const goods_price = this.getGoodsPrice();
    const uid = Taro.getStorageSync('userId');
    try {
      const res_order = await request('/order', {
        body: {
          goods_total: total_conut, // 商品总数
          exp_fare: 1, // 运费
          coupon: 0, // 优惠
          goods_amount: goods_price*100, // 商品总额（不包括运费） 单位：分
          total_fee: order_price*100, // 订单总额（包括运费、优惠） 单位：分
          message: '无', // 留言
          account_id: uid, // uid
          address_id: 1, // 地址id
          delivery: 1, // 发货方式 1：快递 2：同城配送 3：自提
          order_status: 1, // 订单状态 1：提交订单/未付款 2：待发货 3：已发货/待收货 4：已收货/待评价 5：订单结束
        },
        method: 'POST'
      })
      const {id,OutTradeNo} = res_order;
      this.orderDeatil(id,OutTradeNo);
    }
    catch (err) {
      Taro.showToast({
        title: '提交订单失败，请重新尝试！',
        icon: 'none'
      })
      console.log(err)
    }
  }

  /* 创建订单详情 */
  orderDeatil = async(order_id,OutTradeNo) => {
    const {checkList} = this.state;
    try {
      checkList.forEach(async(item) => {
        const res_order_detail = await request('/order/detail', {
          body: {
            goods_id: item.goods_id, // 商品id
            goods_specification_id: item.goods_specification_id, // 商品规格id
            price: item.price, // 商品单价
            purchase_qty: item.goods_count, // 购买数量
            order_id: order_id // oid
          },
          method: 'POST'
        })
        const detail_id = res_order_detail.id;
        console.log('detail_id',detail_id);
      })
      this.pay(OutTradeNo,order_id);
    }
    catch (err) {
      Taro.showToast({
        title: '创建订单明细失败，请重新尝试！',
        icon: 'none'
      })
      console.log(err)
    }
  }

  /* 统一下单 */
  pay = async(OutTradeNo,order_id) => {
    const {order_price} = this.state;
    const sysInfo = Taro.getStorageSync('sysInfo');
    const open_id = Taro.getStorageSync('open_id');
    const userId = Taro.getStorageSync('userId');
    try {
      const res_pay = await request('/pay', {
        body: {
          body: '凤鸣谷-商城', // 
          detail: '测试', // 
          spbill_create_ip: '127.0.0.1', // 
          device_info: sysInfo.model, // 
          open_id: open_id, // 
          account_id: userId, // 
          total_fee: order_price*100, // 
          out_trade_no: OutTradeNo, // 
          order_id
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
  requestPayment = async(data) => {
      Taro.requestPayment({
        timeStamp: data.timeStamp, // 时间戳
        nonceStr: data.nonceStr, // 随机字符串
        package: data.package, // 统一下单接口返回的 prepay_id
        signType: data.signType, // 签名算法
        paySign: data.paySign, // 签名
        success: res => {
          console.log('发起微信支付：'+res);
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

  onShow= () =>{
    console.log(this.data)
  }

  // /* 跳转到地址选择页面 */
  // toAddress(){
  //   Taro.navigateTo({
  //     url: '/pages/user/Address/addressList',
  //   });
  // }

  // 自己封装的setState
  setData = (...params) => {
    this.setState(...params)
    console.log(...params)
  }

  render() {
    console.log('%c ........render.........','color:green');
    const { statusBarHeight, capsule, checkList, order_price, total_conut, goodsList } = this.state;
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;

   
    return (
      <View className='order_confirm' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='确认订单'
        >
        </Navbar>
        <Navigator className='address_wrap' url='/pages/user/Address/addressList'>
          <Image className='icon_address' src='http://qiniu.daosuan.net/picture-1598883667000' />
          <View className='address_info' onClick={this.toAddress}>
            <View className='personal_info'>
              <Text className='name'>{this.state.name}</Text>
              <Text className='phone'>{this.state.phone}</Text>
            </View>
            <Text className='address'>{this.state.address}</Text>
          </View>
          <Image className='icon_more' src='http://qiniu.daosuan.net/picture-1598883365000' />
        </Navigator>
        <View className='goods_list'>
          {checkList.map((item,index) => (
            <View className='goods' key={item.id}>
              <View className='goods_info'>
                <Image src={goodsList?goodsList[index].cover:''} />
                <View className='info_wrap'>
                  <View className='name'>{goodsList?goodsList[index].name:''}</View>
                  <View className='specification'>{goodsList?(goodsList[index].template.map(temp=>temp)+'：'+item.goods_specification):''}</View>
                </View>
                <View className='price_wrap'>
                  <Text className='price'><Text className='sign'>￥</Text>{item.price.toFixed(2)}</Text>
                  <Text className='count'>×{item.goods_count}</Text>
                </View>
              </View>
              <View className='other_info'>
                <View className='info_wrap'>
                  <Text className='title'>保障</Text>
                  <Text className='content'>假一赔十·极速退款·七天无理由退换</Text>
                </View>
                <View className='info_wrap'>
                  <Text className='title'>运费</Text>
                  <Text className='content'>￥{goodsList?goodsList[index].carriage.toFixed(2):''}</Text>
                </View>
                <View className='info_wrap'>
                  <Text className='title'>配送方式</Text>
                  <Text className='content'>{goodsList?this.getGetWay(goodsList[index].get_way):''}</Text>
                </View>
              </View>
              <View className='price_info'>
                <Text className='count'>共<Text className='text'> {item.goods_count} </Text>件，</Text>
                <Text className='price'>小计：<Text className='sign'>￥</Text><Text className='text'>{goodsList?(item.goods_count * item.price + goodsList[index].carriage).toFixed(2):''}</Text></Text>
              </View>
            </View>
          ))}
        </View>
        <View className={isIphoneX ? 'isIphoneX bottom_bar' : 'bottom_bar'}>
          <View className='price_wrap'>
            <Text className='count'>共<Text className='text'> {total_conut} </Text>件，</Text>
            <Text className='price'>合计：<Text className='sign'>￥</Text><Text className='text'>{order_price.toFixed(2)}</Text></Text>
          </View>
          <View className='order' onClick={this.order}>提交订单</View>
        </View>
      </View>
    )
  }
}