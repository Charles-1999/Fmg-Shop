import React, { Component, useCallback } from 'react'
import Taro, { Current } from '@tarojs/taro'
import { View, Text, Image, Navigator, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
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
      currAddress: Taro.getStorageSync('currAddress'),
      isOpen: false,
    }
  }

  UNSAFE_componentWillMount() {
    const goodsList = this.getGoodsList();
    this.getOrderPrice(goodsList);
    this.getTotalCount();
  }

  componentDidShow() {
    this.setData({
      currAddress: Taro.getStorageSync('currAddress')
    })
  }

  /* 获取商品列表 */
  getGoodsList = async () => {
    const { checkList } = this.state;
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
    switch (id) {
      case 1:
        way = '快递';
        break;
      case 2:
        way = '同城配送';
        break;
      case 4:
        way = '自取';
        break;
    }
    return way;
  }

  /* 
    获取配送方式列表
    @params: index 商品在list中的索引
  */
  getGetWayList(index) {
    const {goodsList,checkList} = this.state;
    const goodsGetWay = goodsList[index].get_way; // 商品可选的方式
    const get_way = checkList[index].delivery_kind; // 用户选择的方式
    let getWayList = [];
    switch (goodsGetWay) {
      case 1:
        // getWayList.push('快递');
        getWayList.push({id: 1, checked: true});
        break;
      case 2:
        // getWayList.push('同城配送');
        getWayList.push({id: 2, checked: true});
        break;
      case 3:
        // getWayList.push('快递','同城配送');
        getWayList.push({id: 1, checked: true},{id: 2, checked: false});
        break;
      case 4:
        // getWayList.push('自取');
        getWayList.push({id: 4, checked: true});
        break;
      case 5:
        // getWayList.push('快递','自取');
        getWayList.push({id: 1, checked: true},{id: 4, checked: false});
        break;
      case 6:
        // getWayList.push('同城配送','自取');
        getWayList.push({id: 2, checked: false},{id: 4, checked: false});
        break;
      case 7:
        // getWayList.push('快递','同城配送','自取');
        getWayList.push({id: 1, checked: true},{id: 2, checked: false},{id: 4, checked: false});
        break;
    }
    const indexInGetWayList = getWayList.findIndex(item => item.id === get_way);
    getWayList.forEach((item,index) => {
      item.checked = index === indexInGetWayList;
    })
    this.setData({
      getWayList,
      isOpen: true,
      currGoodsIndex: index
    })
  }

  /* 修改收货方式 */
  selectGetWay(index) {
    let {getWayList} = this.state;
    let get_way;
    getWayList.forEach((item,i) => {
      if(index === i) {
        get_way = item.id;
        if(item.checked) return;
        else {
          item.checked = true;
        }
      }else {
        item.checked = false;
      }
    })
    this.setData({
      getWayList,
      get_way
    });
  }

  /* 确认修改收货方式 */
  changeGetWay() {
    const {get_way,currGoodsIndex,checkList} = this.state;
    checkList[currGoodsIndex].delivery_kind = get_way;
    this.setData({
      checkList,
      isOpen: false
    });
    Taro.setStorageSync("checkList", checkList);
  }

  /* 获取商品总额（不包括运费） */
  getGoodsPrice = () => {
    const { checkList } = this.state;
    return checkList.reduce((prev, item) => prev + item.price, 0);
  }

  /* 获取订单总额（包括运费） */
  getOrderPrice = (result) => {
    const { checkList } = this.state;
    let order_price = 0;
    let goodsList;
    result.then(res => {
      goodsList = res;
      checkList.forEach((item, index) => {
        order_price += item.goods_count * item.price + goodsList[index].carriage;
      })
      this.setData({
        order_price
      })
    })
  }

  /* 获取总件数 */
  getTotalCount = () => {
    const { checkList } = this.state;
    const total_conut = checkList.reduce((prev, item) => prev + item.goods_count, 0);
    this.setData({
      total_conut
    })
  }

  /* 添加留言 */
  addMessage(index,e) {
    console.log(index,e);
    let {checkList} = this.state;
    checkList[index].message = e.detail.value;
    this.setData({ checkList });
  }

  /* 提交订单 */
  order = async () => {
    const { currAddress,checkList } = this.state;
    // const checkList = Taro.getStorageSync('checkList');
    let goods_list = [];
    checkList.forEach((item) => {
      let obj = {
        goods_id: item.goods_id,
        goods_specification: item.goods_specification_id,
        goods_total: item.goods_count,
        delivery: item.delivery_kind,
        message: item.message
      }
      goods_list.push(obj);
    });
    try {
      const res_order = await request('/_order', {
        body: {
          address_id: currAddress.id,
          goods_list
        },
        method: 'POST'
      })
      const { id } = res_order;
      this.pay(id);
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
  orderDeatil = async (order_id, OutTradeNo) => {
    const { checkList } = this.state;
    try {
      checkList.forEach(async (item) => {
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
        console.log('detail_id', detail_id);
      })
      this.pay(OutTradeNo, order_id);
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

  // 显示选择框
  showFloat = () => {
    this.setState({
      isOpen: true,
    })
  }

  // 隐藏选择框
  hiddenFloat = () => {
    this.setState({
      isOpen: false
    })
  }

  onShow = () => {
    console.log(this.data)
  }

  // 自己封装的setState
  setData = (...params) => {
    this.setState(...params)
    console.log(...params)
  }

  render() {
    console.log('%c ........render.........', 'color:green');
    const { statusBarHeight, capsule, checkList, order_price, total_conut, goodsList, currAddress, isOpen, getWayList } = this.state;
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
        <Navigator className='address_wrap' url='/pages/cart/address_list/index'>
          <Image className='icon_address' src='http://qiniu.daosuan.net/picture-1598883667000' />
          <View className='address_info' onClick={this.toAddress}>
            <View className='personal_info'>
              <Text className='name'>{currAddress.name}</Text>
              <Text className='phone'>{currAddress.phone}</Text>
            </View>
            <Text className='address'>{currAddress.province_name}{currAddress.city_name}{currAddress.district_name}{currAddress.detail}</Text>
          </View>
          <Image className='icon_more' src='http://qiniu.daosuan.net/picture-1598883365000' />
        </Navigator>
        <View className='goods_list'>
          {checkList.map((item, index) => (
            <View className='goods' key={item.id}>
              <View className='goods_info'>
                <Image src={goodsList ? goodsList[index].cover : ''} />
                <View className='info_wrap'>
                  <View className='name'>{goodsList ? goodsList[index].name : ''}</View>
                  <View className='specification'>{goodsList ? (goodsList[index].template.map(temp => temp) + '：' + item.goods_specification) : ''}</View>
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
                  <Text className='content'>￥{goodsList ? goodsList[index].carriage.toFixed(2) : ''}</Text>
                </View>
                <View className='info_wrap' onClick={this.getGetWayList.bind(this,index)}>
                  <Text className='title'>配送方式</Text>
                  <Text className='content'>{checkList ? this.getGetWay(checkList[index].delivery_kind) : ''}</Text>
                  <Image className='icon_more' src='http://qiniu.daosuan.net/picture-1598883365000' />
                </View>
                <View className='info_wrap'>
                  <Text className='title'>订单备注</Text>
                  <Input type='text' className='content' placeholder='选填，请先和商家协商一致' placeholderStyle='color: #aaa' onBlur={this.addMessage.bind(this,index)} />
                </View>
                {/* 选择模块 */}
                <View className={isOpen ? 'active float_wrap' : 'float_wrap'}>
                  <View className='mask' onClick={this.hiddenFloat}></View>
                  <View className={isOpen ? 'container active' : 'container'}>
                    <View className='title'>配送方式</View>
                    {(getWayList??[]).map((item,index) => (
                      <View className='item' key={index} onClick={this.selectGetWay.bind(this,index)}>
                        <Text className='item_text'>{this.getGetWay(item.id)}</Text>
                        <CheckboxGroup className='checkBox'>
                          <Checkbox checked={item.checked}></Checkbox>
                        </CheckboxGroup>
                      </View>
                    ))}
                    <View className='btn_ok' onClick={this.changeGetWay.bind(this)}>完成</View>
                  </View>
                </View>
              </View>
              <View className='price_info'>
                <Text className='count'>共<Text className='text'> {item.goods_count} </Text>件，</Text>
                <Text className='price'>小计：<Text className='sign'>￥</Text><Text className='text'>{goodsList ? (item.goods_count * item.price + goodsList[index].carriage).toFixed(2) : ''}</Text></Text>
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