import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
// import { set as setGlobalData, get as getGlobalData } from '../../global_data'
import './navbar.less'

export default class Navbar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { statusBarHeight, capsuleHeight, title, color } = this.props;
        return (
            <View className="navbar">
                <View className="status" style={{ height: statusBarHeight }}></View>
                <View className="capsule" style={{ height: capsuleHeight }}>
                    <View className="title" style={{ lineHeight: capsuleHeight + 'px', color: color }}>{title}</View>
                </View>
            </View>
        )
    }
}

Navbar.defaultProps = {
    title: '标题',
    color: '#fff'
}