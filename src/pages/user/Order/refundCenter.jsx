import React, { Component } from 'react'
import { View, Image, Navigator} from '@tarojs/components'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import request from '../../../utils/request'
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
    currentIndex:1,
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
   await this.getExchangeList(1)
   await this.getRedunfList()
  }

  async getExchangeList(){
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
    this.setState({
      refundList:this.props.refundInfoList.filter(item => item.status == 1)
    })

  }

  //获取售后list
  async getRedunfList(){
    const detail_ids = this.state.refundList.map((arr) => {return arr.order_detail_id})
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
      goods_info:this.props.goodsList,
    })
    console.log(this.state.refundList)
    console.log(this.state.orderDetailList)
    console.log(this.state.goods_info)
  }

  //删除退款、售后记录
  handleDelete(eid){
    const handleChangeTab = () => this.handleChangeTab(this.state.currentIndex);
    try{
      Taro.showModal({
        title: '删除记录',
        //icon: 'success',
        content: '请确认该售后记录？',
        confirmText: '确认',
        cancelText:'取消',
        async success(res) {
          if(res.confirm){
            await request(`/exchange/del/${eid}`,{
              method: 'DELETE',
            })
            handleChangeTab()
            Taro.showToast({
              title: '记录删除成功',
              icon: 'none'
            })
           
          }  
        }
      })
    }
    catch(error){
      Taro.showToast({
        title: '记录删除失败',
        icon: 'none'
      })
    }
  }

  //切换tab
  async handleChangeTab(index){
    await this.getExchangeList()
    this.setState({
      currentIndex: index
    })
    if(index==1){
      this.setState({
        refundList:this.props.refundInfoList.filter(item => item.status == 1)
      })
      await this.getRedunfList();
    }
    else{
      this.setState({
        refundList:this.props.refundInfoList.filter(item => item.status == 2 || item.status ==4 || item.status ==8)
      })
      await this.getRedunfList();
    }
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
        <View className='refund-tab'>
          {this.state.currentIndex==1?
          <View className='list'>
            <View className='item-active' onClick={this.handleChangeTab.bind(this,1)}>待审核</View>
            <View className='item' onClick={this.handleChangeTab.bind(this,2)}>已审核</View>
          </View>
           :
          <View className='list'>
           <View className='item' onClick={this.handleChangeTab.bind(this,1)}>待审核</View>
           <View className='item-active' onClick={this.handleChangeTab.bind(this,2)}>已审核</View>
          </View>
           
        }
         
        </View>
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
                <View className='refund-delete' onClick={this.handleDelete.bind(this,item.id)}>
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