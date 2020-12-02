import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { get } from 'lodash';
import './refundSelect.scss'
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import request, { getGoodsList } from '../../../utils/request'
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'

@connect(({  goods }) => ({
  ...goods,
}))
class RefundSelect extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    good_id:Current.router.params.gid,  //当前商品id
    oId:Current.router.params.oId,  //当前订单id
    ooId:Current.router.params.ooId, //当前订单总订单id
    dId:Current.router.params.dId, //当前订单order_detail iddId:
    speId:Current.router.params.speId, //当前订单order_detail id
  }
  async componentDidMount(){
   await this.getGoodInfo();
  }

  //获取商品信息
  async getGoodInfo(){
    const goodsInfo = await getGoodsList([parseInt(this.state.good_id)])
    const specification_list = get(goodsInfo[0],'specification',[])
    const spe_index = specification_list.findIndex(item => item.id == this.state.speId);
    const spe = get(specification_list[spe_index],'specification')
    this.setState({
      goods_info:goodsInfo[0],
      spe_info:spe,
    })
    console.log(this.state.goods_info)
  }

  //跳转至退款详情界面
  toDetail(tag){
     //退款(不退货)
     if(tag==1){
      Taro.navigateTo({
        url: `/pages/user/Order/refundDetail?&oId=${this.state.oId}&dId=${this.state.dId}&status=${tag}`,
      })
    }
    //退货退款
    else if(tag==2){
      Taro.navigateTo({
        url: `/pages/user/Order/refundDetail?&oId=${this.state.oId}&dId=${this.state.dId}&status=${tag}`,
      })
    }
     //换货
    else if(tag==4){
      Taro.navigateTo({
        url: `/pages/user/Order/refundDetail?&oId=${this.state.oId}&dId=${this.state.dId}&status=${tag}`,
      })
    }
  }

  
  render () {
    const {statusBarHeight, capsule} = this.state;
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='refund-select-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='选择服务'
        ></Navbar>
        <View className='good-wrap'>
          <View className='good-text'>退款商品</View>
          <View className='good-info'>
            <Image src={get(this.state.goods_info,'cover','')} />
            <View className='info'>
              <View className='name'>{get(this.state.goods_info,'name','')}</View>
              <View className='spe_info'>
                {this.state.spe_info? Object.keys(this.state.spe_info).map(item =>(
                  <View className='item' key={item}>
                    {item}:{this.state.spe_info[item]+" "}
                  </View>
                )):''}
              </View>
            </View>
          </View>
        </View>
        <View className='select-wrap'>
          <View className='select-text'>选择服务类型</View>
          <View className='item-wrap' onClick={this.toDetail.bind(this,1)}>
            <Image src='http://qiniu.daosuan.net/picture-1606629874000 ' className='icon' />
            <View className='info'>
              <View className='title'>我要退款(无须退货)</View>
              <View className='desc'>没收到货，或与买家协商同意不用退款只退货</View>
            </View>
            <Image src='http://qiniu.daosuan.net/picture-1598883337000' className='more' />
          </View>
          <View className='item-wrap' onClick={this.toDetail.bind(this,2)}>
            <Image src='http://qiniu.daosuan.net/picture-1606629896000 ' className='icon' />
            <View className='info'>
              <View className='title'>我要退货退款</View>
              <View className='desc'>已收到货，需要退还收到的货物</View>
            </View>
            <Image src='http://qiniu.daosuan.net/picture-1598883337000' className='more' />
          </View>
          <View className='item-wrap' onClick={this.toDetail.bind(this,4)}>
            <Image src='http://qiniu.daosuan.net/picture-1606630723000 ' className='icon' />
            <View className='info'>
              <View className='title'>我要换货</View>
              <View className='desc'>已收到货，需要更换已收到的货物</View>
            </View>
            <Image src='http://qiniu.daosuan.net/picture-1598883337000' className='more' />
          </View>
         
        </View>
      </View>
    )
  }
}

export default RefundSelect;