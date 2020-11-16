import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtTextarea } from 'taro-ui'
import { get } from 'lodash';
import './address.scss'
import { connect } from 'react-redux';
import Taro from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import AddressPicker from './AddressPicker'


@connect(({ address }) => ({
  ...address,
}))
class AddAddressList extends Component {
  static defaultProps = {
    iconList: [],
  };
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    addressInfo: [],
    value: '',
    provinceCode: 0,
    cityCode: 0,
    province: '',
    city: '',
    name: '',
    phone: '',
    detail: '',
    phoneIsRight: 1,
  }

  handleChange (e,value) {
    if(e === 'name') {
      this.setState({
        name:value,
      })
    }
    if(e == 'phone') {
      this.setState({
        phone:value,
      })
    }
    if(e == 'detail') {
      this.setState({
        detail:value,
      })
    }
  
  }

  checkphone(value){
    console.log(value)
    if(!(/^1[34578]\d{9}$/.test(value))){
      this.setState({
        phoneIsRight:false
      })
    }
    else if((/^1[34578]\d{9}$/.test(value))){
      this.setState({
        phoneIsRight:true
      })
    }
  }

  handleOk = () => {
    if(!(/^1[34578]\d{9}$/.test(this.state.phone))){
      Taro.showToast({
        title: '手机号格式错误，请重新输入',
        icon: 'none'
      })
    }
    else{
    this.props.dispatch({
      type: 'address/setAddressInfo',
      payload: {
        province_id: this.state.provinceCode,
        city_id: this.state.cityCode,
        country_id: 1,
        district_id: this.state.areaCode,
        detail: this.state.detail,
        name:this.state.name,
        phone: this.state.phone,
        uid: Taro.getStorageSync('userId'),
      }
    }).then(()=>{
      Taro.navigateBack();
    })
  }
}
  callback =(pName, pCode, cName, cCode, aName, aCode )=> {
    //this.getCityStore(cCode, this.state.longitudeLatitude);
    this.setState({ 
    provinceCode: pCode,
    cityCode: cCode,
    areaCode: aCode,
    province: pName,
    city: cName,
    area: aName,
    }, () => {
   console.log(this.state);
});
 }
 
  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='add-address-list-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          title='收货地址新增'
          showBack
        ></Navbar>
        <View className='add-address-list'>
          <View className='name-item'>
            <View className='title'>收货人姓名</View>
            <AtInput 
              name='name' 
              type='text' 
              value={this.state.name} 
              onChange={this.handleChange.bind(this, 'name')} 
            />
          </View>
          <View className='phone-item'>
            <View className='title'>收货人电话</View>
            <AtInput 
              name='phone' 
              type='text' 
              value={this.state.phone} 
              onBlur={this.checkphone.bind(this)}
              onChange={this.handleChange.bind(this, 'phone')} 
            />
            {!this.state.phoneIsRight?
             <View className='warn'>手机号格式错误</View>:''
            }
           
          </View>
          <View className='address-list-item'>
            <View className='title'>收货人地址</View>
            <AddressPicker province={this.state.province} city={this.state.city} area={this.state.area} chooseCity={this.callback}></AddressPicker>
          </View>
          <View className='address-detail-item'>
            <View className='title'>详细地址（门牌号/街道信息等）</View>
              <AtTextarea 
                name='detail' 
                type='text' 
                value={this.state.detail} 
                onChange={this.handleChange.bind(this, 'detail')} 
              />
          </View>
          <View className='ok'  onClick={this.handleOk.bind(this)} >提交</View>   
        
        </View>
      </View>
    )
  }
}

export default AddAddressList;
