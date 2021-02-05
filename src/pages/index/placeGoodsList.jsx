import React, { Component } from 'react'
import Taro, {Current} from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Image } from '@tarojs/components'
import { get } from 'lodash';
import './index.scss'
import Navbar from '../../components/navbar/navbar'
import GoodsCard from './Components/GoodsCard'
import { get as getGlobalData } from '../../global_data'

@connect(({ goods }) => ({
  ...goods
}))

class PlaceGoodsList extends Component {
  static defaultProps = {
    placeList: [],
    kindList: [],
    goodsList: [],
    current_kind: [],
  };
  constructor () {
    super(...arguments);
    this.state={
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
      placeList: [],
      kindList: [],
    }
  }
  async componentDidMount(){
    //场地
    await this.props.dispatch({
      type: 'goods/getGoodsPlaceEntity',///goods/place_tag/_mget
      payload:
        [parseInt(Current.router.params.id)]
    });
    //种类
    await this.props.dispatch({
      type: 'goods/getGoodsKind',
      payload:{
        limit:30
      }
    });
    const Ids = this.props.kindList.map((arr) => {return arr.id})
    await this.props.dispatch({
      type: 'goods/getGoodsKindEntity',
      payload:{
        ids:Ids
      }
    });

    const { placeList, kindInfoList} = this.props
    //数据过滤
    const current_place = placeList.filter(item => item.id == Current.router.params.id)[0];
    // const current_kind = kindInfoList.filter(item => get(item, 'parent_id', '') == Current.router.params.id);
    this.setState({
      placeList: current_place,
      kindList: kindInfoList,
    })
  }
  toKindList(id){
    Taro.navigateTo({
      url: `/pages/goods_list/index?kind_tag=${id}`
    })
  }


  render () {
    const capsuleHeight = this.state.capsule.height + (this.state.capsule.top - this.state.statusBarHeight) * 3

    return (
      <View className='place-goods-list-wrap' style={{ marginTop: this.state.statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={this.state.statusBarHeight}
          capsuleHeight={capsuleHeight}
          showBack
          showSearch
        >
        </Navbar>
        <View className='title-wrap'>
          <View className='pic'>
            <Image src={this.state.placeList.picture} style='width:170rpx;height:170rpx' />
          </View>
          <View className='info'>
            <View className='name'>{this.state.placeList.place}</View>
            <View className='check-info'>查看简介</View>
          </View>
        </View>
        <GoodsCard place_tag={parseInt(Current.router.params.id)} />
        {/* {this.state.kindList.filter(item=>item.parent_id == 0).map(item => (
          <View className='place-kind-goods-list' key={item.id}>
            <View className='title-list' >
              <View className='name'>
                {item.title}
              </View>
              <View className='more' onClick={this.toKindList.bind(this,item.id)}>
                <View className='checkmore'>查看更多</View>
                <Image src='http://qiniu.fmg.net.cn/picture-1598883365000' style='width:50rpx;height:30rpx' />
              </View>
            </View>
            <GoodsCard place_tag={parseInt(Current.router.params.id)} kind_tag={item.id} />
          </View>
          ))} */}
      </View>
    )
  }
}


export default PlaceGoodsList;

