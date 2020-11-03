import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Swiper, SwiperItem, Image} from '@tarojs/components'
// import { AtSearchBar,  AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import { get } from 'lodash'
import './index.scss'
import PlaceTab from './Components/PlaceTab'
import Kindtab from './Components/KindTab'
import SaleTop from './Components/SaleTop'
import SaleNew from './Components/SaleNew'
// import MySwiper from './Components/MySwiper'
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
      placeList:[],
      kindList:[],
      slideshowList:[],
    }
  }
  async componentDidMount(){
    await this.props.dispatch({
      type: 'goods/getGoodsPlace',
    });
    await this.props.dispatch({
      type: 'goods/getGoodsKind',
      payload:{
        limit:30
      }
    });
    await this.props.dispatch({
      type: 'goods/getslideshow',
    });
    const{ slideshowListIds } = this.props;
    await this.props.dispatch({
      type:'goods/getslideshowEntity',
      payload: {
        ids:slideshowListIds
      }
    })
    const { placeList, kindList, slideshowList } = this.props;
    console.log(slideshowList)
    // slideshowList.forEach(item => {
    //   item.picture = 'http://qiniu.daosuan.net/' + item.picture;
    // })
    this.setState({
      placeList:placeList,
      kindList:kindList,
      slideshowList:slideshowList,
    })
    console.log(this.state.slideshowList)

  }
  render () {
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
          <PlaceTab placeList={this.state.placeList} />
          <Swiper
            className='swiper'
            circular
            indicatorDots
            indicatorColor='#999'
            indicatorActiveColor='#bf708f'
            autoplay
          >
            {this.state.slideshowList.map(item => (
              <SwiperItem key={item.id}>
                <View className='demo-text'>
                  <View className='photo'>
                    <Image src={'http://qiniu.daosuan.net/'+get(item,'picture','')} className='img' />
                  </View>
                </View>
          </SwiperItem>
        ))}
      </Swiper>
          <Kindtab kindList={this.state.kindList} />
        </View>
        <SaleTop />
        <SaleNew />
        {/* <PlaceKindTab placeList={this.state.placeList} kindList={this.state.kindList} /> */}
      </View>
        
    )
  }
}

export default Index;
