import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Image } from '@tarojs/components'
import './searchbar.less'

export default class Navbar extends Component {

  state = {
    input_Val: ''
  }

  search(e) {
    Taro.navigateTo({
      url: `/pages/goods_list/index?keyword=${e.detail.value}`
    })
    this.setState({ input_Val: '' });
  }

  render() {
    const {marginRight,marginLeft} = this.props;
    let {input_Val} = this.state;
    return (
      <View className='searchBar' style={{marginRight,marginLeft}}>
        <Input placeholder='搜索' confirmType='search' onConfirm={this.search.bind(this)} value={input_Val}/>
        <Image className='search' src='http://qiniu.daosuan.net/icon-1598881971000' mode='heightFix' onClick={this.search.bind(this)} />
      </View>
    )
  }
}
