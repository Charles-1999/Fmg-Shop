import React, { Component } from 'react'
import { View, Text } from '@tarojs/components'

//import Menu from '../../components/menu/menu';

class FindListView extends Component {
  constructor() {
    super(...arguments)
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  render () {
    return (
      <View className='findlist'>
        发现
       {/* <Menu isActive={2} /> */}
      </View>
    )
  }
}
export default FindListView;

