import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { View, Button, Text, Swiper, SwiperItem } from '@tarojs/components'
import { AtGrid } from "taro-ui"
import './index.scss';

class Recommend extends Component {
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  handleClick (value) {
    this.setState({
      current: value
    })
  }

  render () {
    return (
      <View className='recommend-wrap'>
        <Swiper
          className='slide-photo'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          vertical={false}
          circular
          indicatorDots
          autoplay
        >
          <SwiperItem>
            <View className='demo-text-1'>
              <View className='photo-1'>
                111111
              </View>
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className='demo-text-2'>
            <View className='photo-2'>
                222222
              </View>
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className='demo-text-3'>
            <View className='photo-3'>
                333333
              </View>
            </View>
          </SwiperItem>
        </Swiper>
        <View className='squareCard'>
          <View className='at-row'>
            <View className='at-col'>
              <View className='card-photo'>
              </View>
              <View className='card-text'>
                香草小镇
              </View>
            </View>
            <View className='at-col'>
            <View className='card-photo'>
              </View>
              <View className='card-text'>
                香草小镇
              </View>
            </View>
            <View className='at-col'>
            <View className='card-photo'>
              </View>
              <View className='card-text'>
                香草小镇
              </View>
            </View>
            <View className='at-col'>
            <View className='card-photo'>
              </View>
              <View className='card-text'>
                香草小镇
              </View>
            </View>
          </View>
          <View className='at-row'>
            <View className='at-col'>
              <View className='card-photo'>
              </View>
              <View className='card-text'>
                香草小镇
              </View>
            </View>
            <View className='at-col'>
            <View className='card-photo'>
              </View>
              <View className='card-text'>
                香草小镇
              </View>
            </View>
            <View className='at-col'>
            <View className='card-photo'>
              </View>
              <View className='card-text'>
                香草小镇
              </View>
            </View>
            <View className='at-col'>
            <View className='card-photo'>
              </View>
              <View className='card-text'>
                香草小镇
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
export default Recommend;

