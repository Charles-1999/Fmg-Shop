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
    curr_tab: 0
  }

  /* 切换tabBar */
  switchTab(e) {
    const curr_tab = e.target.dataset.index
    this.setData({
      curr_tab
    })
  }

  // 自己封装的setState
  setData = (...params) => {
    this.setState(...params)
    console.log(...params)
  }

  render() {
    console.log('%c ........details/comments render.........', 'color:green');
    const { commentList } = this.props
    console.log(commentList)
    const {statusBarHeight, capsule, curr_tab} = this.state
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
          <View className={curr_tab==0?'tab_item active':'tab_item'} data-index={0}>全部</View>
          <View className={curr_tab==1?'tab_item active':'tab_item'} data-index={1}>好评</View>
          <View className={curr_tab==2?'tab_item active':'tab_item'} data-index={2}>中评</View>
          <View className={curr_tab==3?'tab_item active':'tab_item'} data-index={3}>差评</View>
        </View>
        <View className='comment_list'>
          {commentList.map(comment => (
            <View className='comment'>
              <View className='info_wrap'>
                <View className='avator'>
                  <Image src={'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIpzkM6832jewPzq7Ob6wUianML0UMLWZxruV4fVgiaCnJOp2iaXGcmJT9C8hEOZnpfETy7p7q97iaFfQ/132'} />
                </View>
                <View className='info'>
                  <View className='name'>{comment.nickname}</View>
                  <View className='time'>{comment.create_time}</View>
                </View>
              </View>
              <View className='content'>{comment.content}</View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}

export default Comments; 