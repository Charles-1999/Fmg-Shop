import React, { Component } from 'react'
import { View, Text, Image, Checkbox } from '@tarojs/components'
import { get } from 'lodash';
import './refundDetail.scss'
import { connect } from 'react-redux';
import Taro, { Current } from '@tarojs/taro'; 
import request, { getGoodsList } from '../../../utils/request'
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import RefundComment from './refundComment'
import { message } from 'taro-ui';

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
    files:[],
    pictures:[],
    message:'',
    service_type:parseInt(Current.router.params.status),
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
    console.log(value)
    this.setState({
      statusCheck:value,
      isOpenStatus: false,
      status:false,
      reasonCheck:0,
    })
  }
  //原因状态选择框
  reasonCheck=(value)=>{
    console.log(value)
    this.setState({
      reasonCheck:value,
      status:true,
      isOpenReason: false
    })
  }

  callback=(content,files,upLoadImg)=>{
    this.setState({
      message:content,
      files:files,
      upLoadImg:upLoadImg,
    })
  }
  //提交申请
  async handleCheck(){
    if(this.state.statusCheck==0){
      Taro.showToast({
        title: '请选择货物状态',
        icon: 'none',
        duration: 2000
      })
    }
    else if(this.state.reasonCheck==0){
      Taro.showToast({
        title: '请选择退货原因',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      this.toUpload();
    }
  }
  async handleSubmit(){
    //退换货接口
    const pictures=[]
    this.state.pictures.map((item,index)=>{
      const obj = {}
      obj.picture = item
      obj.order = index
      pictures.push(obj)
    })
    console.log(pictures)

    try{
      await this.props.dispatch({
        type: 'order/exchangeOrder',
        payload:{
          oId:this.state.oId,
          ooId:this.state.ooId,
          dId:this.state.dId,
          return_amount:parseFloat(this.state.money)*100,
          service_type:parseInt(Current.router.params.status),
          goods_stats: this.state.status,
          reason: this.state.reasonCheck,
          return_mode:2,//默认自行寄回
          pictures:pictures,
          message:this.state.message,
        }
      })
      if(this.props.exchangeId!==0){
        Taro.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        }).then(()=>{
          Taro.redirectTo({
            url:'/pages/user/Order/myOrder?status=0'
          })
        })
      }
    }
    catch(err){
      console.log(err)
      Taro.showToast({
        title: '提交失败!'+err.data.message,
        icon:'none',
        duration: 2000
      })
    }
  }

  //图片的上传
  async toUpload () {
    console.log(this.state.files)
    if(this.state.files.length>0){
      const rootUrl = get('https://upload-z2.qiniup.com') // 服务器地址
      await this.uploadLoader({rootUrl,path:this.state.files})
    }else{
      this.handleSubmit();
    }
  }
  //图片的上传+提交
  async uploadLoader(data){
    let that = this
    let i = data.i ? data.i : 0 // 当前所上传的图片位置
    let success=data.success?data.success:0//上传成功的个数
    let fail=data.fail?data.fail:0;//上传失败的个数
    Taro.showLoading({
      title: `正在上传第${i+1}张`
    })
    const token =  await request(`/goods/resources/qiniu/upload_token`, {
      method: 'GET',
    })
    const timeCode = new Date().getTime();
    //发起上传
    await Taro.uploadFile({
      url:'https://upload-z2.qiniup.com',
      header:{
        'content-type': 'multipart/form-data',
      },
      name:'file',
      filePath:data.path[i].url,
      formData: {
        action:'z2',
        token:token.token,
        file:data.path[i].url,
        key:'comment-pic-'+timeCode,
      },
      success: (resp) => {
         //图片上传成功，图片上传成功的变量+1
          let resultData= JSON.parse(resp.data)
          if(resp.statusCode == 200 ){
            success++;
            this.setState({
              pictures:[...this.state.pictures,resultData.key]
            })
            console.log(this.state.pictures)
            this.setState((prevState)=>{
              let oldUpload = prevState.upLoadImg
              oldUpload.push(resultData.key)
              return({
                upLoadImg:oldUpload
              })
            },()=>{
            })
          }else{
            fail++;
          }
      },
      fail: (err) => {
          fail++;//图片上传失败，图片上传失败的变量+1
          console.log(err)
          Taro.showToast({
            title: '上传失败',
            duration: 10000
          })
      },
      complete: () => {
        Taro.hideLoading()
        i++;//这个图片执行完上传后，开始上传下一张
        if(i==data.path.length){   //当图片传完时，停止调用
          if(fail == 0){
            Taro.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
            console.log('成功：'+success+" 失败："+fail);
            this.handleSubmit();
          }
          else{
            Taro.showToast({
              title: '图片上传失败',
              icon: 'none',
              duration: 3000
            })
            this.setState({
              pictures:[],
            })
            console.log('成功：'+success+" 失败："+fail);
          }
        }
        else{//若图片还没有传完，则继续调用函数
          data.i=i;
          data.success=success;
          data.fail=fail;
          that.uploadLoader(data);
        }
      }
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
            {this.state.service_type!==1?
              <View className='info-item' >
                <View className='title'>退货方式</View>
                <View className='info'>自行寄回</View>
                {/* <Image src='http://qiniu.daosuan.net/picture-1598883337000' className='more' /> */}
              
              </View>
            :''}
           
          </View>     
        </View>
        <View className='content-pic-wrap'>
          <View className='info-text'>补充描述和凭证</View>
          <RefundComment getInfo={this.callback}/>
        </View>
        <View className='submit' onclick={this.handleCheck.bind(this)}>提交</View>
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