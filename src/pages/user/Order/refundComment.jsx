import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtTextarea, AtImagePicker} from 'taro-ui'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro';
import request from '../../../utils/request'

import './comment.scss'


@connect(({ order }) => ({
  ...order,
}))
class RefundComment extends Component {
  state = {
    content:'',
    files: [],
    showUploadBtn:true,
    upLoadImg:[],
    pictures:[], //上传到数据库的图片数组
  }
  async componentDidMount () {
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
        if(files.length >=3){  // 最多三张图片 隐藏添加图片按钮
          this.setState({
            files:this.state.files.splice(0,3),
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
        if(files.length >= 3){  // 最多三张图片 隐藏添加图片按钮
          this.setState({
            files:this.state.files.splice(0,3),
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
  render () {
    this.props.getInfo(this.state.content,this.state.files,this.state.upLoadImg);
    return (
      <View className='comment'>
        <View className='content-wrap'>
          <AtTextarea
            name='content'
            placeholder='补充描述，有助于商家更好地处理售后问题'
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
      </View>
    )
  }
}

export default RefundComment;
