import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Image } from '@tarojs/components'
import '../index.scss'

@connect(({ goods }) => ({
  ...goods
}))

class PlaceTab extends Component {

  constructor () {
    super(...arguments);
    this.state={
      currentId: 0,
    }
  }
  handleTypeTab = (e,id) => {
    this.setState({
      currentId: e,
    })
    Taro.navigateTo({
      url: `/pages/index/placeGoodsList?id=${this.state.currentId}`,
    });
  }
  render () {
    const { placeList } = this.props
    const data = Array.from(placeList)
 
    return (
      <View className='place-tab-row'>
      {data.map(item => (
        <View className='place-tab-item' key={item.id} onClick={this.handleTypeTab.bind(this,item.id)}>
            <View className='pic'>
              <Image src={'http://qiniu.daosuan.net/'+item.picture} style='width:130rpx;height:130rpx' />
            </View>
            <View className='title'>
              {item.place}
            </View>
        </View>
      ))}
       
      </View>
    )
  }
}


export default PlaceTab;

