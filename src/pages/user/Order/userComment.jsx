import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import './userComment.scss'
import formatTime from '../../.../../../utils/time'
import CommentListGood from './comment_list_good'

@connect(({ comment, goods}) => ({
  ...comment,...goods
}))
class userComment extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    userInfo:Taro.getStorageSync('userInfo'),
    capsule: getGlobalData('capsule'),
    userId: Taro.getStorageSync('userId'),
    userCommentList:[],
    goods_info:[],
  }
 
  async componentDidMount () {
    await this.getUserCommentList();
    await this.getGoodsList();
  }

  async getUserCommentList(){
    await this.props.dispatch({
      type: 'comment/getUserComment',
      payload: {
        uid:this.state.userId
      },
    })
    this.setState({
      userCommentList:this.props.userCommentList,
    })
    console.log(this.state.userCommentList)
  }

  async getGoodsList(){
    const goodsIds = this.state.userCommentList.map((arr) => {return arr.good_id})
     //获取商品info
     await this.props.dispatch({
      type: 'goods/mgetGoodsListEntity',
      payload: goodsIds
    })
    this.setState({
      goods_info:this.props.goodsList,
    })
    console.log(this.state.goods_info);
  }

    /** 
   * 预览图片
   * @param {Stirng} url    当前图片的url
   * @param {Number} index  当前评论的索引
   * @return {void} 
  */
  prevImg(url, index) {
    let urls = []
    urls.push(...this.state.userCommentList[index].pictures)
    Taro.previewImage({
      urls,
      current: url
    })
  }  

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;

    console.log('render')
    return (
      <View className='user-comment-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='我的评论'
        ></Navbar>
        <View className='user-comment-list-wrap'>
          {this.state.userCommentList.map((item,index) => (
            <View className='comment-item' key={item.id}>
              <View className='user-info'>
                <Image src={get(this.state.userInfo,'avatarUrl','')} />
                {/* <Image src={item.avator} /> */}
                <View className='name'>{item.nickname}</View>
              </View>
              <View class='date'>{formatTime(get(item,'create_time',''),'Y/M/D h:m:s') }</View>
              {get(item,'content','') !== '' ?
                <View class='content'>{get(item,'content','')}</View>:
                <View class='null-content'>此用户没有填写评价</View>
              }
              <View className='picture_list'>
                {item.pictures.map((pic, pic_index) => (
                  <View className='picture' key={pic_index}><Image src={pic} onClick={this.prevImg.bind(this, pic,index)} mode='aspectFill'></Image></View>
                ))}
              </View>
              <CommentListGood 
                goodsInfo={this.state.goods_info}
                goodId={item.good_id}
                key={this.state.goods_info}
               
              />
            </View>
          ))}
        </View>
       
      </View>
    )
  }
}

export default userComment;