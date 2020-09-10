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
class GoodsCard extends Component {
  static defaultProps = {
    list: [],
    goodsList:[],
  };

  constructor () {
    super(...arguments);
    this.state={
      like: false,
    }
  }

  componentDidMount(){
    const {place_tag, kind_tag, sale_tag } = this.props;
    console.log(place_tag, kind_tag, sale_tag)
    this.props.dispatch({
      type: 'goods/getGoodsList',
      payload: {
        place_tag:place_tag,
        kind_tag:kind_tag,
        sale_tag:sale_tag,
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
    const { goodsList } = this.props;
    const data = Array.from(goodsList);
    console.log(777)
    console.log(data)

    return (
      <View className='goods-card'>
        <View className='goods-items-wrap'>
          {data.map((item => (
            <View className='first-item' key={item.id}>
            <View className='cover'>
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
              <View className='join-cart'> 加入购物车 </View>
            </View>
          </View>
          )))}        
        </View>
      </View>
    )
  }
}


export default GoodsCard;
