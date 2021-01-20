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
    is_after_serve:0,
    isShowComment:0,
    isShowSecondComment:0,
  }
  componentDidMount(){
    const {goodId,speId,price,quality,message,goodsInfo,IsRefund,status,isPass} = this.props;
    if(goodsInfo.length !== 0){
      const data = goodsInfo.filter(item => item.id == goodId)[0]
      const specification_list = get(data,'specification',[])
      const spe_index = specification_list.findIndex(item => item.id == speId);
      const spe = get(specification_list[spe_index],'specification') 
      const is_after_serve = this.props.isShowRefund;
      this.setState({
        goodInfo: data,
        price:price,
        spe_info:spe,
        quality:quality,
        message:message,
        IsRefund:IsRefund,
        status:status,
        is_after_serve:is_after_serve,
        isPass:isPass,
      })
    }

    if(this.props.isShowComment && (this.props.status == 4)){
      this.setState({
        isShowComment: true,
      })
    }
    if(this.props.isShowComment && (this.props.status == 4)){
      this.setState({
        isShowSecondComment: true,
      })
    }
  }
  //跳转到评论页面
  toComment = (value) => {
    Taro.navigateTo({
      url: `/pages/user/Order/comment?&oId=${this.props.oId}&dId=${this.props.detailID}&status=${value}`,
    });
  } 
  //跳转到退款选择界面
  toSelect =() =>{
    Taro.navigateTo({
      url: `/pages/user/Order/refundSelect?gid=${this.props.goodId}&speId=${this.props.speId}&ooId=${this.props.ooId}&oId=${this.props.oId}&dId=${this.props.detailID}`,
      // url: `/pages/user/Order/refundSelect?&oId=${this.props.oId}&dId=${this.props.detailID}`,
    });
  }
  
  render () {
    return (
      <View className='list-good'>
        {this.state.goodInfo !== {} ? 
        <Image src={get(this.state.goodInfo,'cover','')} />
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
              ¥ { Number(this.state.price / 100).toFixed(2)}
            <View class='quantity'>
              x{this.state.quality}
            </View>
          </View>
          {this.state.isShowComment && this.props.is_comment==0 ?
            <View className='commit' onClick={this.toComment.bind(this,0)}>我要评价</View>: ''
          }
          {this.state.isShowSecondComment && this.props.is_comment==1 ?
            <View className='secont-commit' onClick={this.toComment.bind(this,1)}>可追评</View>: ''
          }
          {this.state.IsRefund && (this.state.status==2||this.state.status==3||this.state.status==4)? 
            <View className='refund' onClick={this.toSelect.bind(this)}>退款</View>: ''  
          }
          {this.state.IsRefund && !this.state.is_after_serve  && (this.state.status==5 || this.state.status==7 || this.state.status==8 || this.state.status==9)  ? 
            <View className='after-sale' onClick={this.toSelect.bind(this)}>申请售后</View>: ''  
          }
          {
            this.state.isPass==1 ?
            <View class='refund-success'>等待审核</View>:''
          }
          {
            this.state.isPass==2 ?
            <View class='refund-success'>退款中</View>:''
          }
          {
            this.state.isPass==4 ?
            <View class='refund-success'>已拒绝</View>:''
          }
          {
            this.state.isPass==8 ?
            <View class='refund-success'>退款成功</View>:''
          }
          {/* {
            this.state.IsRefund &&   && this.state.status==7? 
            <View className='after-sale' onClick={this.toSelect.bind(this)}>申请售后</View>: ''  
          } */}
   

        
        </View>
       
       
      </View>
    )
  }
}

export default ListGood;