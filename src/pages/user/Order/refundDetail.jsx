import React, { Component } from 'react'
import { View, Text, Image, Checkbox } from '@tarojs/components'
import { get } from 'lodash';
import './refundDetail.scss'
import { connect } from 'react-redux';
import Taro, { Current } from '@tarojs/taro'; 
import request, { getGoodsList } from '../../../utils/request'
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'

@connect(({  order,goods }) => ({
  ...order,...goods,
}))
class RefundDetail extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    order_detail:{}, //订单详情
    gId:0, //商品id
    speId:0, //商品speid
    ooId:0, //总订单id
    oId:Current.router.params.oId,  //当前订单id
    dId:Current.router.params.dId, //当前订单order_detail dId:
    status:'请选择', //货物状态
    reason:'请选择', //退款原因
    money:0, //退款金额
    quantity:1 , //退款商品的数量
    isOpenStatus: false, //商品状态---弹窗是否弹出
    isOpenReason: false, //退款原因---弹窗是否弹出
    statusCheck:0, //0 为请选择状态
    reasonCheck:0, //0 为请选择状态
    data:[
      {
        id:1,
        title:'已收到货',
        reason:[
          {id:1,text:'不喜欢不想要',},
          {id:2,text:'空包',},
          {id:3,text:'未按约定时间发货',},
          {id:4,text:'快递未送达',},
          {id:5,text:'无快递信息',},
          {id:6,text:'货物破讯拒签',},

        ]
      },
      {
        id:2,
        title:'未收到货物',
        reason:[
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
    ]
    //hiddenFloat:true, 
  } 
  async componentDidMount(){
    await this.getOrderInfo();
    await this.getGoodInfo();
    await this.getRefundMoney();
  }

  //获取订单信息
  async getOrderInfo(){
    console.log(this.state.dId)
    await this.props.dispatch({
      type: 'order/mgetOrderList',
      payload: {
        ids:[parseInt(this.state.oId)],
      }
    })
    let orderList = this.props.orderInfoList[0]
    console.log(orderList)
    this.setState({
      order_detail:get(orderList,'order_detail',[]).filter(item => item.id == this.state.dId)[0]
    })
    console.log(this.state.order_detail)
    this.setState({
      gId: get(this.state.order_detail,'goods_id'),
      speId: get(this.state.order_detail,'goods_specification_id'),
      ooId: get(this.state.order_detail,'order_id'),
      quantity: get(this.state.order_detail,'purchase_qty')
    })
  }

  //获取商品信息
  async getGoodInfo(){
    const goodsInfo = await getGoodsList([parseInt(this.state.gId)])
    const specification_list = get(goodsInfo[0],'specification',[])
    const spe_index = specification_list.findIndex(item => item.id == this.state.speId);
    const spe = get(specification_list[spe_index],'specification')
    this.setState({
      goods_info:goodsInfo[0],
      spe_info:spe,
    })
    console.log(this.state.goods_info)
  }

  //计算退款金额
  async getRefundMoney(){
    const goods_amount = get(this.state.order_detail,'goods_amount')
    const coupon = get(this.state.order_detail,'coupon')
    const qty = get(this.state.order_detail,'purchase_qty')
    this.setState({
      money: ((goods_amount-coupon)/qty*this.state.quantity/ 100).toFixed(2)
    })
  }

  //弹窗
  handleOpen (value) {
    console.log(value)
    if(value=='status'){
      this.setState({
        isOpenStatus: true
      })
    }
    else if (value=='reason'){
      this.setState({
        isOpenReason: true
      })
    }

  }
  // 隐藏选择框
  hiddenFloat = (value) => {
    if(value='status'){
      this.setState({
        isOpenStatus: false
      })
    }
    else if (value='reason'){
      this.setState({
        isOpenReason: false
      })
    }
 
  }
  //货品状态选择框
  statusCheck=(value)=>{
    this.setState({
      statusCheck:value,
      isOpenStatus: false,
      reasonCheck:0,
    })
  }
  //原因状态选择框
  reasonCheck=(value)=>{
    this.setState({
      reasonCheck:value,
      isOpenReason: false
    })
  }

  
  render () {
    const {statusBarHeight, capsule} = this.state;
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='refund-Detail-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='退款申请'
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
            <View className='quantity'>x{get(this.state.order_detail,'purchase_qty')}</View>
          </View>
        </View>
        <View className='info-wrap'>
          <View className='info-text'>退款信息</View>
          <View className='info'>
            <View className='info-item' onclick={this.handleOpen.bind(this,'status')}>
              <View className='title'>货物状态*</View>
              {this.state.statusCheck==0?
              <View className='null'>请选择</View>
              :
              <View className='info'>{this.state.data.filter(item=>item.id==this.state.statusCheck)[0].title}</View>
              }
              
              <Image src='http://qiniu.daosuan.net/picture-1598883337000' className='more' />
            </View>
            <View className='info-item' onclick={this.handleOpen.bind(this,'reason')}>
              <View className='title'>退款原因*</View>
              {this.state.reasonCheck==0?
              <View className='null'>请选择</View>
              :
              <View className='info'>{this.state.data.filter(item=>item.id==this.state.statusCheck)[0].reason.filter(reason=>reason.id==this.state.reasonCheck)[0].text}</View>
              }
              <Image src='http://qiniu.daosuan.net/picture-1598883337000' className='more' />
            </View>
            <View className='info-item'>
              <View className='title'>退款金额*</View>
              <View className='money'>¥{this.state.money}</View>
            </View>
            <View className='info-item' >
              <View className='title'>退货方式</View>
              <View className='info'>自行寄回</View>
              {/* <Image src='http://qiniu.daosuan.net/picture-1598883337000' className='more' /> */}
            </View>
          </View>     
        </View>
        {/* <View className='des-pic-wrap'>

        </View> */}

        <View className={this.state.isOpenStatus ? 'active float_wrap' : 'float_wrap'}>
          {/* 遮罩层 */}
          <View className='mask' onClick={this.hiddenFloat.bind(this,'status')}></View>
          {/* container层 */}
          <View className={this.state.isOpenStatus ? 'container active' : 'container'}>
            <View className='title'>货物状态</View>
            <View className='status-wrap'>
              {this.state.data.map(item=>(
                <View className='select-item' key={item.id}>
                  <View className='select-title'>{item.title}</View>
                  {this.state.statusCheck==item.id?
                    <Image src='http://qiniu.daosuan.net/picture-1606717726000' className='check' onClick={this.statusCheck.bind(this,item.id)} />:
                    <Image src='http://qiniu.daosuan.net/picture-1606717705000' className='check' onClick={this.statusCheck.bind(this,item.id)} />
                  }
                  
                </View>
              ))}
             
            </View>
             
          </View>
        </View>
        {
          this.state.statusCheck!==0 ?
          <View className={this.state.isOpenReason ? 'active float_wrap' : 'float_wrap'}>
          {/* 遮罩层 */}
            <View className='mask' onClick={this.hiddenFloat}></View>
            {/* container层 */}
            <View className={this.state.isOpenReason ? 'container active' : 'container'}>
              <View className='title'>退款原因</View>
              <View className='status-wrap'>
                {this.state.data.filter(e=>e.id==this.state.statusCheck)[0].reason.map(item=>(
                  <View className='select-item' key={item.id}>
                  <View className='select-title'>{item.text}</View>
                    {this.state.reasonCheck==item.id?
                      <Image src='http://qiniu.daosuan.net/picture-1606717726000' className='check' onClick={this.reasonCheck.bind(this,item.id)} />:
                      <Image src='http://qiniu.daosuan.net/picture-1606717705000' className='check' onClick={this.reasonCheck.bind(this,item.id)} />
                    }
                  </View>
                ))}
              
              </View>
            </View>
          </View>:''
        }
       


      </View>
    )
  }
}

export default RefundDetail;