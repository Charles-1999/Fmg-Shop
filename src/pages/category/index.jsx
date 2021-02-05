import React, {Component} from 'react';
import Taro from '@tarojs/taro'
import { View, Text, Image, ScrollView, Navigator } from '@tarojs/components';
import Navbar from '@components/navbar/navbar'
import { get as getGlobalData } from '../../global_data'
import request from '../../utils/request'

import './index.less'
import { connect } from 'react-redux';

@connect(({ cart }) => ({
  ...cart
}))
class CategoryListView extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
      leftMenuList: [], // 左边一级菜单
      rightMenuList: [], // 右边二级菜单
      curr_menu_index: 0, // 当前一级菜单的序号
    }
  }

  UNSAFE_componentWillMount() {
    this.getCateList();
  }

  componentDidShow() {
    this.props.dispatch({
      type: 'cart/getCart'
    })
  }

  /* 获取菜单列表 */
  getCateList = async() => {
    /* 获取种类标签列表 */
    const kindTagList = await request('/goods/kind_tag/list', {
      body: {
        limit: 99,
        page: 1
      },
      method: 'GET'
    })
    const ids = kindTagList.tags.map(item => item.id);
    /* 批量获取种类标签 */
    const res = await request('/goods/kind_tag/_mget', {
      body: {
        ids
      },
      method: 'POST'
    })
    res.forEach(item => item.picture =  'http://qiniu.fmg.net.cn/' + item.picture);
    let cateList = {
      time: '',
      data: [...res.filter(item => item.parent_id === 0)]
    }
    cateList.data.forEach(parent => {
      parent.child = res.filter(item => item.parent_id === parent.id);
    })
    const {curr_menu_index} = this.state;
    const leftMenuList = cateList.data.map(cate => cate.title);
    const rightMenuList = cateList.data[curr_menu_index].child;
    this.setData({
      leftMenuList,
      rightMenuList
    })
    Taro.setStorageSync('cateList', cateList);
  }

  /* 点击左侧菜单
    1、更改左侧菜单样式 active
    2、更新右侧菜单内容 rightMenuList
  */
  clickLeftMenu(curr_menu_index) {
    const cateList = Taro.getStorageSync('cateList');
    const rightMenuList = cateList.data[curr_menu_index].child;
    this.setData({
      curr_menu_index,
      rightMenuList
    })
  }

  /* 自己封装的setState */
  setData = (...params) => {
    this.setState(...params)
    console.log(...params)
  }

  render(){
    console.log('%c ........render.........','color:green');
    const { statusBarHeight, capsule, leftMenuList, rightMenuList, curr_menu_index } = this.state;
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='cate_list' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          title='分类'
        >
        </Navbar>
        <View className='cate_container' style={{ height:'calc(100vh - ' + (statusBarHeight + capsuleHeight) + 'px)' }}>
          <ScrollView className='left' scrollY>
            {leftMenuList.map((menu,menu_index) => (
              <View className={'menu_item ' + (menu_index === curr_menu_index ? 'active' : '')} key={menu_index} onClick={this.clickLeftMenu.bind(this,menu_index)}>
                <View className='menu_item_text'>{menu}</View>
              </View>
            ))}
          </ScrollView>
          <ScrollView className='right' scrollY>
            <View className='menu_wrap'>
              {rightMenuList.map(menu => (
                <Navigator url={'/pages/goods_list/index?kind_tag=' + menu.id} className='menu_item' key={menu.id}>
                  <Image src={menu.picture} />
                  <Text>{menu.title}</Text>
                </Navigator>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}
export default CategoryListView;
