import React, { Component, useContext } from 'react';
import { View, Image, Text, Input } from '@tarojs/components';
import Taro, { getCurrentInstance } from '@tarojs/taro';
import { connect } from 'react-redux';
import Navbar from '@components/navbar/navbar'
import SelectFloat from '@components/SelectFloat/index'
import request, {getGoodsList} from '@utils/request'

import MySwiper from './swiper'
import BaseInfo from './baseInfo'
import OthersInfo from './othersInfo'
import Select from './select'
import Comment from './comment'
import DetailInfo from './detailInfo'
import ToolBar from './toolBar'
import './index.scss'

import { get as getGlobalData } from '../../global_data'


@connect(({ goods, comment, cart }) => ({
  ...goods, ...comment, ...cart
}))
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
    /* 获取路由中的gid */
    const { gid } = getCurrentInstance().router.params

    /* 获取commentList */
    await this.props.dispatch({
      type: 'comment/getGoodsComments',
      payload: gid
    });

    /* 获取goodsList */
    // let goodsList = await getGoodsList([Number(gid)])
    await this.props.dispatch({
      type: 'goods/mgetGoodsListEntity',
      payload: [Number(gid)]
    })

    /* 获取购物车 */
    this.props.dispatch({
      type: 'cart/getCart',
      payload: {}
    })

    this.setState({
      data: this.props.goodsList[0],
    })

    this.setTotal();
    this.getShowPrice();
    this.getUnSalePrice();
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
    const { data } = this.state;
    if (data.specification) {
      var min = 999999999999999;
      var max = 0;
      if(data.sale) {
        data.specification.forEach((item) => {
          if (item.price <= min) min = item.reduced_price;
          if (item.price >= max) max = item.reduced_price;
        })
      }else {
        data.specification.forEach((item) => {
          if (item.price <= min) min = item.price;
          if (item.price >= max) max = item.price;
        })
      }
      if (min == max)
        this.setState({ showPrice: min });
      else
        this.setState({ showPrice: `${min}-${max}` });
    }
  }

  // 获取未优惠的价格
  getUnSalePrice = () => {
    const { data } = this.state;
    if (data.specification) {
      var min = 999999999999999;
      var max = 0;
      data.specification.forEach((item) => {
        if (item.price <= min) min = item.price;
        if (item.price >= max) max = item.price;
      })
      if (min == max)
        this.setState({ unSalePrice: min });
      else
        this.setState({ unSalePrice: `${min}-${max}` });
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
    // let { currNum } = this.state;
    let showPrice;
    if(data.sale) {
      showPrice = data.specification[spec_index].reduced_price;
    }else {
      showPrice = data.specification[spec_index].price;
    }
    const unSalePrice = data.specification[spec_index].price;
    this.setState({
      showPrice,
      unSalePrice,
      // currChoose: spec_index
    })
    // const total = this.setTotal(data.specification[spec_index].total);
    // // 检查余量
    // if (currNum < 1 || currNum > total) {
    //   this.setState({
    //     currNum: 1
    //   })
    // }
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

  /* 加入购物车的回调 */
  addCallBack = () => {
    this.props.dispatch({
      type: 'cart/getCart',
      payload: {}
    })
  }

  render() {
    console.log('%c ........render.........', 'color:green');
    const { statusBarHeight, capsule, data, isOpen, showPrice, unSalePrice, currNum, showType, currChoose, total } = this.state;
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
        <BaseInfo details={data} showPrice={showPrice} unSalePrice={unSalePrice}/>
        <OthersInfo info={data} />
        <Select data={data.specification} callback={this.showFloat} template={data.template} />
        <Comment />
        <DetailInfo data={data.detail} />
        {/* 选择浮窗 */}
        <SelectFloat
          currGoods={data}
          isOpen={isOpen}
          showType={showType}
          hiddenFloat={this.hiddenFloat}
          chooseType={this.chooseType}
          addCallBack={this.addCallBack} />
        <ToolBar callback={this.showFloat} />
      </View>
    )
  }
}

export default Details;
