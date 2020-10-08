import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View } from '@tarojs/components'
import { AtSearchBar,  AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import './index.scss'
import PlaceTab from './Components/PlaceTab'
import Kindtab from './Components/KindTab'
import SaleTop from './Components/SaleTop'
import SaleNew from './Components/SaleNew'
import MySwiper from './components/MySwiper'
import PlaceKindTab from './Components/PlaceKindTab'
import Navbar from '../../components/navbar/navbar'
import { get as getGlobalData } from '../../global_data'

@connect(({ goods }) => ({
   ...goods
}))

class Index extends Component {
  constructor () {
    super(...arguments);
    this.state={
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
    }
  }
  componentDidMount(){
    this.props.dispatch({
      type: 'goods/getGoodsPlace',
    });
    this.props.dispatch({
      type: 'goods/getGoodsKind',
    });
    this.props.dispatch({
      type: 'goods/getslideshow',
    })
  }
  
  render () {
    const { placeList, kindList, slideshowList } = this.props;
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3
    
    return (
      <View className='index' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showLogo
          showSearch
        ></Navbar>
        <View className='home-top-wrap'>
          <PlaceTab placeList={placeList} />
          <MySwiper slideshowList={slideshowList} />
          <Kindtab kindList={kindList} />
        </View>
        <SaleTop />
        <SaleNew />
        <PlaceKindTab placeList={placeList} kindList={kindList} />
      </View>
        
    )
  }
}

export default Index;
