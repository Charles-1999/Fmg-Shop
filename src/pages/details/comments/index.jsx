import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Navbar from '@components/navbar/navbar'
import Taro from '@tarojs/taro';
import './index.less'
import { connect } from 'react-redux';
import { get as getGlobalData } from '../../../global_data'

@connect(({ comment }) => ({
  ...comment
}))
class Comments extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    curr_tab: 0,
    commentList: this.props.commentList,
    goodComments: this.props.goodComments,
    mediumComments: this.props.mediumComments,
    badComments: this.props.badComments
  }

  /* 切换tabBar */
  switchTab(e) {
    const curr_tab = e.target.dataset.index
    let { commentList, goodComments, mediumComments, badComments } = this.state

    if (curr_tab == 1) {
      commentList = goodComments
    } else if (curr_tab == 2) {
      commentList = mediumComments
    } else if (curr_tab == 3) {
      commentList = badComments
    }

    this.setData({
      curr_tab,
      commentList
    })
  }

  /** 
   * 预览图片
   * @param {Stirng} url    当前图片的url
   * @param {Number} index  当前评论的索引
   * @return {void} 
  */
  prevImg(url, index) {
    let urls = []
    urls.push(...this.props.commentList[index].pictures)
    Taro.previewImage({
      urls,
      current: url
    })
  }

  /* 自己封装的setState */
  setData = (...params) => {
    this.setState(...params)
    console.log(...params)
  }

  render() {
    console.log('%c ........details/comments render.........', 'color:green');
    const { goodComments, mediumComments, badComments } = this.props
    const {statusBarHeight, capsule, curr_tab, commentList} = this.state
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;

    return (
      <View className='comments' style={{ paddingTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showBack
          showTitle
          title='买家评论'
        />
        <View className='tab_bar' style={{ top: statusBarHeight + capsuleHeight }} onClick={this.switchTab.bind(this)}>
          <View className={curr_tab==0?'tab_item active':'tab_item'} data-index={0}>全部({commentList.length})</View>
          <View className={curr_tab==1?'tab_item active':'tab_item'} data-index={1}>好评({goodComments.length})</View>
          <View className={curr_tab==2?'tab_item active':'tab_item'} data-index={2}>中评({mediumComments.length})</View>
          <View className={curr_tab==3?'tab_item active':'tab_item'} data-index={3}>差评({badComments.length})</View>
        </View>
        <View className='comment_list'>
          {commentList.map((comment, comment_index) => (
            <View className='comment' key={comment.id}>
              <View className='info_wrap'>
                <View className='avator'>
                  <Image src={comment.avator} />
                </View>
                <View className='info'>
                  <View className='name'>{comment.nickname}</View>
                  <View className='time'>{comment.toNow}</View>
                </View>
              </View>
              <View className='content'>{comment.content}</View>
                <View className='picture_list'>
                  {comment.pictures.map((pic, pic_index) => (
                    <View className='picture' key={pic_index}><Image src={pic} onClick={this.prevImg.bind(this, pic, comment_index)} mode='aspectFill'></Image></View>
                  ))}
                </View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}

export default Comments; 