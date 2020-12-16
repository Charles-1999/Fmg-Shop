import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { get } from 'lodash';
import './refundCenter.scss'
import { connect } from 'react-redux';
import {Current} from '@tarojs/taro'; 
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import formatTime from '../../.../../../utils/time'
import RefundListGood from './refund_list_good'

@connect(({  goods, order}) => ({
  ...goods,...order
}))
class UserRefundDetail extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    id:Current.router.params.id,
    refundList:[],
    orderDetailList:[],
    goods_info:[],
    reason:[
      {id:1,text:'不喜欢不想要',},
      {id:2,text:'空包',},
      {id:3,text:'未按约定时间发货',},
      {id:4,text:'快递未送达',},
      {id:5,text:'无快递信息',},
      {id:6,text:'货物破讯拒签',},
      {id:7,text:'退运费'},
      {id:8,text:'大小/尺寸与商品不符'},
      {id:9,text:'颜色/图案/款式与商品描述不符'},
      {id:10,text:'材料与商品描述不符',},
      {id:11,text:'做工问题（水印、开线……）'},
      {id:12,text:'质量问题'},
      {id:13,text:'少件，漏发'},
      {id:14,text:'未按约定时间发货'},
      {id:15,text:'发票问题'},
      {id:16,text:'发错货'},
    ]
  }
  async componentDidMount(){
    await this.getInfo();
  }
  async getInfo(){
    await this.props.dispatch({
      type: 'order/mgetExchangeList',
      payload: {
        ids:[this.state.id]
      }
    });
    await this.props.dispatch({
      type: 'order/mgetOrderDetailList',
      payload: {
        ids:[get(this.props.refundInfoList[0],'order_detail_id')]
      }
    });
    await this.props.dispatch({
      type: 'goods/mgetGoodsListEntity',
      payload: [get(this.props.orderDetailList[0],'goods_id')]
    })
    this.setState({
      orderDetailList:this.props.orderDetailList[0],
      refundList:this.props.refundInfoList[0],
      goods_info:this.props.goodsList,
    })
    console.log(this.state.refundList)
    console.log(this.state.orderDetailList)
    console.log(this.state.goods_info)
  }
  /**
   *  SUMMIT  = 1 //已提交 / 等待审核
      PERMIT  = 2 //商家审核 通过
      REJECT  = 4 //商家审核 拒绝
      SUCCESS = 8 //成功 / 已退款/货
      D2D         = 1  //上门取件
      Contact     = 2  //自行退货 这个是return
   */
  
  render () {
    const {statusBarHeight, capsule} = this.state;
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='user-refund-detail-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='退款详情'
        ></Navbar>
        <View className='user-refund-detail'>
          <View className='status-tab'>
            {get(this.state.refundList,'status')==1?
              <View className='title'>
                等待商家审核
              </View>
            :''}
            {get(this.state.refundList,'status')==2?
              <View className='title'>
                商家审核通过
              </View>
            :''}
            {get(this.state.refundList,'status')==4?
              <View className='title'>
                商家拒绝申请
              </View>
            :''}
            {get(this.state.refundList,'status')==8?
              <View className='title'>
                退款成功
              </View>
            :''}
            <View className='date'>
              {formatTime(get(this.state.refundList,'update_time',''),'Y/M/D h:m:s')}
            </View>
          </View>
          <View className='refund-info-wrap'>
            <View className='title'>
              退款信息
            </View>

            <RefundListGood 
              key={this.state.goods_info}
              goodId={get(this.state.orderDetailList,'goods_id')} 
              speId={get(this.state.orderDetailList,'goods_specification_id')} 
              price={get(this.state.orderDetailList,'goods_amount')} 
              quality={get(this.state.orderDetailList,'purchase_qty')} 
              goodsInfo={this.state.goods_info}
              detailID={get(this.state.orderDetailList,'id')}
            /> 
            <View className='info-item-wrap'>
              <View className='info-item'>
                <View className='title'>退款原因</View>
                <View className='info'>{get(this.state.refundList,'message')}</View>
              </View>
              <View className='info-item'>
                <View className='title'>退款金额</View>
                <View className='info'>¥{Number(get(this.state.refundList,'return_amount')/100).toFixed(2)}</View>
              </View>
              <View className='info-item'>
                <View className='title'>申请时间</View>
                <View className='info'>{formatTime(get(this.state.refundList,'create_time',''),'Y/M/D h:m:s')}</View>
              </View>
              <View className='info-item'>
                <View className='title'>退货编号</View>
                <View className='info'>{get(this.state.refundList,'out_refund_no')}</View>
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default UserRefundDetail;