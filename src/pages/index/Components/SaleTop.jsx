import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types';
import '../index.scss'

@connect(({ goods }) => ({
  ...goods
}))

//畅销榜
class SaleTop extends Component {
  static defaultProps = {
    kindList: [],
  };

  constructor () {
    super(...arguments);
    this.state={

    }
  }

  componentDidMount(){
    this.props.dispatch({
      type: 'goods/getGoodsTopList',
      payload: {
        sale_tag: 3,
      },    
    });
  }

  //商品详情
  toDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/details/index?gid=${id}`,
    });
  }

  render () {
    const { goodsSaleTopList } = this.props;
    const data = Array.from(goodsSaleTopList)
    return (
      <View className='sale-top-wrap'>
        <View className='title-list-top'>
          <View className='name'>
            畅销榜
          </View>
          <View className='icon'>
            <Image src='http://qiniu.daosuan.net/picture-1598882342000' style='width:140rpx;height:70rpx' />
          </View>
          <View className='more'>
            <View className='checkmore'>进入专题</View>
            <Image src='http://qiniu.daosuan.net/picture-1598883365000' style='width:50rpx;height:30rpx' />
          </View>
        </View>
        <View className='goodsList'>
          <View className='left-item'>
            <View className='number'>1</View>
            <Image src='http://qiniu.daosuan.net/picture-1599455855000' style='width:110rpx;height:130rpx' className='range-1' />
            <Image 
              src={'http://qiniu.daosuan.net/'+get(data[0],'cover','')} 
              style='width:280rpx;height: 250rpx;border-radius: 15px;' 
              className='first-img'
              onClick={this.toDetail.bind(this,get(data[0],'id',''))} 
            />
          </View>
          <View className='mid-item'>
          <View className='number'>2</View>
            <Image src='http://qiniu.daosuan.net/picture-1599455855000' style='width:80rpx;height:100rpx' className='range-2' />
            <Image 
              src={'http://qiniu.daosuan.net/'+get(data[1],'cover','')} 
              style='width:150rpx;height: 250rpx;border-radius: 15px;' 
              className='first-img' 
              onClick={this.toDetail.bind(this,get(data[1],'id',''))} 
            />
          </View>
          <View className='right-item'>
            <View className='intro'>
              <View>凤鸣谷好物畅销排行</View>
              <View>  每24小时更新一次</View>
            </View>
            <View className='number'>3</View>
            <Image src='http://qiniu.daosuan.net/picture-1599455855000' style='width:80rpx;height:100rpx' className='range-3' />
            <Image 
              src={'http://qiniu.daosuan.net/'+get(data[2],'cover','')} 
              style='width:150rpx;height: 150rpx;border-radius: 15px;' 
              className='first-img' 
              onClick={this.toDetail.bind(this,get(data[3],'id',''))} 
            />
          </View>  
        </View>
      </View>
    )
  }
}


export default SaleTop;

