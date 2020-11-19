import Taro from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, Input} from '@tarojs/components'
import { connect } from 'react-redux'
import './index.less'

/**
 * 公共组件-SelectFloat
 * @param {Object}    currGoods   当前的商品（必填）
 * @param {Boolean}   isOpen      是否打开当前的浮窗（必填）
 * @param {Function}  hiddenFloat 关闭当前浮窗的回调（必填）
 * @param {Number}    showType    显示类型： 0、加入购物车+立即购买 1、加入购物车 2、立即购买
 * @param {Function}  chooseType  选择规格的回调
 * @param {Function}  addCallBack 加入购物车的回调
 */
function SelectFloat(props) {
  const [currGoods, setCurrGoods] = useState(props.currGoods)
  const [isOpen, setIsOpen] = useState(false)
  const [showType, setShowType] = useState(0)
  const [currChoose, setCurrChoose] = useState(null)
  const [currCount, setCurrCount] = useState(1)
  const [total, setTotal] = useState()

  useEffect(() => {
    setCurrChoose(null)
  }, [props.currGoods])

  useEffect(() => {
    setIsOpen(props.isOpen)
    setCurrGoods(props.currGoods)
    setShowType(props.showType)
  })

  useEffect(() => {
    setTotal(props.currGoods.total)
  }, [currGoods])

  /* 隐藏 */
  function hiddenFloat() {
    props.hiddenFloat()
  }

  /**
   * 选择规格
   * @param {Number} spec_index 规格的索引
  */
  function chooseType(spec_index) {
    const {reduced_price, price} = currGoods.specification[spec_index]
    if(currGoods.sale) {
      currGoods.priceRange = reduced_price
    } else {
      currGoods.priceRange = price
    }
    currGoods.unSalePriceRange = price

    // 检查余量
    const goods_total = currGoods.specification[spec_index].total
    if (currCount < 1 || currCount > goods_total) setCurrCount(1)

    setCurrChoose(spec_index)
    setTotal(goods_total)

    // 选择规格的回调
    if(props.chooseType)
      props.chooseType(spec_index)
  }

  /* 设置发货方式
    只有一种发货方式时，返回其自身；
    多种发货方式时，默认第一种方式
  */
  function setGetWay() {
    let { get_way } = currGoods
    switch (get_way) {
      case 1:case 2:case 4:
        return get_way;
      case 3:case 5:case 7:
        return 1;
      case 6:
        return 2;
    }
  }

  /* 点击加减商品数量 */
  function handleClickNum(e) {
    const { num } = e.target.dataset
    /* 减少 */
    if (num == -1) {
      if (currCount == 1) return
      else setCurrCount(currCount - 1)
    }
    /* 增加 */
    if (num == 1) {
      if (currCount >= total) return
      else setCurrCount(currCount + 1)
    }
  }

  /* input框输入商品数量 */
  function handleInputNum(e) {
    const { value } = e.detail
    setCurrCount(Number(value))
    if (!(value >=1 && value <= total)) setCurrCount(1)
  }

  /* 加入购物车 */
  function addCart() {
    if (currChoose === null) {
      Taro.showToast({
        title: `请选择规格'${currGoods.template.join('、')}'`,
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (typeof currChoose == 'number') {
      if (currCount > total) {
        Taro.showToast({
          title: `余量不足，请重试尝试！`,
          icon: 'none',
          duration: 2000
        })
        return
      }
      props.dispatch({
        type: 'cart/createCart',
        payload: {
          currGoods,
          spec_index: currChoose,
          count: currCount,
          delivery_kind: setGetWay()
        }
      }).then(res => {
        Taro.showToast({
          title: '加入购物车成功',
          icon: 'success'
        })
        // 加入购物车后的回调
        if (props.addCallBack)
          props.addCallBack()
        hiddenFloat()
      }, err => {
        console.error('error', err.data.message)
        Taro.showToast({
          title: '加入购物车失败',
          icon: 'none'
        })
      })
    }
  }

  /* 立即购买 */
  function buyNow() {
    if (currChoose === null) {
      Taro.showToast({
        title: `请选择规格'${currGoods.template.join('、')}'`,
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (typeof currChoose == 'number') {
      let checkList = [{
        goods_id: currGoods.id,
        goods_specification_id: currGoods.specification[currChoose].id,
        goods_count: currCount,
        delivery_kind: setGetWay(),
        spec_index: currChoose
      }]
      Taro.setStorageSync('checkList', checkList)
      Taro.navigateTo({
        url: '/pages/cart/confirm/index'
      })
    }
  }

  return(
    <View className={isOpen ? 'active float_wrap' : 'float_wrap'}>
      {/* 遮罩层 */}
      <View className='mask' onClick={hiddenFloat}></View>
      {/* container层 */}
      <View className={isOpen ? 'container active' : 'container'}>
        <View className='info_wrap'>
          <Image src={currGoods.cover ? (typeof currChoose == 'number' ? currGoods.specification[currChoose].picture : currGoods.cover) : ''} />
          <Text className='name'>{currGoods.name}</Text>
          <Text className='price'>
            <Text className='sign'>￥</Text><Text className='text'>{currGoods.priceRange}</Text>
            {currGoods.sale
            ? <Text className='unSalePrice'><Text className='sign'>￥</Text>{currGoods.unSalePriceRange}</Text>
            : ''}
          </Text>
        </View>
        <View className='select_wrap'>
          <View className='title'>{currGoods.template ? currGoods.template.join('、') : ''}：</View>
          <View className='options_list'>
            {currGoods.specification ? currGoods.specification.map((spec, spec_index) => (
              <View className={currChoose == spec_index ? 'option active' : 'option'} key={spec_index} onClick={chooseType.bind(this, spec_index)}>
                {spec.specification_text}
              </View>
            )) : ''}
          </View>
        </View>
        <View className='num_wrap'>
          <View className='left'>
            <View className='title'>购买数量：</View>
            <View className='total'>剩余{total}件</View>
          </View>
          <View className='right'>
            <View className='btn' onClick={handleClickNum} data-num={-1}>-</View>
            {isOpen
              ? <Input value={currCount} type='number' onBlur={handleInputNum} />
              : ''
            }
            <View className='btn' onClick={handleClickNum} data-num={1}>+</View>
          </View>
        </View>
        {showType == 0 ?
          <View className='select_tool_bar'>
            <View className='cart' onClick={addCart.bind(this)}>加入购物车</View>
            <View className='buy' onClick={buyNow.bind(this)}>立即购买</View>
          </View>
          : ''
        }
        {showType == 1 ?
          <View className='select_tool_bar'>
            <View className='cart' onClick={addCart.bind(this)}>加入购物车</View>
          </View>
          : ''
        }
        {showType == 2 ?
          <View className='select_tool_bar'>
            <View className='buy' onClick={buyNow.bind(this)}>立即购买</View>
          </View>
          : ''
        }
      </View>
    </View>
  )
}

export default connect (({ cart, order }) => ({
  ...cart, ...order
}))(SelectFloat)
