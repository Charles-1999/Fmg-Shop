import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import { get } from 'lodash';
import Taro, {Current} from '@tarojs/taro'; 
import { AtTabs, AtTabsPane } from 'taro-ui'
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import './comment.scss'

class CommentCenter extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    current: 0,
    total:0,
    orderList:[]
  }
 
  async componentDidMount () {
   
   
  }
  //获取评价信息列表
  getCommentList(){
    
  }
  handleClick (value) {
    this.setState({
      current: value
    })
  }


  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    const tabList = [{ title: '标签页1' }, { title: '标签页2' }]
    
    return (
      <View className='comment-center' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='评价中心'
        ></Navbar>
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