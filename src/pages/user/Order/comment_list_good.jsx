import React, { Component } from 'react'
import { View, Text, Image, Navigator} from '@tarojs/components'
import { get } from 'lodash';
import './myOrder.scss'
import { connect } from 'react-redux';
import Taro from '@tarojs/taro'; 
import request from '../../../utils/request'

@connect(({  goods }) => ({
  ...goods,
}))
class CommentListGood extends Component {
  state = {
    goodInfo:{},
  }
  componentDidMount(){
    const {goodId,goodsInfo} = this.props;
    if(goodsInfo.length !== 0){
      const data = goodsInfo.filter(item => item.id == goodId)[0]
      this.setState({
        goodInfo: data,
      })
    }

  }

  
  render () {
    const {goodInfo} =  this.state.goodInfo
    return (
      <Navigator className='comment-list-good' url={'/pages/details/index?gid='+this.props.goodId}>
        {this.state.goodInfo !== {} ? 
        <Image src={get(this.state.goodInfo,'cover','')} />
        :''}
        <View className='info'>
          <View className='title'>
            {get(this.state.goodInfo,'name','').length>=15 ?
            <View className='name'>{get(this.state.goodInfo,'name','').substring(0,14)}...</View>:
            <View className='name'>{get(this.state.goodInfo,'name','')}</View>
          }
           
          </View>
          <View className='price'>
            ¥
            {get(this.state.goodInfo,'showPrice','')}
          </View>
        </View>
       
      </Navigator>
    )
  }
}

export default CommentListGood;