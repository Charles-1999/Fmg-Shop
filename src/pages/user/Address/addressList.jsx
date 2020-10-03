import React, { Component } from 'react'
import { View, Text, Image, MovableArea, MovableView} from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import './address.scss'
import { connect } from 'react-redux';
import Taro from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'


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
    console.log(addressList)
    this.setState({
      addressInfo:addressList
    })
  }
  async  delAddress(id){
    console.log(id)
    await this.props.dispatch({
      type: 'address/deleteAddressInfo',
      payload: {
        aid: id,
      }
    })
    const userId = Taro.getStorageSync('userId'); //获取当前用户信息
    console.log(userId)
    await this.props.dispatch({
      type: 'address/getAddressInfoUid',
      payload: {
        uid:userId
      }
    })
    const{ addressList } = this.props;
    this.setState({
      addressInfo:addressList
    })
  }
  handlePage(e,id){
    if(e == 'confirm'){
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length-2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        aid:id
      });
      Taro.navigateBack({//返回
        delta:1
      })
      // console.log(343)
      // Taro.navigateTo({
      //   url: `pages/cart/confirm/index?aid=${id}`,
      // });
     }

    if(e == 'add'){
      Taro.navigateTo({
        url: `/pages/user/Address/addAddress`,
      });
    }
    if(e == 'edit'){
      Taro.navigateTo({
        url: `/pages/user/Address/editAddress?id=${id}`,
      });
    }
  }

  
  touchMoveStartHandle = (e) => {
    if (e.touches.length == 1) {
      this.setState({
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
    }
  }

  touchMoveEndHandle(index,e) {
    const {addressInfo,startX,startY} = this.state;
    const touchMoveEndX = e.changedTouches[0].clientX; // 滑动变化X坐标
    const touchMoveEndY = e.changedTouches[0].clientY; // 滑动变化Y坐标
    const angle = this.angle({
      X: startX,
      Y: startY
    }, {
      X: touchMoveEndX,
      Y: touchMoveEndY
    });
    // 滑动超过50度角 return，防止上下滑动触发
    if (Math.abs(angle) > 50) return;
    if (Math.abs(touchMoveEndX - startX) < 1) return;
    addressInfo.forEach((address,a_index) => {
      if (touchMoveEndX > startX) {
        // 右滑
        // console.log('右滑');
        if (index == a_index) address.x = 0;
      } else {
        // 左滑
        // console.log('左滑');
        address.x = -120
        if (index != a_index) address.x = 0;
      }
    })
    // this.setData({
    //   addressInfo
    // })
  }


  /* 计算滑动角度
    start 起点坐标
    end 终点坐标
    Math.PI 表示一个圆的周长与直径的比例，约为 3.14159;PI就是圆周率π，PI是弧度制的π,也就是180°
  */
  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
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
          {this.state.addressInfo ? this.state.addressInfo.map((item,item_index) => (
            <MovableArea key={item.id}>
              <MovableView direction='horizontal' inertia outOfBounds x={item.x} onTouchStart={this.touchMoveStartHandle} onTouchEnd={this.touchMoveEndHandle.bind(this,item_index)}>
                <View className='address-list-item' key={item.id}  onClick={this.handlePage.bind(this,'confirm',item.id)}>
                  <View className='item' >
                    <View className='info'>
                      <View className='name-phone'>{item.name} | {item.phone}</View>
                      <View className='detail'>
                        {item.province_name}{item.city_name}{item.district_name}{item.detail}
                      </View>
                    </View>
                    <View className='edit' onClick={this.handlePage.bind(this,'edit',item.id)}>
                      <Image src='http://qiniu.daosuan.net/picture-1598883556000' style='width:40rpx;height:40rpx' />
                      <View className='text'>编辑</View>
                    </View>
                  </View>
      
                </View>
            </MovableView>
            <View className='out_view'>
              <View className='del' onClick={this.delAddress.bind(this,item.id)}>删除</View>
            </View>
             </MovableArea>
          )) : ''}
        </View>
        <View className='add-address' onClick={this.handlePage.bind(this,'add','')}>
          新增地址
        </View>
      </View>
    )
  }
}

export default AddressList;

