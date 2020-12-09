import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { AtTabs, AtTabsPane } from 'taro-ui'
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import './comment.scss'

@connect(({ order, goods, comment }) => ({
  ...order,...goods,
}))
class CommentCenter extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    userId: Taro.getStorageSync('userId'),
    current: 0,
    total:0,
    page:1,
    orderList:[],
    orderInfoList:[],
  }
 
  async componentDidMount () {
    this.getUserCommentList();
    //this.getCommentList();
  }
  async getUserCommentList(){
    await this.props.dispatch({
      type: 'comment/getUserComment',
      payload: {
        // uid:this.state.userId,
      },
    })
  }
  //获取评价信息列表

  async getCommentList(){
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        author_id:this.state.userId,
        status: 4,
        limit:this.state.page*10,
      },
    })
    const orderList = this.props.orderList;
    const orders = get(orderList,'orders');
    const total = get(orderList,'total');
    const Ids = orders.map((arr) => {return arr.id})
    await this.props.dispatch({
      type: 'order/mgetOrderList',
      payload: {
        ids:Ids
      },
    })
    const orderInfoList = this.props.orderInfoList;
    this.setState({
      orderInfoList:orderInfoList
    })
    console.log(this.props.orderInfoList)
    
  }
  handleClick (value) {
    this.setState({
      current: value
    })
  }


  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    const userInfo = Taro.getStorageSync('userInfo'); //获取当前用户信息
    const tabList = [{ title: '待评价' }, { title: '可追评' }]
    
    return (
      <View className='comment-center' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='评价中心'
        ></Navbar>
        <View className='info-wrap'>

        </View>
        <View className='comment-tabs'>
          <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >标签页一的内容</View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
          </AtTabsPane>
        
        </AtTabs>
        </View>
      </View>
    )
  }
}

export default CommentCenter;