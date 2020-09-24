import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import '../myOrder.scss'
import { connect } from 'react-redux';
import Taro from '@tarojs/taro'; 
import request from '../../../utils/request'


@connect(({  goods }) => ({
  ...goods,
}))
class ListGood extends Component {
  static defaultProps = {
   
  };
  state = {
    goodInfo:{},
    speInfo:[],
    price:0,
    quality:0,
  }
  async componentDidMount () {
    const {goodId,speId,price,quality} = this.props;
    const data = await request('/goods/_mget',{ 
      body: { ids: [Number(goodId)] }, 
      method: 'POST' 
    })
    const specification_list = data[0].specification
    const spe= get(specification_list[0],'specification') //
    console.log(specification_list)
    console.log(spe)
    if(spe){
      this.setState({
        goodInfo: data[0],
        spe_info:spe,
        price:price,
        quality:quality,
      })
    }  
  }
  
  render () {
    console.log(this.state.goodInfo)
    console.log(get(this.state.goodInfo,'cover',''))
    console.log("======")
    return (
      <View className='list-good'>
        {this.state.goodInfo !== {} ? 
        <Image src={'http://qiniu.daosuan.net/'+get(this.state.goodInfo,'cover','')} style='width:160rpx;height:160rpx' />
        :''}
        <View className='title'>
          <View className='name'>{get(this.state.goodInfo,'name')}</View>
          <View className='spe'>
            {this.state.spe_info? Object.keys(this.state.spe_info).map(item =>(
              <View className='item' key={item}>
                {item}:{this.state.spe_info[item]} 
              </View>
            )):''}
            </View>
        </View>
        <View className='price-info'>
          <View class='one-price'>
            ¥ {this.state.price*0.01}
          </View>
          <View class='quantity'>
            x{this.state.quality}
          </View>
        </View>
        <View style='clear:both'></View>
      </View>
    )
  }
}

export default ListGood;