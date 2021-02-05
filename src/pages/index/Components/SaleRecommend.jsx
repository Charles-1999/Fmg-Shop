import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { View, Image, Text ,Input} from '@tarojs/components'
import { AtTag } from 'taro-ui'
import '../index.scss'
import request from '../../../utils/request'
import GoodsCard from './GoodsCard'
import SelectFloat from '@components/SelectFloat/index'

@connect(({ goods }) => ({
  ...goods
}))

//新品榜
class SaleRecommend extends Component {
  constructor () {
    super(...arguments);
    this.state={
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

  render () {

    return (
      <View className='sale-new-wrap'>
        <View className='title-list'>
          <View className='name'>
            商品推荐
          </View>
          <View className='icon'>
            <Image src='http://qiniu.fmg.net.cn/picture-1598883875000' style='width:140rpx;height:80rpx' />
          </View>
          {/* <View className='more'>
            <View className='checkmore'>进入专题</View>
            <Image src='http://qiniu.fmg.net.cn/picture-1598883365000' style='width:50rpx;height:30rpx' />
          </View> */}
        </View>
        <View className='goods-items-wrap'>
          <GoodsCard sale_tag={1} />
        </View>
      </View>
    )
  }
}

export default SaleRecommend;

