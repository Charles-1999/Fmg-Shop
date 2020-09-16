import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import './address.scss'
import { connect } from 'react-redux';
import Taro from '@tarojs/taro'; 
import { get as getGlobalData } from '../../global_data'
import Navbar from '../../components/navbar/navbar'


@connect(({ address }) => ({
  ...address,
}))
class AddressList extends Component {
  static defaultProps = {
    provinceList: [],
    cityList: [],
    areaList: [],
  };
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    // addressList:[
    //   // {id:1,country_id:1,province_id:4,city_id:15,area_id:214,detail:'详细地址111222',name:'eva',phone:'13925531258'},
    //   // {id:2,country_id:1,province_id:14,city_id:125,area_id:36,detail:'详细地址111222',name:'kkk',phone:'13925521258'},
    //   // {id:3,country_id:1,province_id:12,city_id:99,area_id:1005,detail:'详细地址111222',name:'qqdd',phone:'139251331258'},
    //   // {id:4,country_id:2,province_id:9,city_id:74,area_id:778,detail:'详细地址111222',name:'sss',phone:'139213211258'},
    // ],
    addressInfo: [],
  }
  async componentDidMount () {
    const userId = Taro.getStorageSync('userId'); //获取当前用户信息
    await this.props.dispatch({
      type: 'address/getAddressInfoUid',
      payload: {
        uid:userId
      }
    })
    const{ addressList } = this.props;
    for(var i=0; i < addressList.length; i++){
      const info={id:i,address:'',name:'',phone:''};
      this.props.dispatch({
        type: 'address/getProvinceList',
        payload: {
          country_id: addressList[i].country_id,
        }
      })
      const {provinceList} = this.props; 
      info.address += (get(provinceList.filter(item => item.id == get(addressList[i],'province_id'))[0],'name','')).toString();
      await this.props.dispatch({
        type: 'address/getCityList',
        payload: {
          province_id: get(addressList[i],'province_id'),
        }
      })
      const {cityList} = this.props; 
      info.address += (get(cityList.filter(item => item.id == get(addressList[i],'city_id'))[0],'name','')).toString(); 
      await this.props.dispatch({
        type: 'address/getAreaList',
        payload: {
          city_id: get(addressList[i],'city_id'),
        }
      })
      const {areaList} = this.props; 
      info.address += (get(areaList.filter(item => item.id == get(addressList[i],'area_id'))[0],'name','')).toString();
      info.name = get(addressList[i],'name','');
      info.phone =  get(addressList[i],'phone','');
      info.address +=  get(addressList[i],'detail','');
      info.id = get(addressList[i],'id','');
      this.setState({
        addressInfo:[...this.state.addressInfo,info]
      })
    }

  }

  handlePage(e,id){
    if(e == 'add'){
      Taro.navigateTo({
        url: `/pages/user/addAddress`,
      });
    }
    if(e == 'edit'){
      Taro.navigateTo({
        url: `/pages/user/editAddress?id=${id}`,
      });
    }
  }

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    return (
      <View className='address-list-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          title='收货地址'
          showBack
        ></Navbar>
        <View className='address-list'>
          {this.state.addressInfo.map(item => (
            <View className='address-list-item' key={item.id}>
              <View className='item'>
                <View className='info'>
                  <View className='name-phone'>{item.name} | {item.phone}</View>
                  <View className='detail'>
                    {item.address}
                  </View>
                </View>
                <View className='edit' onClick={this.handlePage.bind(this,'edit',item.id)}>
                  <Image src='http://qiniu.daosuan.net/picture-1598883556000' style='width:40rpx;height:40rpx' />
                  <View className='text'>编辑</View>
                </View>
              </View>
   
            </View>
          ))}
        </View>
        <View className='add-address' onClick={this.handlePage.bind(this,'add','')}>
          新增地址
        </View>
      </View>
    )
  }
}

export default AddressList;

