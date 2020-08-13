import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import './index.scss'
import Taro from '@tarojs/taro'; 
import headerjpg from '../../assets/img/TouXiang.jpg'

class UserInfoList extends Component {
  
  render () {
    return (
      <View className='userInfoList'>
        <AtList>
        <AtListItem
          title='头像'
          arrow='right'
          thumb='https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
        />
         <AtListItem title='手机号' arrow='right'  extraText='13925531258' />
         <AtListItem title='会员码' arrow='right'  />
         <AtListItem title='姓名' arrow='right'  extraText='请填写' />
         <AtListItem title='性别' arrow='right'  extraText='女' />
         <AtListItem title='生日' arrow='right'  extraText='请选择生日' />
         <AtListItem title='地区' arrow='right'  extraText='请选择地区' />
         <AtListItem title='微信号' arrow='right'  extraText='请填写' />
         <AtListItem title='收货地址' arrow='right'  extraText='' />
        </AtList>
{/*        
        <View className='list-item'>
          <View className='title'>头像</View>
          <View className='info'><AtAvatar image={headerjpg} size='small' circle='true'></AtAvatar></View>
          <View className='right'>
            <AtIcon value='chevron-right' size='20' color='black'></AtIcon>
          </View>
        </View> */}
      </View>
    )
  }
}

export default UserInfoList;

