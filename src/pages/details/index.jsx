import React, { Component } from 'react';
import { View, Image, Text, Input } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import Navbar from '@components/navbar/navbar'
import request from '../../utils/request'

import MySwiper from './swiper'
import BaseInfo from './baseInfo'
import OthersInfo from './othersInfo'
import Select from './select'
import Comment from './comment'
import DetailInfo from './detailInfo'
import ToolBar from './toolBar'
import './index.scss'

import { get as getGlobalData } from '../../global_data'

class Details extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      userId: Taro.getStorageSync('userId'),
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
      data: {}, // 接口返回来的数据
      showPrice: '', // 显示的价格
      isOpen: false, // 是否打开选择框
      showType: 0, // 选择框显示类型 0：都显示  1：加入购物车  2：立即购买
      currChoose: null, // 当前选则的规格
      currNum: 1, // 当前选择的数量 ,
      total: 0, // 商品余量
    }
  }

  async UNSAFE_componentWillMount() {
    const { gid } = getCurrentInstance().router.params;
    console.log('gid', gid)
    const data = await request('/goods/_mget', {
      // body: { ids: [50] }, 
      body: { ids: [Number(gid)] },
      method: 'POST'
    })
    this.setState({
      data: data[0]
    }, () => {
      console.log(this.state.data)
    })
    this.setTotal();
    this.getShowPrice();
  }

  // 显示选择框
  showFloat = (type) => {
    this.setState({
      isOpen: true,
      showType: type
    })
  }

  // 隐藏选择框
  hiddenFloat = () => {
    this.setState({ isOpen: false })
  }

  // 获取显示的价格
  getShowPrice = () => {
    const { data } = this.state
    if (data.specification) {
      var min = 999999999999999;
      var max = 0;
      data.specification.forEach((item) => {
        if (item.price <= min) min = item.price.toFixed(2);
        if (item.price >= max) max = item.price.toFixed(2);
      })
      if (min == max)
        this.setState({ showPrice: min });
      else
        this.setState({ showPrice: `${min} - ${max}` })
    }
  }

  // 商品数量加减
  handleClickNum = (e) => {
    const { total } = this.state;
    const { num } = e.target.dataset;
    let { currNum } = this.state;
    if (num == -1) {
      if (currNum == 1) return;
      else currNum--;
      this.setState({ currNum })
    }
    if (num == 1) {
      if (currNum >= total) return;
      else currNum++;
      this.setState({ currNum })
    }
  }

  // 输入商品数量
  handleInputNum = (e) => {
    const { total } = this.state;
    let { currNum } = this.state;
    const { value } = e.detail;
    if (value >= 1 && value <= total) {
      currNum = Number(value)
    }
    this.setState({
      currNum
    })
  }

  // 选择框选择规格
  chooseType = (spec_index) => {
    const { data } = this.state;
    let { currNum } = this.state;
    const showPrice = data.specification[spec_index].price
    this.setState({
      showPrice,
      currChoose: spec_index
    })
    console.log('currChoose', this.state.currChoose)
    const total = this.setTotal(data.specification[spec_index].total);
    // 检查余量
    if (currNum < 1 || currNum > total) {
      this.setState({
        currNum: 1
      })
    }
  }

  // 设置商品余量显示
  setTotal = (val) => {
    const { data } = this.state;
    if (val) {
      this.setState({
        total: val
      })
      return val;
    }
    else {
      this.setState({
        total: data.total
      })
      return data.total;
    }
  }

  // 加入购物车
  async addCart() {
    const { currChoose, currNum, total, data, userId } = this.state;
    if (currChoose === null) {
      Taro.showToast({
        title: `请选择规格'${data.template.join('、')}'`,
        icon: 'none',
        duration: 2000
      })
    }
    if (typeof currChoose == 'number') {
      if(currNum > total) {
        Taro.showToast({
          title: `余量不足，请重试尝试！`,
          icon: 'none',
          duration: 2000
        })
        return;
      }
      let goods_specification = '';
      data.template.forEach((item, index) => {
        if (index == 0) {
          goods_specification += data.specification[currChoose].specification[item]
        } else {
          goods_specification += ' ' + data.specification[currChoose].specification[item]
        }
      })
      try {
        const res = await request(`/car/info/${userId}/${data.id}`, {
          method: 'POST',
          body: {
            goods_count: currNum,
            goods_specification: goods_specification,
            goods_name: data.name,
            goods_price: data.specification[currChoose].price,
            goods_pictures: data.specification[currChoose].picture,
            goods_specification_id: data.specification[currChoose].id
          }
        });
        console.log('addCart_res', res)
        Taro.showToast({
          title: '加入购物车成功',
          icon: 'success'
        })
        this.hiddenFloat();
      } catch (error) {
        console.log('addCart_error', error)
        console.error(error.data.message);
        Taro.showToast({
          title: '加入购物车失败',
          icon: 'none'
        })
      }
    }
    else return;
  }

  // 立即购买
  buyNow = () => {
    const { currChoose } = this.state;
    console.log(currChoose)
  }

  render() {
    console.log('%c ........render.........', 'color:green');
    const { statusBarHeight, capsule, data, isOpen, showPrice, currNum, showType, currChoose, total } = this.state;
    // console.log('data', data)
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='detail-page' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showBack
          showTitle
          title='商品详情'
        >
        </Navbar>
        <MySwiper pictures={data.pictures} />
        <BaseInfo details={data} showPrice={showPrice} />
        <OthersInfo info={data} />
        <Select data={data.specification} callback={this.showFloat} template={data.template} />
        <Comment />
        <DetailInfo data={data.detail} />
        <View className={isOpen ? 'active float_wrap' : 'float_wrap'}>
          <View className='mask' onClick={this.hiddenFloat}></View>
          <View className={isOpen ? 'container active' : 'container'}>
            <View className='info_wrap'>
              <Image src={data.cover ? (typeof currChoose == 'number' ? 'http://qiniu.daosuan.net/' + data.specification[currChoose].picture : 'http://qiniu.daosuan.net/' + data.cover) : ''} />
              <Text className='name'>{data.name}</Text>
              <Text className='price'>
                <Text className='sign'>￥</Text>{showPrice}
              </Text>
            </View>
            <View className='select_wrap'>
              <View className='title'>{data.template ? data.template.join('、') : ''}：</View>
              <View className='options_list'>
                {data.specification ? data.specification.map((spec, spec_index) => (
                  <View className={currChoose == spec_index ? 'option active' : 'option'} key={spec_index} onClick={this.chooseType.bind(this, spec_index)}>
                    {data.template.map((temp, temp_index) => (
                      temp_index == 0 ? spec.specification[temp] : ' ' + spec.specification[temp]
                    ))}
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
                <View className='btn' onClick={this.handleClickNum} data-num={-1}>-</View>
                <Input value={currNum} type='number' onBlur={this.handleInputNum} />
                <View className='btn' onClick={this.handleClickNum} data-num={1}>+</View>
              </View>
            </View>
            {showType == 0 ?
              <View className='select_tool_bar'>
                <View className='cart' onClick={this.addCart.bind(this)}>加入购物车</View>
                <View className='buy' onClick={this.buyNow}>立即购买</View>
              </View>
              : ''
            }
            {showType == 1 ?
              <View className='select_tool_bar'>
                <View className='cart' onClick={this.addCart.bind(this)}>加入购物车</View>
              </View>
              : ''
            }
            {showType == 2 ?
              <View className='select_tool_bar'>
                <View className='buy' onClick={this.buyNow}>立即购买</View>
              </View>
              : ''
            }
          </View>
        </View>
        <ToolBar callback={this.showFloat} />
      </View>
    )
  }
}

export default Details;