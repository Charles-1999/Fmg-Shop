import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import request from '../../../utils/request'
import ListGood from './list_good'
import './comment.scss'



@connect(({ order, goods }) => ({
  ...order,
}))
class Comment extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    userId: Taro.getStorageSync('userId'),
    order_id:Current.router.params.id,  //当前订单id
    order_info:{},
    content:'',
    tag:0,
    tagInfo:[
      {id:1,title:'好评'},
      {id:2,title:'中评'},
      {id:3,title:'差评'}
    ]
  }
  async componentDidMount () {
    this.getOrderInfo();
  }
  //获取订单信息
  async getOrderInfo(){
    await this.props.dispatch({
      type: 'order/mgetOrderList',
      payload: {
        ids:[ parseInt(this.state.order_id)]
      }
    })
    const {orderInfoList} = this.props;
    // this.setState({
    //   order_info : orderInfoList[0]
    // })

  }
  //为用户创建评论
  async setComment(){
    if(this.state.tag == 0){
      Taro.showToast({
        title: '请选择一个标签',
        icon:''
      })
    }
    else {
      await request(`/comment/info/${this.state.userId}`, {
        method: 'POST',
        body:{
          order_id:parseInt(this.state.order_id),
          content:this.state.content,
          tag:this.state.tag,
        }
      }).then(()=>{
        Taro.showToast({
          title: '评价成功',
          icon: 'success'
        })
      })
    }
  }
  //修改tag
  changeTag=(id)=>{
    if(id == this.state.tag)[
      this.setState({
        tag:0,
      })
    ]
    else{
      this.setState({
        tag:id,
      })
    }
   
    console.log(id)
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
          title='评价'
        ></Navbar>
        <View className='comment-wrap'>
          <View className='tag-wrap'>
            {this.state.tagInfo.map(item => (
              <View key={item.id}>
                {item.id == this.state.tag ?  
                <View className='tag-active' key={item.id} onClick={this.changeTag.bind(this,item.id)}>
                  {item.title}
                </View>          
                :
                <View className='tag' onClick={this.changeTag.bind(this,item.id)}>
                  {item.title}
                </View> 
                }
              </View>
            ))}
          </View>
          <View className='content-wrap'>
            <AtTextarea 
              name='content'
              placeholder='请写下您的评价吧' 
              type='text' 
              value={this.state.content} 
              //onChange={this.handleChange.bind(this, 'detail')} 
            />
          </View>
          <View className='submit' onClick={this.setComment.bind(this)}>
            提交
          </View>
        
        </View>
        </View>
    )
  }
}

export default Comment;