import React, { Component, useCallback } from 'react'
import Taro, { Current } from '@tarojs/taro'
import { View, Text, Image, Navigator, Checkbox, CheckboxGroup, Input } from '@tarojs/components'
import Navbar from '@components/navbar/navbar'
import { get as getGlobalData } from '../../../global_data'
import request, {getGoodsList} from '../../../utils/request'

import './index.less'
import { connect } from 'react-redux'

@connect(({ address, cart }) => ({
  ...address, ...cart
}))
export default class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
      checkList: Taro.getStorageSync('checkList'),
      total_count: Taro.getStorageSync("total_count"), // 订单总件数
      goodsList: null,
      currAddress: Taro.getStorageSync('currAddress'),
      isOpen: false,
    }
  }

  UNSAFE_componentWillMount() {
    this.getGoodsList()
    this.getPrice()
  }

  componentDidShow() {
    this.getCurrAddress()
  }

  /* 获取当前选择的地址 */
  getCurrAddress() {
    this.setData({
      currAddress: Taro.getStorageSync('currAddress')
    })
  }

  /* 获取价格信息 */
  getPrice = async() => {
    const {checkList} = this.state
    let goodsList = []
    checkList.forEach(item => {
      goodsList.push({
        goods_id: item.goods_id,
        goods_specification: item.goods_specification_id,
        goods_total: item.goods_count,
        delivery: item.delivery_kind
      })
    })
    const res = await request('/_order/get_price', {
      body: {
        goods_list: goodsList
      },
      method: 'POST'
    })

    const {total_coupon, total_exp_fare, total_goods_amount, total_order_amount} = res

    this.setData({
      total_coupon, total_exp_fare, total_goods_amount, total_order_amount
    })
  }

  /* 获取商品列表 */
  getGoodsList = async () => {
    const { checkList } = this.state;
    let goodsId = [];
    checkList.forEach(item => {
      goodsId.push(item.goods_id);
    })
    const goodsList = await getGoodsList(goodsId)
    this.setData({
      goodsList,
      goodsId
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
    * 获取配送方式列表
    * @params: index 商品在list中的索引
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
    this.getPrice()
    Taro.setStorageSync("checkList", checkList);
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
    if(!currAddress) {
      Taro.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return
    }

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
    })

    try {
      const res_order = await request('/_order', {
        body: {
          address_id: currAddress.id,
          goods_list
        },
        method: 'POST'
      })
      const { id } = res_order;
      this.delCart()
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

  /* 统一下单 */
  pay = async (order_id) => {
    const sysInfo = Taro.getStorageSync('sysInfo');
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
      this.requestPayment(res_pay.request, order_id);
    }
    catch (err) {
      console.log(err)
    }
  }

  /* 发起微信支付 */
  requestPayment = async (data, order_id) => {
    Taro.requestPayment({
      timeStamp: data.timeStamp, // 时间戳
      nonceStr: data.nonceStr, // 随机字符串
      package: data.package, // 统一下单接口返回的 prepay_id
      signType: data.signType, // 签名算法
      paySign: data.paySign, // 签名
      success: res => {
        console.log('发起微信支付：' , res);
        Taro.showToast({
          title: '支付成功',
          icon: 'success',
        })
      },
      fail: err => {
        console.log(err)
        Taro.showToast({
          title: '发起微信支付失败，请重新尝试！',
          icon: 'none'
        })
      },
      complete: () => {
        setTimeout(() => {
          Taro.switchTab({
            url: '/pages/cart/index',
            complete: () => {
              Taro.navigateTo({
                url: '/pages/user/Order/myOrder?status=0'
              })
            }
          })
        }, 2000)
      }
    })
  }

  // 删除购物车
  delCart = async() => {
    const {checkList} = this.state
    // 如果checkList中没有id（购物车id），则是立即购买渠道，无需删除购物车
    if (!('id' in checkList[0])) return
    let cartIds = []
    checkList.forEach(item => {
      cartIds.push(item.id)
    })
    const res = await request(`/car/info/delete`, {
      body: {
        ids: cartIds
      },
      method: 'DELETE'
    })
    console.log('delete', res)
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
    const { statusBarHeight, capsule, checkList, total_count, goodsList, currAddress, isOpen, getWayList, total_coupon, total_exp_fare, total_goods_amount, total_order_amount } = this.state;
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
          { currAddress
            ? <View className='address_info' onClick={this.toAddress}>
                <View className='personal_info'>
                  <Text className='name'>{currAddress.name}</Text>
                  <Text className='phone'>{currAddress.phone}</Text>
                </View>
                <Text className='address'>{currAddress.province_name}{currAddress.city_name}{currAddress.district_name}{currAddress.detail}</Text>
              </View>
            : <View className='no'>
                请选择收货地址
              </View>
          }
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
                  <Text className='price'><Text className='sign'>￥</Text>{goodsList?goodsList[index].specification[item.spec_index].showPrice:0}</Text>
                  <Text className='count'>×{item.goods_count}</Text>
                </View>
              </View>
              <View className='other_info'>
                <View className='info_wrap'>
                  <Text className='title'>保障</Text>
                  <Text className='content'>假一赔十·极速退款·七天无理由退换</Text>
                </View>
                {/* <View className='info_wrap'>
                  <Text className='title'>运费</Text>
                  <Text className='content'>￥{goodsList ? goodsList[index].carriage : ''}</Text>
                </View> */}
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
                <Text className='price'>小计：<Text className='sign'>￥</Text><Text className='text'>{goodsList ? (Number(item.goods_count * goodsList[index].specification[item.spec_index].showPrice)).toFixed(2) : ''}</Text></Text>
              </View>
            </View>
          ))}
          <View className='order_info'>
            <View className='info_wrap'>
              <Text className='title'>商品总额</Text>
              <Text className='content'>￥{Number(total_goods_amount/100).toFixed(2)}</Text>
            </View>
            <View className='info_wrap'>
              <Text className='title'>运费</Text>
              <Text className='content price'>￥{Number(total_exp_fare/100).toFixed(2)}</Text>
            </View>
            { total_coupon != 0 ?
              <View className='info_wrap'>
                <Text className='title'>促销优惠</Text>
                <Text className='content price'>-￥{Number(total_coupon/100).toFixed(2)}</Text>
              </View>
              : ''
            }
            <View className='order_count'>
              <Text>总计：<Text className='price'>￥{Number(total_order_amount/100).toFixed(2)}</Text></Text>
            </View>
          </View>
        </View>
        <View className={isIphoneX ? 'isIphoneX bottom_bar' : 'bottom_bar'}>
          <View className='price_wrap'>
            <Text className='count'>共<Text className='text'> {total_count} </Text>件，</Text>
            <Text className='price'>合计：<Text className='sign'>￥</Text><Text className='text'>{Number(total_order_amount/100).toFixed(2)}</Text></Text>
          </View>
          <View className='order' onClick={this.order}>提交订单</View>
        </View>
      </View>
    )
  }
}
