import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components'
import Menu from '../../components/menu/menu'
import './index.scss'
import UserList from '../pages/user/index'

class Home extends Component {
  constructor () {
    super(...arguments)
  }
  render () {
    return (
      <View className='home'>
        <UserList />
        <Menu isActive={0} />
      </View>

    )
  }
}
export default Home;

