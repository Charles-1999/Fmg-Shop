import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Image } from '@tarojs/components'
import './searchbar.less'

import scan_img from '../../assets/icon/WechatIMG27.png'
import search_img from '../../assets/icon/搜索.png'

export default class Navbar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {marginRight,marginLeft} = this.props
        return (
            <View className='searchBar' style={{marginRight,marginLeft}}>
                <Input placeholder='搜索' />
                <Image className='scan' src={scan_img} mode='heightFix' />
                <Image className='search' src={search_img} mode='heightFix' />
            </View>
        )
    }
}