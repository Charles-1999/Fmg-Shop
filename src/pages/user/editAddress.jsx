import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtForm, AtInput, AtButton, AtTextarea } from 'taro-ui'
import { get } from 'lodash';
import './address.scss'
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../global_data'
import Navbar from '../../components/navbar/navbar'
import AddressPicker from './AddressPicker'

@connect(({ address }) => ({
  ...address,
}))
class editAddress extends Component {
  static defaultProps = {
    iconList: [],
  };
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    currentId: Current.router.params.id,
    addressInfo: [],
    value: '',
    provinceCode: 0,
    cityCode: 0,
    province: '',
    city: '',
    name: '',
    phone: 0,
    detail: '',
  }
  async componentDidMount () {
    const userId = Taro.getStorageSync('userId'); //获取当前用户信息
    this.setState({
      currentId: Current.router.params.id,
    })
    this.props.dispatch({
      type: 'address/getAddressInfoUid',
      payload: {
        uid:userId
      }
    })
    const{ addressList } = this.props;
    const addressInfo = addressList.filter(item => item.id == this.state.currentId)[0]
    this.setState({
      name: get(addressInfo,'name',''),
      phone: get(addressInfo,'phone'),
      detail: get(addressInfo,'detail',''),
    })
    
  }

  onSubmit (event) {
    // console.log(this.state.value)
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

  handleOk = () => {
    this.props.dispatch({
      type: 'address/editAddressInfo',
      payload: {
        province_id: this.state.provinceCode,
        city_id: this.state.cityCode,
        country_id: 1,
        district_id: this.state.areaCode,
        detail: this.state.detail,
        name:this.state.name,
        phone: parseInt(this.state.phone),
        aid: this.state.currentId,
      }
    }).then(()=>{
      console.log('add!!!')
      Taro.navigateTo({
        url: `/pages/user/addressList`,
      });
    })
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
          title='收货地址编辑'
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
              onChange={this.handleChange.bind(this, 'phone')} 
            />
          </View>
          <View className='address-list-item'>
            <View className='title'>收货人地址</View>
            <AddressPicker currentId={this.state.currentId} chooseCity={this.callback}></AddressPicker>
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
          <View className='ok'  onClick={this.handleOk.bind(this)} >保存</View>
     
        
        </View>
      </View>
    )
  }
}

export default editAddress;

