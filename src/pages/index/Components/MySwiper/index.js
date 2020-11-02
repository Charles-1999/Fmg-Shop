import React, { Component } from 'react';
import { Swiper, SwiperItem, Image, View } from '@tarojs/components';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import './index.scss';

class MySwiper extends Component {

  state = {
    slideshowList: []
  }
  componentDidMount(){
    // const { slideshowList } = this.props;
    // this.setState({
    //   slideshowList:slideshowList
    // })
  }
  render() {
    const { slideshowList } = this.props;
    const data = Array.from(slideshowList)
    return (
      <Swiper
        className='swiper'
        circular
        indicatorDots
        indicatorColor='#999'
        indicatorActiveColor='#bf708f'
        autoplay
      >
        {data.map(item => (
          <SwiperItem key={item.id}>
            <View className='demo-text'>
              <View className='photo'>
                <Image src={'http://qiniu.daosuan.net/'+get(item,'picture','')} className='img' />
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    );
  }
}
export default MySwiper;