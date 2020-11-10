import React, { Component } from 'react';
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, Text, Image, Navigator } from '@tarojs/components';
import Navbar from '@components/navbar/navbar'
import { get as getGlobalData } from '../../global_data'
import request, {getGoodsList} from '../../utils/request'
import {_mgetGoodsList} from '@service/Goods'

import './index.less'
import { connect } from 'react-redux';

@connect(({ goods }) => ({
  ...goods
}))
class CategoryListView extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
      list_style: true, // 列表展示方式 true：列表 false：宫格
      sort_type: [
        { id: 1, text: '综合' },
        { id: 2, text: '价格降序' },
        { id: 3, text: '价格升序' },
        { id: 4, text: '销量' },
      ],
      sort_id: 1, // 当前排序方式id
      isOpen: false, // 排序方式选择框是否显示
    }
  }

  UNSAFE_componentWillMount() {
    const { kind_tag, keyword } = getCurrentInstance().router.params;
    this.getGoodsIdList(kind_tag, keyword, 1);
  }

  /* 获取商品id列表 */
  getGoodsIdList = async (kind_tag, keyword = '', sort_id = 1) => {
    const goodsIdList = await request('/goods/list', {
      body: {
        limit: 99,
        page: 1,
        kind_tag,
        sort_way: sort_id,
        keyword
      },
      method: 'GET'
    })
    this.getGoodsList(goodsIdList.goods.map(item => item.id));
  }

  /* 获取商品详情列表 */
  getGoodsList = async (goodsIdList) => {
    let goodsList = await getGoodsList(goodsIdList)
    
    // 筛选 只保留上架的商品
    goodsList = goodsList.filter(item => item.on_sale)
    this.setData({
      goodsList
    })
  }

  /* 点击排序 */
  handleSortTypeClick = () => {
    let { isOpen } = this.state;
    this.setData({
      isOpen: !isOpen
    })
  }

  /* 改变排序方式 */
  changeSortType(sort_id) {
    let { goodsList } = this.state;
    const { kind_tag } = getCurrentInstance().router.params;
    this.getGoodsIdList(kind_tag, '', sort_id);
    this.setData({
      sort_id,
      isOpen: false
    })
  }

  /* 改变排布方式 */
  changeListStyle = () => {
    let { list_style } = this.state;
    this.setData({
      list_style: !list_style
    })
  }

  /* 显示排序方式选择框 */
  showFloat = () => {
    this.setState({
      isOpen: true,
    })
  }

  /* 隐藏排序方式选择框 */
  hiddenFloat = () => {
    this.setState({
      isOpen: false
    })
  }

  /* mask的touch事件 */
  handleMaskTouch = (e) => {
    console.log(e)
    e.preventDefault()
    e.stopPropagation()
  }

  /* 自己封装的setState */
  setData = (...params) => {
    this.setState(...params)
    console.log(...params)
  }

  render() {
    console.log('%c ........render.........', 'color:green');
    const { statusBarHeight, capsule, goodsList, list_style, sort_type, sort_id, isOpen } = this.state;
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
        {/* 筛选模块 */}
        <View className='filter_wrap'>
          <View className='filter_bar' style={{ marginTop: statusBarHeight + capsuleHeight }}>
            <View className={sort_id === 4 ? 'bar_item' : 'bar_item active'} onClick={this.handleSortTypeClick}>
              <Text>{sort_id === 4 ? '综合' : sort_type.find(item => item.id === sort_id).text}</Text>
              <Image className={isOpen ? 'isOpen' : ''} src='http://qiniu.daosuan.net/picture-1598883801000' />
            </View>
            <View className={sort_id === 4 ? 'bar_item active' : 'bar_item'} onClick={this.changeSortType.bind(this, 4)}>
              <Text>销量</Text>
            </View>
            <View className='bar_item view' onClick={this.changeListStyle}>
              <Image src='http://qiniu.daosuan.net/picture-1598882804000' />
            </View>
            <View className='bar_item filter'>
              <Text>筛选</Text>
              <Image src='http://qiniu.daosuan.net/picture-1598883801000' />
            </View>
          </View>
          {/* 选择排序模块 */}
          <View className={isOpen ? 'float_active float_wrap' : 'float_wrap'} style={{ height: 'calc(100vh - 60rpx - ' + (statusBarHeight + capsuleHeight) + 'px)' }}>
            <View className='mask' onClick={this.hiddenFloat}></View>
            <View className={isOpen ? 'container container_active' : 'container'}>
              {sort_type.map(item => (
                item.id < 4
                  ? item.id === sort_id
                    ? <View className='sort_item sort_active' onClick={this.changeSortType.bind(this, item.id)} key={item.id}>
                      {item.text}
                      <Image src='http://qiniu.daosuan.net/picture-1598883365000' />
                    </View>
                    : <View className='sort_item' onClick={this.changeSortType.bind(this, item.id)} key={item.id}>{item.text}</View>
                  : ''
              ))}
            </View>
          </View>
        </View>
        {/* 商品列表 */}
        <View className={list_style ? 'goods_list' : 'wrap'}>
          {(goodsList ?? []).map(goods => (
            <Navigator url={'/pages/details/index?gid=' + goods.id} className='goods_wrap' key={goods.id}>
              <View className='cover'>
                <Image src={goods.cover} />
              </View>
              <View className='info'>
                <Text className='name'>{goods.name}<Text className='sub'>{goods.sale_point}</Text></Text>
                <Text className='price'>
                  <Text className='sign'>￥</Text>{goods.showPrice}
                  {goods.sale
                  ? <Text className='sale_text'>优惠价</Text>
                  : ''}
                  <Text className='sale'>月售{goods.month_sale}件</Text>
                </Text>
              </View>
            </Navigator>
          ))}
        </View>
      </View>
    )
  }
}
export default CategoryListView;