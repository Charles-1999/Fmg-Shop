import React, {Component} from 'react';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './swiper.less'

class MySwiper extends Component {
    static defaultProps = {
        pictures: []
    }

    prevImg = e => {
        let urls = [];
        this.props.pictures.forEach(item => {
            urls.push('http://qiniu.daosuan.net/' + item.picture)
        });
        Taro.previewImage({
            urls,
            current: 'http://qiniu.daosuan.net/' + e.target.dataset.url
        })
    }

    render() { 
      const {pictures} = this.props
      return (  
        <View className='swiper' >
            <Swiper>
                {pictures.map((item,index) => 
                    <SwiperItem key={index} onClick={this.prevImg}>
                        <Image mode='scaleToFill' src={'http://qiniu.daosuan.net/'+item.picture} data-url={item.picture}></Image>
                    </SwiperItem>
                )}
            </Swiper>
        </View>
      )}
}
 
export default MySwiper;