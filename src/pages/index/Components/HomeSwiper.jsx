import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components'
import { Swiper, SwiperItem } from 'taro-ui'
import '../index.scss'


class HomeSwiper extends Component {

  state={
    bannerList:[
        {id:1,title:'轮播一'},
        {id:2,title:'轮播二'},
        {id:3,title:'轮播三'},
        {id:4,title:'轮播四四四'},
        {id:5,title:'轮播五五五'},
      ]
    }


  render () {
    return (
      <View className='home-swiper-wrap'>
      <Swiper
        className="swiper"
        circular
        indicatorDots
        indicatorColor="#999"
        indicatorActiveColor="#bf708f"
        autoplay
      >
        {/* {banner.map((item, index) => (
          <SwiperItem key={index}>
            <Image mode="widthFix" src={`${item.image_src}!w750`} />

          </SwiperItem>
        ))} */}
        {/* 效果图 */}
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
          {/* {this.state.bannerList.map(item => {
            <SwiperItem key={item.id}>
              <View className='demo-text'>
                <View className='photo'>
                  {item.title}
                </View>
              </View>
            </SwiperItem>
          })}      */}
      </Swiper>
      </View>
    )
  }
}


export default HomeSwiper;

