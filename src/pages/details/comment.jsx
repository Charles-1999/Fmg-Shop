import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './comment.less'

class Comment extends Component {

  render() {
    return (
      <View className='comment' >
        <View className='title'>买家评论（14）</View>
        <Image className='more' src='http://qiniu.daosuan.net/picture-1598883365000' />
        <View className='comment_list'>
            <Image src='http://qiniu.daosuan.net/goods/82321-file10' />
            <Image src='http://qiniu.daosuan.net/goods/82321-file10' />
            <Image src='http://qiniu.daosuan.net/goods/82321-file10' />
            <Image src='http://qiniu.daosuan.net/goods/82321-file10' />
        </View>
      </View>
    )
  }
}

export default Comment; 