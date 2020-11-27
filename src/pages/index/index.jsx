import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Swiper, SwiperItem, Image, Navigator, Input} from '@tarojs/components'
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
      goodsSaleTopList:[],
      
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
    const {kindList} = this.props;
    const kindListIds = kindList.map((arr) => {return arr.id})
    await this.props.dispatch({
      type: 'goods/getGoodsKindEntity',
      payload:{
        ids:kindListIds
      }
    });
    const {kindInfoList} = this.props;
  
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

    await this.props.dispatch({
      type: 'goods/getGoodsTopList',
      payload: {
        sale_tag: 3,
      },    
    });
    const { placeList, slideshowList, goodsSaleTopList } = this.props;

    this.setState({
      placeList:placeList,
      kindList:kindInfoList,
      slideshowList:slideshowList,
      goodsSaleTopList:goodsSaleTopList,
    })

  }
  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3
    return (
      <View className='index' >
        <Swiper
          className='swiper'
          circular
          autoplay
        >
          {this.state.slideshowList.map(item => (
            <SwiperItem key={item.id}>
              <View className='demo-text'>
                <Navigator url={'/pages/details/index?gid=' + get(item,'goods_id')}>
                  <View className='photo'>
                    <Image src={'http://qiniu.daosuan.net/'+get(item,'picture','')} className='img' />
                  </View>
                </Navigator>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
        <View className='logo-search-wrap'>
          {/* <View className='logo'>
            <Image src='http://qiniu.daosuan.net/picture-1602721913000' />
          </View> */}
          <View className='search-wrap'>
            <View className='searchBar'>
            <Input placeholder='搜索'  maxLength='50' />
            <Image className='search' src='http://qiniu.daosuan.net/icon-1598881971000'  />
          </View>
          </View>
        </View>
        {/* <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showLogo
          showSearch
        ></Navbar> */}
        <View className='home-top-wrap'>
          <PlaceTab placeList={this.state.placeList} key={this.state.placeList} />

        <Kindtab kindList={this.state.kindList} />
        </View>
        <SaleTop goodsSaleTopList={this.state.goodsSaleTopList}  key={this.state.goodsSaleTopList} />
        <SaleNew />
        {/* <PlaceKindTab placeList={this.state.placeList} kindList={this.state.kindList} /> */}
      </View>
        
    )
  }
}

export default Index;
