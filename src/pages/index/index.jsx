import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View } from '@tarojs/components'
import { AtSearchBar,  AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import './index.scss'
import TopSearch from './Components/TopSearch'
import PlaceTab from './Components/PlaceTab'

@connect(({ goods }) => ({
   ...goods
}))

class HomeListView extends Component {
  constructor () {
    super(...arguments);
    this.state={
      
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'goods/getGoodsPlace',
    });
    this.props.dispatch({
      type: 'goods/getGoodsCategory',
      payload: { page: 1, limit: 5 }, 
    });
    this.props.dispatch({
      type: 'good/getGoodsSale',
      payload: { page: 1, limit: 5 }, 
    });
    this.props.dispatch({
      type: 'good/getGoodsSpecification',
      payload: { page: 1, limit: 5 }, 
    });
    Taro.login() //获取jscode
    .then(response=>{
      console.log(response.code)
    })
  }
  
  render () {
    const { placeList } = this.props;
    console.log(placeList)
    return (
      <View className='index'>
        <TopSearch />
        <View className='home-list-wrap'>
          <PlaceTab />
        </View>
      </View>
        
    )
  }
}


export default HomeListView;

