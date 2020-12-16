import React, { Component } from 'react'
import { View, Image, Navigator} from '@tarojs/components'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import './refundCenter.scss'
import RefundListGood from './refund_list_good'

@connect(({ order, goods, comment }) => ({
  ...order,...goods,...comment,
}))
class RefundCenter extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    userId: Taro.getStorageSync('userId'),
    refundList:[],
    orderDetailList:[],
    goods_info:[],
  }
  /**
   *  SUMMIT  = 1 //已提交 / 等待审核
      PERMIT  = 2 //商家审核 通过
      REJECT  = 4 //商家审核 拒绝
      SUCCESS = 8 //成功 / 已退款/货
      D2D         = 1  //上门取件
      Contact     = 2  //自行退货 这个是return
   */
  async componentDidMount () {
    //获取售后list
    await this.props.dispatch({
      type: 'order/getExchangeList',
      payload: {
        uid:this.state.userId
      }
    });
    const ids = get(this.props.refundList,'refunds',[]).map((arr) => {return arr.id})
    await this.props.dispatch({
      type: 'order/mgetExchangeList',
      payload: {
        ids:ids
      }
    });
    const detail_ids = this.props.refundInfoList.map((arr) => {return arr.order_detail_id})
    //获取订单明细list
    await this.props.dispatch({
      type: 'order/mgetOrderDetailList',
      payload: {
        ids:detail_ids
      }
    });
    const goodsIds = this.props.orderDetailList.map((arr) => {return arr.goods_id})
    //获取商品info
    await this.props.dispatch({
      type: 'goods/mgetGoodsListEntity',
      payload: goodsIds
    })
    this.setState({
      orderDetailList:this.props.orderDetailList,
      refundList:this.props.refundInfoList,
      goods_info:this.props.goodsList,
    })
    console.log(this.state.refundList)
    console.log(this.state.orderDetailList)
    console.log(this.state.goods_info)
  }
 
 

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    console.log('render')
    return (
      <View className='refund-center-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='售后/退款'
        ></Navbar>
        <View className='refund-center-list'>
          {this.state.refundList.map((item,index) =>(
            <View className='refund-card' key={get(item,'id')}>
              {get(item,'service_type')==1?
                <View className='refund-type'>
                <View className='out_refund_no'>售后单号：{get(item,'out_refund_no')}</View>
                <Image className='icon' src="http://qiniu.daosuan.net/picture-1606629874000" />
                <View className='text'>退款</View>
                </View>:
                  <View className='refund-type'>
                  <View className='out_refund_no'>售后单号：{get(item,'out_refund_no')}</View>
                  <Image className='icon' src="http://qiniu.daosuan.net/picture-1606629896000" />
                  <View className='text'>退货退款</View>
                </View>
              }
              <RefundListGood 
                key={this.state.goods_info}
                goodId={get(this.state.orderDetailList[index],'goods_id','')} 
                speId={get(this.state.orderDetailList[index],'goods_specification_id','')} 
                price={get(this.state.orderDetailList[index],'goods_amount','')} 
                quality={get(this.state.orderDetailList[index],'purchase_qty','')} 
                goodsInfo={this.state.goods_info}
                detailID={get(item,'id')}
                amount={get(item,'return_amount')}
              /> 
              {get(item,'status')==1?
                <View className='refund-status-list'>
                  待审核 待退款金额 ¥{Number(get(item,'return_amount')/100).toFixed(2)}元
                </View>:''
              }
              {get(item,'status')==2?
                <View className='refund-status-list'>
                  审核通过 待退款金额 ¥{Number(get(item,'return_amount')/100).toFixed(2)}元
                </View>:''
              }
              {get(item,'status')==4?
                <View className='refund-status-list'>
                  商家拒绝了您的申请，请与商家联系
                </View>:''
              }
              {get(item,'status')==8?
                <View className='refund-status-list'>
                  退款成功 退款成功 ¥{Number(get(item,'return_amount')/100).toFixed(2)}元
                </View>:''
              }
              <View className='btn-list'>
                <View className='refund-delete'>
                  删除记录
                </View>
                <Navigator url={'/pages/user/Order/userRefundDetail?id=' + get(item,'id')} className='refund-detail' >
                  查看详情
                </Navigator>
              </View>
            </View>
          ))}
        </View>
      </View>
    )
  }
}

export default RefundCenter;