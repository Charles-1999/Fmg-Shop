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
class RefundListGood extends Component {
  state = {
    goodInfo:{},
    price:0,

  }
  componentDidMount(){
    const {goodId,speId,goodsInfo,amount} = this.props;
    if(goodsInfo.length !== 0){
      const data = goodsInfo.filter(item => item.id == goodId)[0]
      const specification_list = get(data,'specification',[])
      const spe_index = specification_list.findIndex(item => item.id == speId);
      const spe = get(specification_list[spe_index],'specification') 
      this.setState({
        goodInfo: data,
        price:amount,
        spe_info:spe,
      })
    }

  }

  
  render () {
    console.log(this.props.goodId)
    return (
      <View className='refund-list-good'>
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
          {this.props.amount?
            <View className='price'>
              退款：¥{Number(this.state.price /100).toFixed(2)}
            </View>:''
          }
         
        </View>
       
       
       
      </View>
    )
  }
}

export default RefundListGood;