import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View } from '@tarojs/components'
import { AtSearchBar,  AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import './index.scss'
import TopSearch from './Components/TopSearch'
import PlaceTab from './Components/PlaceTab'
import Navbar from '../../components/navbar/navbar'
import Recommend from './recommend'
import Goods from '../../model/Goods'
import { get as getGlobalData } from '../../global_data'



@connect(({ goods }) => ({
   ...goods
}))

class Index extends Component {
  constructor () {
    super(...arguments);
    this.state={
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule')
    }
  }
  
  componentDidMount= ()=> {
    //const { dispatch } = this.props;
    this.props.dispatch({
      type: 'goods/getGoodsPlace',
      payload: { page: 1, limit: 5 }, 
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
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

    return (
      <View className='index' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showLogo
        ></Navbar>
        {/* <TopSearch /> */}
        <View className='home-list-wrap'>
          <PlaceTab />
        </View>
      </View>
        
    )
  }
}


export default Index;
