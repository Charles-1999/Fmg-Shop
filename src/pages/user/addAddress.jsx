import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { get } from 'lodash';
import './address.scss'
import { connect } from 'react-redux';
import Taro from '@tarojs/taro'; 
import { get as getGlobalData } from '../../global_data'
import Navbar from '../../components/navbar/navbar'
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
  }

  onSubmit (event) {
    console.log(this.state.value)
  }
  handleChange (value) {
    this.setState({
      value:''
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
          title='新增收货地址'
          showBack
        ></Navbar>
        <View className='add-address-list'>
          {/* <AtForm
            onSubmit={this.onSubmit.bind(this)}
          >
          <AtInput 
            name='name' 
            title='收货人姓名' 
            type='text' 
            placeholder='单行文本' 
            value={this.state.value} 
            onChange={this.handleChange.bind(this, 'name')} 
          />
          <AtInput 
            name='phone' 
            title='收货人电话' 
            type='text' 
            placeholder='单行文本' 
            value={this.state.value} 
            onChange={this.handleChange.bind(this, 'phone')} 
          />
          <AtButton formType='submit'>提交</AtButton>
        </AtForm> */}
        <AddressPicker province={this.state.province} city={this.state.city} chooseCity={this.callback}></AddressPicker>
        
        </View>
      </View>
    )
  }
}

export default AddAddressList;

