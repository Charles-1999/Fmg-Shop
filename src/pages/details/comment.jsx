import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './comment.less'
import { connect } from 'react-redux';

@connect(({ comment }) => ({
  ...comment
}))
class Comment extends Component {

  toComments = () => {
    Taro.navigateTo({
      url: '/pages/details/comments/index'
    })
  }

  render() {
    console.log('%c ........comment render.........', 'color:green');
    const {commentList, pictureList, accountList} = this.props

    return (
      <View className='comment' onClick={this.toComments}>
        <View className='title'>买家评论（{commentList.length}）</View>
        <Image className='more' src='http://qiniu.daosuan.net/picture-1598883365000' />
        <View className='comment_list'>
          {pictureList.map(pic => (
            <Image src={pic} />
          ))}
        </View>
      </View>
    )
  }
}

export default Comment; 