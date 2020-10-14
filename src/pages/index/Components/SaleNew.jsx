import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { View, Image, Text ,Input} from '@tarojs/components'
import PropTypes from 'prop-types';
import '../index.scss'
import request from '../../../utils/request'
import GoodsCard from './GoodsCard'

@connect(({ goods }) => ({
  ...goods
}))

//新品榜
class SaleNew extends Component {
  // static propTypes = {
  //   placeList: PropTypes.arrayOf({}).isRequired,
  // };
  static defaultProps = {
    kindList: [],
  };

  constructor () {
    super(...arguments);
    this.state={
      like: false,
      userId: Taro.getStorageSync('userId'),
      data: {}, // 接口返回来的数据
      showPrice: '', // 显示的价格
      isOpen: false, // 是否打开选择框
      showType: 0, // 选择框显示类型 0：都显示  1：加入购物车  2：立即购买
      currChoose: null, // 当前选则的规格
      currNum: 1, // 当前选择的数量 ,
      total: 0, // 商品余量
    }
  }

    
  componentDidMount(){
    this.props.dispatch({
      type: 'goods/getGoodsNewList',
      payload: {
        sale_tag:1,
      }
    });
  }
  
  onLikeTab = () => {
    let status = this.state.like;
    this.setState({
      like:!status,
    })
  }
  toDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/details/index?gid=${id}`,
    });
  }

  /* 设置发货方式
    只有一种发货方式时，返回其自身；
    多种发货方式时，默认第一种方式
  */
  setGetWay = () => {
    let {get_way} = this.state.data;
    switch (get_way) {
      case 1:case 2:case 4:
        return get_way;
      case 3:case 5:case 7:
        return 1;
      case 6:
        return 2;
    }
  }
  // 加入购物车
  async addCart() {
    const {currChoose,currNum,data,userId,total} = this.state;
    if(currChoose === null) {
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
            goods_specification_id: data.specification[currChoose].id,
            delivery_kind: this.setGetWay()
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
  // 商品数量加减
  handleClickNum = (e) => {
    const {total} = this.state;
    const {num} = e.target.dataset;
    let {currNum} = this.state;
    if(num == -1) {
      if(currNum == 1) return;
      else currNum--;
      this.setState({currNum})
    }
    if(num == 1) {
      if(currNum >= total) return;
      else currNum++;
      this.setState({currNum})
    }
  }
  
  // 输入商品数量
  handleInputNum = (e) => {
    const {total} = this.state;
    let {currNum} = this.state;
    const {value} = e.detail;
    if(value >= 1 && value <= total){
      currNum = Number(value)
    }
    this.setState({
      currNum
    })
  }
  // 获取显示的价格
    getShowPrice = () => {
      const {data} = this.state
      if(data.specification) {
        var min = 999999999999999;
        var max = 0;
        data.specification.forEach((item) => {
          if(item.price <= min) min = item.price.toFixed(2);
          if(item.price >= max) max = item.price.toFixed(2);
        })
        if(min == max) 
          this.setState({showPrice: min});
          else 
            this.setState({showPrice: `${min} - ${max}`})
      }
    }
    // 设置商品余量显示
    setTotal = (val) => {
      const {data} = this.state;
      if(val) {
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
    // 选择框选择规格
    chooseType = (spec_index) => {
      const {data} = this.state;
      let {currNum} = this.state;
      const showPrice = data.specification[spec_index].price
      this.setState({
        showPrice,
        currChoose: spec_index
      })
      console.log('currChoose',this.state.currChoose)
      const total = this.setTotal(data.specification[spec_index].total);
      // 检查余量
      if(currNum < 1 || currNum > total){
        this.setState({
          currNum: 1
        })
      }
    }
  
    showFloat = (type) => {
      console.log(type)
      const { goodsSaleNewList } = this.props;
      this.setState({
        isOpen: true,
        // showType: type,
        data: goodsSaleNewList.filter(item => item.id == type)[0],
      })
      const showPrice = this.state.data.specification[0].price
      this.setState({
        showPrice,
        currChoose: 0
      })
    }
    // 隐藏选择框
    hiddenFloat = () => {
      this.setState({isOpen:false})
    }
  
    // 立即购买
    buyNow = () => {
      const {currChoose} = this.state;
      console.log(currChoose)
    }

  render () {
    const { goodsSaleNewList } = this.props;
    const list = Array.from(goodsSaleNewList)
    const {isOpen,showType,showPrice,currChoose,currNum,total,data} = this.state;
  //  console.log(get(get(data[0],'specification','')[0],'price'))
    return (
      <View className='sale-new-wrap'>
        <View className='title-list'>
          <View className='name'>
            新品榜
          </View>
          <View className='icon'>
            <Image src='http://qiniu.daosuan.net/picture-1598883875000' style='width:140rpx;height:80rpx' />
          </View>
          <View className='more'>
            <View className='checkmore'>进入专题</View>
            <Image src='http://qiniu.daosuan.net/picture-1598883365000' style='width:50rpx;height:30rpx' />
          </View>
        </View>
        <View className='goods-items-wrap'>
          {/* <GoodsCard sale_tag={1} /> */}
          <View className='goods-card'>
        <View className='goods-items-wrap'>
          {list.map((item => (
            <View className='first-item' key={item.id}>
            <View className='cover' onclick={this.toDetail.bind(this,item.id)}>
              <Image src={'http://qiniu.daosuan.net/'+get(item,'cover','')} className='first-img' />
            </View>
            <View className='goods-name'>
              {get(item,'name','')}
            </View>
            <View className='info'>
              {get(item,'sale','') ? 
              <View className='count'>
                满减优惠
              </View>:  <View className='count-null'>
              </View>}
              <View className='price'>
                <View style='font-size:40rpx;font-weoght:900;color:red;float:left;'>¥</View>
                <View className='number'>
                  {get(item,'specification','').map(function(spe,index) {
                    const currentPrice = get(get(item,'specification','')[0],'price');
                    if( get(spe,'price') >= currentPrice){
                      currentPrice === get(spe,'price');
                    }
                    if(index == get(item,'specification',[]).length-1)
                      return <View key={item.id}>{currentPrice}</View>
                  })}
                </View>
              </View>
            </View>
              <View className='like' onClick={this.onLikeTab}>
              {/* <Image src={cart} className='like-img' /> */}
              <View className='join-cart' onClick={this.showFloat.bind(this,item.id)}> 加入购物车 </View>
            </View>
          </View>
          )))}        
        </View>

        <View className={isOpen?'active float_wrap':'float_wrap'}>
            <View className='mask' onClick={this.hiddenFloat}></View>
            <View className={isOpen?'container active':'container'}>
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
                  {data.specification ? data.specification.map((spec,spec_index) => (
                    <View className={currChoose == spec_index ? 'option active' : 'option'} key={spec_index} onClick={this.chooseType.bind(this,spec_index)}>
                      {data.template.map((temp, temp_index) => (
                        temp_index == 0 ? spec.specification[temp] : ' ' + spec.specification[temp]
                      ))}
                    </View>
                  )):''}
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
        
      </View>
        </View>
      </View>
    )
  }
}


export default SaleNew;

