import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { get } from 'lodash';
import './myOrder.scss'
import { connect } from 'react-redux';
import Taro from '@tarojs/taro'; 
import request from '../../../utils/request'


@connect(({  goods }) => ({
  ...goods,
}))
class ListGood extends Component {
  state = {
    goodInfo:{},
    price:0,
    quality:0,
    message:'',
    isShowComment:false,
  }
  componentDidMount () {
    const {goodId,speId,price,quality,message,goodsInfo} = this.props;
    const data = goodsInfo.filter(item => item.id == goodId)
    const specification_list = get(data[0],'specification',[])
    const spe_index = specification_list.findIndex(item => item.id == speId);
    const spe = get(specification_list[spe_index],'specification') 
    if(spe){
      this.setState({
        goodInfo: data[0],
        spe_info:spe,
        price:price,
        quality:quality,
        message:message,
      })
    }
    if(this.props.isShowComment && this.props.status == 4){
      this.setState({
        isShowComment: true,
      })
    }
  }
  //跳转到评论页面
  toComment= () => {
    Taro.navigateTo({
      url: `/pages/user/Order/comment?id=${this.props.goodId}`,
    });
  } 
  
  render () {
    return (
      <View className='list-good'>
        {this.state.goodInfo !== {} ? 
        <Image src={'http://qiniu.daosuan.net/'+get(this.state.goodInfo,'cover','')} />
        :''}
        <View className='title'>
          <View className='name'>{get(this.state.goodInfo,'name','')}</View>
          <View className='spe'>
            {this.state.spe_info? Object.keys(this.state.spe_info).map(item =>(
              <View className='item' key={item}>
                {item}:{this.state.spe_info[item]} 
              </View>
            )):''}
          </View>
          <View className='message'>备注：{this.state.message}</View>
        </View>
        <View className='price-info'>
          <View class='one-price'>
            ¥ {this.state.price*0.01}
            <View class='quantity'>
              x{this.state.quality}
            </View>
          </View>
         
          {this.state.isShowComment ?
            <View className='commit' onClick={this.toComment.bind(this)}>我要评价</View>: ''
          }
        
        </View>
       
       
      </View>
    )
  }
}

export default ListGood;