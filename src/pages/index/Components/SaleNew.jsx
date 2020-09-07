import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types';
import '../index.scss'
import GoodsCard from './GoodsCard'
import newGoods from '../../../assets/icon/新品.png'
import more from '../../../assets/icon/更多2.png'

@connect(({ goods }) => ({
  ...goods
}))
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

  render () {
    const { goodsSaleNewList } = this.props;
    const data = Array.from(goodsSaleNewList)
    console.log(444);
    console.log(data)
  //  console.log(get(get(data[0],'specification','')[0],'price'))
    return (
      <View className='sale-new-wrap'>
        <View className='title-list'>
          <View className='name'>
            新品榜
          </View>
          <View className='icon'>
            <Image src={newGoods} style='width:140rpx;height:80rpx' />
          </View>
          <View className='more'>
            <View className='checkmore'>进入专题</View>
            <Image src={more} style='width:50rpx;height:30rpx' />
          </View>
        </View>
        <View className='goods-items-wrap'>
          {/* <GoodsCard sale_tag={1} /> */}
          <View className='goods-card'>
        <View className='goods-items-wrap'>
          {data.map((item => (
            <View className='first-item' key={item.id}>
            <View className='cover' >
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
                {/* <View className='number'>{get(get(item,'specification','')[0],'price')}起</View> */}
                <View className='number'>
                  {get(item,'specification','').map(function(spe,index) {
                    const currentPrice = get(get(item,'specification','')[0],'price');
                    if( get(spe,'price') >= currentPrice){
                      currentPrice === get(spe,'price');
                    }
                    if(index == get(item,'specification',[]).length-1)
                      return <View>{currentPrice}</View>
                  })}
                </View>
              </View>
            </View>
              <View className='like' onClick={this.onLikeTab}>
              {/* <Image src={cart} className='like-img' /> */}
              <View className='join-cart'> 加入购物车 </View>
            </View>
          </View>
          )))}        
        </View>
      </View>
        </View>
      </View>
    )
  }
}


export default SaleNew;

