import React, { Component } from 'react';
import { Swiper, SwiperItem, Image, View } from '@tarojs/components';
import PropTypes from 'prop-types';
import './index.scss';

class MySwiper extends Component {
  
  static propTypes = {
    banner: PropTypes.array,
    home: PropTypes.bool,
  };

  static defaultProps = {
    banner: [],
    home: false,
  };

  render() {
    const { banner, home } = this.props;
    return (
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
      </Swiper>
    );
  }
}
export default MySwiper;