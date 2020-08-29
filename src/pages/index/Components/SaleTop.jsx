import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types';
import '../index.scss'

import top from '../../../assets/icon/畅销.png'
import more from '../../../assets/icon/更多2.png'
import range from '../../../assets/icon/排名.png'

@connect(({ goods }) => ({
  ...goods
}))
class SaleTop extends Component {
  // static propTypes = {
  //   placeList: PropTypes.arrayOf({}).isRequired,
  // };
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
            <Image src={top} style='width:140rpx;height:70rpx' />
          </View>
          <View className='more'>
            <View className='checkmore'>进入专题</View>
            <Image src={more} style='width:50rpx;height:30rpx' />
          </View>
        </View>
        <View className='goodsList'>
          <View className='left-item'>
            <View className='number'>1</View>
            <Image src={range} style='width:110rpx;height:130rpx' className='range-1' />
            <Image src={'http://qiniu.daosuan.net/'+get(data[0],'cover','')} style='width:280rpx;height: 250rpx;border-radius: 15px;' className='first-img' />
          </View>
          <View className='mid-item'>
          <View className='number'>2</View>
            <Image src={range} style='width:80rpx;height:100rpx' className='range-2' />
            <Image src={'http://qiniu.daosuan.net/'+get(data[1],'cover','')} style='width:150rpx;height: 250rpx;border-radius: 15px;' className='first-img' />
          </View>
          <View className='right-item'>
            <View className='intro'>
              <View>凤鸣谷好物畅销排行</View>
              <View>  每24小时更新一次</View>
            </View>
            <View className='number'>3</View>
            <Image src={range} style='width:80rpx;height:100rpx' className='range-3' />
            <Image src={'http://qiniu.daosuan.net/'+get(data[2],'cover','')} style='width:150rpx;height: 150rpx;border-radius: 15px;' className='first-img' />
          </View>  
        </View>
      </View>
    )
  }
}


export default SaleTop;

