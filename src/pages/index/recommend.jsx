import React, { Component } from 'react'
import { View, Button, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtGrid } from "taro-ui"
import './index.scss';
import imgList1 from '../../assets/img/recommend3.jpg';
import imgList2 from '../../assets/img/recommend2.jpg';
import dfs from '../../assets/img/recommend-place.jpg';

class Recommend extends Component {
  state = {
    imgList:[
      {
        id:1,
        img:'../../assets/img/recommend2.jpg',
        url:'11',
      },
      {
        id:2,
        img:'../../assets/img/recommend3.jpg',
        url:'11',
      }
    ],
    squareCardList: [
      {
        id:1,
        img:'../../assets/img/recommend-place.jpg',
        url:'ddf',
        name:'香草小镇'
      },
      {
        id:2,
        img:'../../assets/img/recommend-place.jpg',
        url:'ddf',
        name:'香草小镇'
      },
      {
        id:3,
        img:'../../assets/img/recommend-place.jpg',
        url:'ddf',
        name:'香草小镇'
      },
      {
        id:4,
        img:'../../assets/img/recommend-place.jpg',
        url:'ddf',
        name:'香草小镇'
      },
    ],
  }
  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }
  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

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
        {this.state.imgList.map(item => 
          <SwiperItem>
            <View className='demo-text-1'>
              <View>
                <Image src={item.img} className='photo'></Image>
              </View>
            </View>
          </SwiperItem>
        )}
        </Swiper>
        <View className='squareCard'>
          <View className='at-row'>
            {this.state.squareCardList.map(item => 
              <View className='at-col'>
                <View className='card-photo'>
                <Image src={item.img} className='photo' style='width:80px;height:80px'></Image>
                </View>
                <View className='card-text'>
                  {item.name}
                </View>
              </View>
            )}
          </View>
          <View className='at-row'>
            {this.state.squareCardList.map(item => 
              <View className='at-col'>
                <View className='card-photo'>
                <Image src={item.img} className='photo' style='width:80px;height:80px'></Image>
                </View>
                <View className='card-text'>
                  {item.name}
                </View>
              </View>
            )}
          </View>
     
        </View>
        <View className='new-product'>
          {/* <View>新品上市</View>
          <View>进入专题</View> */}
        </View>
      </View>
    )
  }
}
export default Recommend;

