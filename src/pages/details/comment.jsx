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
    const {commentList, pictureList} = this.props

    return (
      <View className='comment' onClick={this.toComments}>
        <View className='title'>买家评论（{commentList.length}）</View>
        <Image className='more' src='http://qiniu.fmg.net.cn/picture-1598883365000' />
        <View className='comment_list'>
          {pictureList.length > 0
            ? pictureList.map((pic, index) => (
              <Image src={pic} key={index} />
            ))
            : <View className='text'>该商品暂无评论</View>
          }
        </View>
      </View>
    )
  }
}

export default Comment;
