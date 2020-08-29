import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Image } from '@tarojs/components'
import { AtSearchBar, AtIcon } from 'taro-ui'
import PropTypes from 'prop-types';
import { get } from 'lodash';
import '../index.scss'
import more from '../../../assets/icon/更多2.png'

@connect(({ goods }) => ({
  ...goods
}))

class PlaceKindTab extends Component {
  constructor () {
    super(...arguments);
    this.state={
      currentId: 0,
    }
  }
 
  // handleTypeTab = (e,id) => {
  //   this.setState({
  //     currentId: e,
  //   })
  //   Taro.navigateTo({
  //     url: `/pages/index/placeGoodsList?id=${this.state.currentId}`,
  //   });
  // }
  render () {
    const { placeList, kindList} = this.props
    const placeListItem = Array.from(placeList)
    const kindListItem = Array.from(kindList)
 
    return (
      <View className='place-kind-list'>
        {placeListItem.map(item => (
          <View className='place-kind-list-item' key={item.id}>
            <View className='title-list'>
              <View className='name'>
                {item.place}
              </View>
              {/* <View className='icon'>
                <Image src={newGoods} style='width:140rpx;height:80rpx' />
              </View> */}
              <View className='more'>
                <View className='checkmore'>进入专题</View>
                <Image src={more} style='width:50rpx;height:30rpx' />
              </View>
            </View>
            <View className='kind-item-wrap'>
              {kindListItem.filter(e => get(e, 'parent_id', '') == item.id).map(kind => (
                <View className='kind-item' key={kind.id}>
                  <Image src={'http://qiniu.daosuan.net/'+get(kind,'picture','')} style='width:200rpx;height:200rpx;border-radius:20px' />
                  <View className='title'>{kind.title}</View>
                </View>
              ))}
              
            </View>
          </View>
        ))}
        
      </View>
    )
  }
}


export default PlaceKindTab;

