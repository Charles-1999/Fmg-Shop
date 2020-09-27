import React, { Component } from 'react';
import { Swiper, SwiperItem, Image, View } from '@tarojs/components';
import PropTypes from 'prop-types';
import { get } from 'lodash';
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
    const { banner, home, slideshowList } = this.props;
    const data = Array.from(slideshowList)
    return (
      <Swiper
        className="swiper"
        circular
        indicatorDots
        indicatorColor="#999"
        indicatorActiveColor="#bf708f"
        autoplay
      >
        {data.map(item => (
          <SwiperItem key={item.id}>
            <View className='demo-text-1'>
              <View className='photo-1'>
                <Image src={'http://qiniu.daosuan.net/'+ get(item,'picture','')} className='first-img' style='height:138px;width:355.5px' />
              </View>
            </View>
          </SwiperItem>
        ))}
       
 
       
      </Swiper>
    );
  }
}
export default MySwiper;