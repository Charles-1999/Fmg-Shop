import React, {Component} from 'react';
import Taro,{getCurrentInstance} from '@tarojs/taro'
import { View, Text, Image, Navigator } from '@tarojs/components';
import Navbar from '@components/navbar/navbar'
import { get as getGlobalData } from '../../global_data'
import request from '../../utils/request'

import './index.less'

class CategoryListView extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
    }
  }

  UNSAFE_componentWillMount() {
    const {kind_tag} = getCurrentInstance().router.params;
    this.getGoodsIdList(kind_tag);
  }

  /* 获取商品id列表 */
  getGoodsIdList = async(kind_tag) => {
    const goodsIdList = await request('/goods/list', {
      body: {
        limit: 99,
        page: 1,
        kind_tag
      },
      method: 'GET'
    })
    this.getGoodsList(goodsIdList.goods.map(item => item.id));
  }

  /* 获取商品详情列表 */
  getGoodsList = async(goodsIdList) => {
    let goodsList = await request('/goods/_mget', {
      body: {
        ids: goodsIdList
      },
      method: 'POST'
    })
    goodsList.forEach(goods => {
      // 封面前缀处理
      goods.cover = 'http://qiniu.daosuan.net/' + goods.cover;
      // 显示价格处理
      goods.showPrice = Math.min(...goods.specification.map(spec => spec.price)).toFixed(2);
    });
    this.setData({
      goodsList
    })
  }

  /* 自己封装的setState */
  setData = (...params) => {
    this.setState(...params)
    console.log(...params)
  }

  render(){
    console.log('%c ........render.........','color:green');
    const { statusBarHeight, capsule, goodsList } = this.state;
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='cate_list' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showBack
          showSearch
        >
        </Navbar>
        <View className='goods_list'>
          {(goodsList ?? []).map(goods => (
            <Navigator url={'/pages/details/index?gid='+goods.id} className='goods_wrap' key={goods.id}>
              <Image className='cover' src={goods.cover} />
              <View className='info'>
                <Text className='name'>{goods.name}</Text>
                <Text className='price'><Text className='sign'>￥</Text>{goods.showPrice}<Text className='sale'>月售{goods.month_sale}件</Text></Text>
              </View>
            </Navigator>
          ))}
        </View>
      </View>
    )
  }
}
export default CategoryListView;