import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { get as getGlobalData } from '../../global_data'
import SearchBar from './searchbar'
import './navbar.less'
import './searchbar.less'

import back_img from '../../assets/icon/返回.png'

export default class Navbar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            windowWidth: getGlobalData('windowWidth'),
            capsule: getGlobalData('capsule'),
        }
    }

    back(){
        Taro.navigateBack()
    }

    render() {
        const { windowWidth, capsule } = this.state;
        const { statusBarHeight, capsuleHeight, title, color, showBack, showLogo, showTitle, showSearch} = this.props;
        return (
            <View className='navbar'>
                <View className='status' style={{ height: statusBarHeight }}></View>
                <View className='capsule' style={{ height: capsuleHeight }}>
                    { showLogo ? 
                        <View className='logo' style={{marginLeft: windowWidth - capsule.right}}>凤鸣谷</View>
                        : ''
                    }
                    { showBack ?
                        <View className='back' onClick={this.back} style={{ height: capsuleHeight, width: capsuleHeight }}>
                            <Image src={back_img}></Image>
                        </View>
                        : ''
                     }
                     { showTitle ?
                       <View className='title' style={{ lineHeight: capsuleHeight + 'px', color: color }}>{title}</View>
                       : ''
                     }
                    { showSearch ?  <SearchBar marginRight={windowWidth * 2 - capsule.right - capsule.left} marginLeft={windowWidth - capsule.right} />
                    :''}
                   
                </View>
            </View>
        )
    }
}

Navbar.defaultProps = {
    title: '标题',
    color: '#fff',
    showBack: false,
    showLogo: false
}