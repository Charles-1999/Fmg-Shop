import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View } from '@tarojs/components'
import { AtSearchBar, AtIcon } from 'taro-ui'
import '../index.scss'

@connect(({ goods }) => ({
   ...goods
}))

class PlaceTab extends Component {
  constructor () {
    super(...arguments);
    this.state={
     
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'goods/getGoodsPlace',
      payload: { page: 1, limit: 5,}, 
    });
  }

  render () {
    const { placeList } = this.props;
    return (
      <View className='place-tab-row'>
        <View className='place-tab-item'>

        </View>
      </View>
    )
  }
}

export default PlaceTab;

