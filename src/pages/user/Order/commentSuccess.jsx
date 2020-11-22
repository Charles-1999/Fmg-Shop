import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { get } from 'lodash';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import './comment.scss'

class CommentSuccess extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    good_id:Current.router.params.gid,  //当前商品id
    
  }
  async componentDidMount () {
   
   
  }
  handlePage(value){
    if(value == 1){
      Taro.switchTab({
        url: `/pages/index/index`,
      });
    }
    if(value == 2){
      Taro.redirectTo({
        url: `/pages/details/index?gid=${this.state.good_id}`,
      });
    }
  }


  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;

    return (
      <View className='comment' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='评价成功'
        ></Navbar>
        <View className='comment-success-wrap'>
          <View className='comment-success'>
            <Image src='http://qiniu.daosuan.net/picture-1606024570000'></Image>
            <View className='text'>评价成功</View>
          </View>
          <View className='btn-wrap'>
            <View className='to-shouye' onclick={this.handlePage.bind(this,1)}>回到首页</View>
            <View className='to-comment' onclick={this.handlePage.bind(this,2)}>查看评论</View>
          </View>
        </View>
      </View>
    )
  }
}

export default CommentSuccess;