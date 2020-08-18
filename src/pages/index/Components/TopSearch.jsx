import React, { Component } from 'react'
import { View } from '@tarojs/components'
import { AtSearchBar, AtIcon } from 'taro-ui'
import '../index.scss'

class TopSearch extends Component {
  constructor () {
    super(...arguments);
    this.state={
      value:'',
    }
  }
  onChange (value) {
    this.setState({
      value: value
    })
  }

  render () {
    return (
      <View className='topSearch'>
          <View className='fmg-logo'>
            LOGO
          </View>
          <View className='search-box'>
            <AtSearchBar
              value={this.state.value}
              maxLength={50}
              onChange={this.onChange.bind(this)}
              placeholder='香草小镇'
            />
          </View>
          <View className='bell'><AtIcon value='bell' size='20' color='#9999'></AtIcon></View>
      </View>
    )
  }
}

export default TopSearch;

