import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtTextarea, AtImagePicker} from 'taro-ui'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import request, { getGoodsList } from '../../../utils/request'
import ListGood from './list_good'
import './comment.scss'


@connect(({ order, goods }) => ({
  ...order,
}))
class Comment extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    userId: Taro.getStorageSync('userId'),
    good_id:Current.router.params.id,  //当前订单id
    content:'',
    tag:0,
    tagInfo:[
      {id:1,title:'好评'},
      {id:2,title:'中评'},
      {id:3,title:'差评'}
    ],
    goods_info:{},
    files: [],
    showUploadBtn:true,
    upLoadImg:[], 
    pictures:[], //上传到数据库的图片数组
  }
  async componentDidMount () {
    this.getOrderInfo();
     // 获取七牛Token
   
  }
  unique(arr) {
    const res = new Map();
    return arr.filter((a) => !res.has(a) && res.set(a,1))
  }
 //获取商品信息
  async getOrderInfo(){
    //const goodsInfo = getGoodsList([parseInt(this.state.good_id)])
    const goodsInfo = await request('/goods/_mget',{ 
      body: { ids: [parseInt(this.state.good_id)] }, 
      method: 'POST' 
    })
    console.log(goodsInfo)
    this.setState({
      goods_info:goodsInfo[0]
    })
    console.log(this.state.goods_info)
  }
 
  //为用户创建评论
  async setComment(){
    if(this.state.tag == 0){
      Taro.showToast({
        title: '请选择一个标签',
        icon:''
      })
    }
    else {
      await request(`/comment/info/${this.state.good_id}`, {
        method: 'POST',
        body:{
          //good_id:parseInt(this.state.order_id),
          content:this.state.content,
          tag:this.state.tag,
          pictures:this.state.pictures,
        }
      }).then(()=>{
        Taro.showToast({
          title: '评价成功',
          icon: 'success'
        })
        
      })
    }
  }
  //修改tag
  changeTag=(id)=>{
    if(id == this.state.tag)[
      this.setState({
        tag:0,
      })
    ]
    else{
      this.setState({
        tag:id,
      })
    }
   
    console.log(id)
  }
  //评论
  handleChange =(value) =>{
    this.setState({
      content:value,
    })
  }

   // 拿到子组件上传图片的路径数组
   getOnFilesValue = (value) => {
    this.setState({
      files: value
    },() => {
      console.log(this.state.files)
    })

  }
  onChange (v,doType,index) { // doType代表操作类型，移除图片和添加图片,index为移除图片时返回的图片下标
    if(doType==='remove'){
      this.setState((prevState)=>{
        let oldSendImg = prevState.upLoadImg
        oldSendImg.splice(oldSendImg[index],1) // 删除已上传的图片地址
        return ({
          files:v,
          upLoadImg:oldSendImg
        })
      },()=>{
        const {files} = this.state
        //this.setFatherUploadSrc()// 设置删除数据图片地址
        if(files.length >=9){  // 最多三张图片 隐藏添加图片按钮
          this.setState({
            files:this.state.files.splice(0,9),
            showUploadBtn:false
          })
        }else if(files.length == 0){
          this.setState({
            upLoadImg:[]
          })
        }else{
          this.setState({
            showUploadBtn:true
          })
        }
      })
    }else{
      v.map((item, index)=>{
        if (item.url.indexOf(".pdf") > -1 || item.url.indexOf(".PDF") > -1) {
          // v[index].url = require("../../../assets/img/fmgLoginLogo.png")
        }
      })
      this.setState(()=>{
        return ({
          files:v
        })
      },()=>{
        const {files} = this.state
        if(files.length >= 9){  // 最多三张图片 隐藏添加图片按钮
          this.setState({
            files:this.state.files.splice(0,9),
            showUploadBtn:false
          })
        }else{
          this.setState({
            showUploadBtn:true
          })
        }
      })
    }
  }
  // 选择失败回调
  onFail (mes) {
    console.log(mes)
  }
  // 点击图片回调
  onImageClick (index, file) {
    let imgs = []
    this.state.files.map((item, index) => {
      imgs.push(item.file.path)
    })
    if (imgs[index].indexOf(".pdf") > -1 || imgs[index].indexOf(".PDF") > -1) {
      Taro.downloadFile({
        url: imgs[index],
        success: function (res) {
          let filePath = res.tempFilePath
          Taro.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        }
      })
    }else{
      Taro.previewImage({
        //当前显示图片
        current: imgs[index],
        //所有图片
        urls: imgs
      })
    }
  }
  async toUpload () {
    const { files } = this.state
    if(files.length>0){
      //this.props.onFilesValue(files)
      const rootUrl = get('http://upload-z2.qiniup.com') // 服务器地址
      //const cookieData = Taro.getStorageSync('token')  // 图片上传需要单独写入token
      await this.uploadLoader({rootUrl,path:files})
    }else{
      this.setComment()
    }
  }
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
    console.log(token)
    const timeCode = new Date().getTime();
    console.log(timeCode)
    //发起上传
    //const token = getGlobalData('qiniuTokenData');  //从缓存中获取的token
    await Taro.uploadFile({
      url:'http://upload-z2.qiniup.com',
      header:{
        'content-type': 'multipart/form-data',
      },
      name:'file',
      filePath:data.path[i].url,
      formData: {
        action:'z2',
        token:token.token,
        file:data.path[i].url,
        key:'comment-pic'+timeCode,
      },
      success: (resp) => {
         //图片上传成功，图片上传成功的变量+1
          let resultData= JSON.parse(resp.data)
          console.log(resultData)
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
              // setSate会合并所有的setState操作，所以在这里等待图片传完之后再调用设置url方法
              /*
              * 该处十分重要
              **/
              //this.setFatherUploadSrc()// 设置数据图片地址字段
            })
          }else{
            fail++;
          }
      },
      fail: () => {
          fail++;//图片上传失败，图片上传失败的变量+1
      },
      complete: () => {
          Taro.hideLoading()
          i++;//这个图片执行完上传后，开始上传下一张
          if(i==data.path.length){   //当图片传完时，停止调用
            Taro.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 2000
            })
            console.log('成功：'+success+" 失败："+fail);
            this.setComment()
         
          }else{//若图片还没有传完，则继续调用函数
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
      <View className='comment' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='评价'
        ></Navbar>
        <View className='comment-wrap'>
          <View className='goods-wrap'>
            <Image src={'http://qiniu.daosuan.net/'+get(this.state.goods_info,'cover','')} />
            <View className='name'>{get(this.state.goods_info,'name','')}</View>
          </View>
          <View className='tag-wrap'>
          {this.state.tagInfo.map(item => (
            <View key={item.id}>
              {item.id == this.state.tag ?  
                <View className='tag-active' key={item.id} onClick={this.changeTag.bind(this,item.id)}>
                {item.title}
                </View>          
                :
                <View className='tag' onClick={this.changeTag.bind(this,item.id)}>
                  {item.title}
                </View> 
              }
            </View>
          ))}
        </View>
        <View className='content-wrap'>
          <AtTextarea 
            name='content'
            placeholder='请写下您的评价吧' 
            type='text' 
            value={this.state.content} 
            onChange={this.handleChange.bind(this)} 
          />
        </View>
        {/* <View className='addimg' onClick={this.handleOperaClick.bind(this,'portrait')}>点击选择图片</View> */}
        <AtImagePicker
          multiple={false}
          length={3}  //单行的图片数量
          files={this.state.files}
          onChange={this.onChange.bind(this)}
          onFail={this.onFail.bind(this)}
          onImageClick={this.onImageClick.bind(this)}
          showAddBtn={this.state.showUploadBtn} //是否显示添加图片按钮
        />
        {/* <ChooseImage chooseImg={this.state.chooseImg} onFilesValue={this.getOnFilesValue.bind(this)} /> */}
        <View className='submit' onClick={this.toUpload.bind(this)}>
          提交
        </View>

        </View>
       
      </View>
    )
  }
}

export default Comment;