import React, { Component } from 'react';
import { View, Text, Checkbox, Image, Input, Navigator, MovableArea, MovableView } from '@tarojs/components';
import Navbar from '@components/navbar/navbar'
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'

import './index.scss'

@connect(({ goods, cart, order }) => ({
  ...goods, ...cart, ...order
}))
class CartListView extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      userId: Taro.getStorageSync('userId'),
      statusBarHeight: Taro.getStorageSync('statusBarHeight'),
      capsule: Taro.getStorageSync('capsule'),
      cartList: [], // 购物车数据
      goodsList: [], //购物车商品物品数据
      isOpen: false, // 是否打开选择框
      currGoods: {}, // 当前选择的商品
      temp_spec_index: 0,
      temp_count: 1,
      allCheck: false,
      checkList: [], // 选中的商品列表
      total_count: 0, // 购物车中选中的数量
      xArr: []
    }
  }

  componentDidShow() {
    this.init()
  }

  /* 初始化 */
  init() {
    this.getData();
  }

  /* 获取购物车列表和商品列表，并且获取价格信息 */
  getData = async () => {
    await this.props.dispatch({
      type: 'cart/getCartAndGoodsList'
    })
    const { cartList } = this.props

    this.getCheckList(cartList);

    // 购物车移动距离
    let xArr = new Array(cartList.length).fill(0)
    // 全选
    const allCheck = cartList.every(cart => cart.is_check === true) ? true : false
    this.setData({
      xArr,
      allCheck
    })
  }

  /* 获取当前购物车的价格信息和购物车数量 */
  getPrice = async (checkList) => {
    if (checkList == undefined) {
      checkList = this.state.checkList
    }

    let goods_list = checkList.map(item => {
      return {
        goods_id: item.goods_id,
        goods_specification: item.goods_specification_id,
        goods_total: item.goods_count,
        delivery: item.delivery_kind
      }
    })

    // 获取价格信息
    await this.props.dispatch({
      type: 'order/getPrice',
      payload: { goods_list }
    })
    const { total_coupon, total_goods_amount } = this.props.res_price

    /* 获取购物车数量 */
    this.getCount()

    this.setData({
      total_coupon,
      total_goods_amount
    })
  }

  /* 获取当前购物车的数量 */
  getCount = () => {
    const { checkList } = this.state
    let total_count = checkList.reduce((prev, curr) => prev + curr.goods_count, 0)
    this.setData({ total_count })
    Taro.setStorageSync('total_count', total_count)
    return total_count
  }

  // 获取当前操作的购物车商品
  getCurrCart = (cart_id) => {
    const { cartList } = this.props;
    return cartList.find(cart => cart.id == cart_id);
  }

  // 获取当前操作的商品
  getcurrGoods(currCart) {
    const { goodsList } = this.props;
    const { goods_id } = currCart;
    return goodsList.find(item => item.id === goods_id);
  }

  // 获取当前商品规格的序号
  getSpecIndex = (spec_id, currGoods) => {
    return currGoods.specification.findIndex(item => item.id === spec_id)
  }

  // 删除购物车
  async delCart(cart_id) {
    this.props.dispatch({
      type: 'cart/delCart',
      payload: {
        ids: [cart_id]
      }
    })
    this.getData();
  }

  // 列表中 商品数量加减
  handleClickNum(cart_id, e) {
    const { num } = e.target.dataset;
    const currCart = this.getCurrCart(cart_id);
    const total = this.getTotal(cart_id);
    if (num === 1) {
      if (currCart.goods_count >= total) {
        Taro.showToast({
          title: `当前商品剩余库存：${total}件`,
          icon: 'none'
        })
        return;
      }
      else currCart.goods_count++;
    } else if (num === -1) {
      if (currCart.goods_count <= 1) {
        Taro.showToast({
          title: '商品不能再减少啦！',
          icon: 'none'
        })
        return;
      }
      else currCart.goods_count--;
    }
    this.setData({
      currCart
    })
    this.updateCart(currCart, false)
  }

  // 列表中 输入商品数量
  handleInputNum(cart_id, e) {
    const { value } = e.detail;
    const currCart = this.getCurrCart(cart_id);
    const total = this.getTotal(cart_id);
    if (value >= 1 && value <= total) {
      currCart.goods_count = Number(value)
    }
    this.setData({
      currCart
    })
    this.updateCart(currCart, false)
  }

  // 获取当前商品规格的余量
  getTotal(cart_id, spec_index) {
    const currCart = this.getCurrCart(cart_id);
    const currGoods = this.getcurrGoods(currCart);
    if (spec_index == undefined)
      spec_index = this.getSpecIndex(currCart.goods_specification_id, currGoods);
    return currGoods.specification[spec_index].total;
  }

  // 选择框中 选择商品规格
  chooseType(temp_spec_index) {
    const { currGoods } = this.state;
    let { temp_count } = this.state;
    const { total } = currGoods.specification[temp_spec_index]
    // 检查余量
    if (temp_count < 1 || temp_count > total) {
      temp_count = 1
    }
    this.setData({
      temp_spec_index,
      temp_count
    })
  }

  /* 选择框中 商品数量加减 */
  handleClickNumInFloat(e) {
    const { currCart, temp_spec_index } = this.state;
    let { temp_count } = this.state;
    const { num } = e.target.dataset;
    const total = this.getTotal(currCart.id, temp_spec_index);
    if (num === 1) {
      if (temp_count >= total) {
        Taro.showToast({
          title: `当前商品剩余库存：${total}件`,
          icon: 'none'
        })
        return;
      }
      else temp_count++;
    } else if (num === -1) {
      if (temp_count <= 1) {
        Taro.showToast({
          title: '商品不能再减少啦！',
          icon: 'none'
        })
        return;
      }
      else temp_count--;
    }
    this.setData({
      temp_count
    })
  }

  /* 选择框中 输入商品数量 */
  handleInputNumInFloat(e) {
    const { value } = e.detail;
    const { currCart, temp_spec_index } = this.state;
    let { temp_count } = this.state;
    const total = this.getTotal(currCart.id, temp_spec_index);
    if (value >= 1 && value <= total) {
      temp_count = Number(value)
    }
    this.setData({
      temp_count
    })
  }

  /* 选择框中 点击规格 */
  handleTapSpecification(cart_id) {
    const currCart = this.getCurrCart(cart_id);
    const currGoods = this.getcurrGoods(currCart);
    const spec_index = this.getSpecIndex(currCart.goods_specification_id, currGoods);
    this.setData({
      isOpen: true,
      currGoods,
      spec_index,
      temp_spec_index: spec_index,
      temp_count: currCart.goods_count,
      currCart
    })
  }

  /* 选择框中 确认 */
  confirm = () => {
    let { currCart, currGoods, temp_spec_index, temp_count } = this.state;
    const spec_id = currGoods.specification[temp_spec_index].id;
    currCart.goods_specification_id = spec_id;
    currCart.goods_count = temp_count;
    this.setData({
      currCart
    })
    this.updateCart(currCart)
    this.setData({
      isOpen: false
    })
  }

  /* 更新购物车 */
  updateCart = async (currCart, getData = true) => {
    if (currCart == undefined)
      currCart = this.state.currCart;

    try {
      // 更新购物车
      await this.props.dispatch({
        type: 'cart/updateCart',
        payload: {
          id: currCart.id,
          goods_count: currCart.goods_count,
          goods_id: currCart.goods_id,
          goods_specification_id: currCart.goods_specification_id,
        }
      })
      // 是否需要重新获取购物车和商品信息，否则只获取价格信息
      if (getData)
        this.getData();
      else {
        this.getPrice()
      }
    } catch (err) {
      Taro.showToast({
        title: `操作失败，请重新尝试（错误码：${err.statusCode}）`,
        icon: 'none'
      })
    }
  }

  // 全选按钮
  handleAllCheck = () => {
    let { cartList } = this.props
    let { allCheck } = this.state
    allCheck = !allCheck
    // 修改cartList
    cartList.forEach(cart => {
      cart.is_check = allCheck
    })
    // 修改缓存中的cartList
    let cartListStor = Taro.getStorageSync('cartListStor')
    cartListStor.forEach(cart => {
      cart.is_check = allCheck
    })
    Taro.setStorageSync('cartListStor', cartListStor)

    /* 获取选中的列表 */
    const checkList = this.getCheckList(cartList)

    this.setData({
      allCheck,
      checkList
    })
  }

  // 单选按钮
  handleCheck = (cart_id) => {
    let { cartList } = this.props
    // 修改cartList
    cartList.forEach(cart => {
      if (cart.id === cart_id) {
        cart.is_check = !(cart.is_check)
      }
    })
    let cartListStor = Taro.getStorageSync('cartListStor')
    // 改缓存中的cartList
    cartListStor.forEach(cart => {
      if (cart.id === cart_id) {
        cart.is_check = !(cart.is_check)
      }
    })
    Taro.setStorageSync('cartListStor', cartListStor)

    /* 判断是否为全选状态 */
    const allCheck = cartList.every(cart => cart.is_check === true) ? true : false
    /* 获取选中的列表 */
    const checkList = this.getCheckList(cartList)

    this.setData({
      allCheck,
      checkList,
    })
  }

  /* 获取选中的购物车列表并获取价格信息 */
  getCheckList = (cartList) => {
    if (cartList === undefined)
      cartList = this.props.cartList
    let checkList = cartList.filter(cart => cart.is_check === true)

    Taro.setStorageSync('checkList', checkList)
    this.setData({
      checkList
    })

    this.getPrice(checkList)

    return checkList
  }

  // 隐藏选择框
  hiddenFloat = () => {
    this.setState({
      isOpen: false
    })
  }

  // 自己封装的setState
  setData = (...params) => {
    this.setState(...params)
    // console.log(...params)
  }

  /* 结算 */
  checkOut() {
    const { checkList, total_count } = this.state;

    if (checkList.some(item => item.soldOut)) {
      Taro.showToast({
        title: '有商品已经售光噢，请重新选择',
        icon: 'none',
        duration: 2500
      })
      return;
    }

    if (checkList.length === 0) {
      Taro.showToast({
        title: '您还没选择商品哦',
        icon: 'none'
      })
      return;
    }
    Taro.setStorageSync('checkList', checkList)
    Taro.setStorageSync('total_count', total_count)
    Taro.navigateTo({
      url: '/pages/cart/confirm/index'
    })
  }

  touchMoveStartHandle = (e) => {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
    }
  }

  touchMoveEndHandle(index, e) {
    const { startX, startY, xArr } = this.state;
    const touchMoveEndX = e.changedTouches[0].clientX; // 滑动变化X坐标
    const touchMoveEndY = e.changedTouches[0].clientY; // 滑动变化Y坐标
    const angle = this.angle({
      X: startX,
      Y: startY
    }, {
      X: touchMoveEndX,
      Y: touchMoveEndY
    });
    // 滑动超过50度角 return，防止上下滑动触发
    if (Math.abs(angle) > 50) return;
    if (Math.abs(touchMoveEndX - startX) < 1) return;

    xArr.forEach((item, x_index) => {
      if (touchMoveEndX > startX) {
        // 右滑
        if (index == x_index) xArr[x_index] = 0;
      } else {
        // 左滑
        xArr[x_index] = -120
        if (index != x_index) xArr[x_index] = 0;
      }
    })
    this.setData({
      xArr
    })
  }

  /* 计算滑动角度
    start 起点坐标
    end 终点坐标
    Math.PI 表示一个圆的周长与直径的比例，约为 3.14159;PI就是圆周率π，PI是弧度制的π,也就是180°
  */
  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  }

  render() {
    // console.log('%c ........cart/index render.........', 'color:green');
    const { statusBarHeight, capsule, isOpen, currGoods, allCheck, temp_spec_index, temp_count, total_count, total_coupon, total_goods_amount, xArr } = this.state;
    const { cartList } = this.props
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='cart' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          title='购物车'
        >
        </Navbar>
        <View className='cart_list'>
          {cartList.length != 0 &&'goods' in cartList[0] ? cartList.map((cart, cart_index) => (
            <MovableArea key={cart.id}>
              <MovableView direction='horizontal' inertia outOfBounds x={xArr[cart_index]} onTouchStart={this.touchMoveStartHandle} onTouchEnd={this.touchMoveEndHandle.bind(this, cart_index)}>
                <View className={cart.soldOut ? 'cart_item sold_out' : 'cart_item'}>
                  <View className='checkBox'>
                    <Checkbox checked={cart.is_check} onClick={this.handleCheck.bind(this, cart.id)}></Checkbox>
                  </View>
                  <View className='info_wrap'>
                    <Navigator className='pic' url={'/pages/details/index?gid=' + cart.goods_id}>
                      <Image src={cart.goods.cover} />
                      {cart.soldOut
                        ? <View className='sold_out'><View className='text'>无货</View></View>
                        : ''
                      }
                    </Navigator>
                    <View className='info'>
                      <Navigator className='name' url={'/pages/details/index?gid=' + cart.goods_id}>
                        {cart.goods.name}
                      </Navigator>
                      <View className='select'>
                        <View className='main' onClick={this.handleTapSpecification.bind(this, cart.id)}>
                          {cart.goods.specification[cart.spec_index].specification_text}
                          <Image src='http://qiniu.daosuan.net/picture-1598883801000' />
                        </View>
                        <View className='flex'></View>
                      </View>
                      <View className='price_wrap'>
                        {/* <Text className='price'><Text className='sign'>￥</Text>{goodsList[cart_index].sale ? goodsList[cart_index].specification[cart.spec_index].reduced_price : goodsList[cart_index].specification[cart.spec_index].price}</Text> */}
                        <Text className='price'><Text className='sign'>￥</Text>{cart.price}</Text>
                        {cart.soldOut
                          ? ''
                          : <View className='num_wrap'>
                            <View className='btn' onClick={this.handleClickNum.bind(this, cart.id)} data-num={-1}>-</View>
                            <Input value={cart.goods_count} type='number' onBlur={this.handleInputNum.bind(this, cart.id)} />
                            <View className='btn' onClick={this.handleClickNum.bind(this, cart.id)} data-num={1}>+</View>
                          </View>
                        }
                      </View>
                    </View>
                  </View>
                </View>
              </MovableView>
              <View className='out_view'>
                <View className='del' onClick={this.delCart.bind(this, cart.id)}>删除</View>
              </View>
            </MovableArea>
          )) : ''}
        </View>
        {/* 选择模块 */}
        <View className={isOpen ? 'active float_wrap' : 'float_wrap'}>
          <View className='mask' onClick={this.hiddenFloat}></View>
          <View className={isOpen ? 'container active' : 'container'}>
            <View className='info_wrap'>
              <Image src={currGoods.cover} />
              <Text className='name'>{currGoods.name}</Text>
              <Text className='price'>
                <Text className='sign'>￥</Text>{currGoods.specification ? currGoods.specification[temp_spec_index].showPrice : 0}
              </Text>
            </View>
            <View className='select_wrap'>
              <View className='title'>{currGoods.template ? currGoods.template.join('、') : ''}：</View>
              <View className='options_list'>
                {currGoods.specification ? currGoods.specification.map((spec, index) => (
                  <View className={temp_spec_index == index ? 'option active' : 'option'} key={index} onClick={this.chooseType.bind(this, index)}>
                    {spec.specification_text}
                  </View>
                )) : ''}
              </View>
            </View>
            <View className='num_wrap'>
              <View className='left'>
                <View className='title'>购买数量：</View>
                <View className='total'>剩余{currGoods.specification ? currGoods.specification[temp_spec_index].total : 0}件</View>
              </View>
              <View className='right'>
                <View className='btn' onClick={this.handleClickNumInFloat.bind(this)} data-num={-1}>-</View>
                <Input value={temp_count} type='number' onBlur={this.handleInputNumInFloat.bind(this)} />
                <View className='btn' onClick={this.handleClickNumInFloat.bind(this)} data-num={1}>+</View>
              </View>
            </View>
            <View className='select_tool_bar'>
              <View className='confirm' onClick={this.confirm}>确认</View>
            </View>
          </View>
        </View>
        {/* 底部结算栏 */}
        <View className='checkout_bar'>
          <View className='allCheckBox' onClick={this.handleAllCheck}>
            <Checkbox checked={allCheck}>全选</Checkbox>
          </View>
          <View className='count'>
            <Text className='num'>总计：<Text>{total_count}</Text> 件
              {total_coupon != 0
                ? <Text className='discount'> 已优惠：￥{Number(total_coupon / 100).toFixed(2)}</Text>
                : ''
              }
            </Text>
            <Text className='price'>合计：<Text>￥{Number((total_goods_amount - total_coupon) / 100).toFixed(2)}</Text></Text>
          </View>
          <View className='btn' onClick={this.checkOut.bind(this)}>结 算</View>
        </View>
      </View>
    )
  }
}

export default CartListView;
