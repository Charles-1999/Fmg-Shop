import React, {Component} from 'react';
import { View, Icon, Navigator, Image, Text, Button } from '@tarojs/components';
import { AtIcon, AtListItem } from 'taro-ui'
import MySwiper from '../../components/MySwiper/index';
import img1 from './assets/1.png'
import img2 from './assets/2.png'
import img3 from './assets/3.png'
import img4 from './assets/4.png'
import img5 from './assets/5.png'
import './index.scss'

class Details extends Component {
    constructor() {
        super(...arguments)
    }
    state = { 
      detail: {
        name:"凤鸣谷.香草手工除螨沐浴露|百年手工古法制作，强力除螨美背",
        price:"20",
        sendprice:"免运费",
        amount:"169",
        imgList : [img1,img2,img3,img4,img5],
      },
    }

    render() { 
      const {detail} = this.state;
      return (  
        <View className="detail-page">
          <View className="image-box">
            {/* -- 商品图片 -- */}
            <View className="image-box clearfix">
              {/* <MySwiper banner={imageObj} />   */}
              <MySwiper />
            </View>
          </View>
          <View className="container">
            {/* -- 商品信息 -- */}
            <View className="info-business-card">
              <View className="name">{detail.name}</View>
              <View className="share-button">
                <Button open-type="share" />
              </View>
            </View>
            <View className="info-price">
              <Text>¥{detail.price}</Text>
            </View>
            <View className="info-sendprice">
              <Text className="sendprice">运费 {detail.sendprice}</Text>
              <Text className="amount">剩余 {detail.amount}</Text>
            </View>
            <view className='info-select-tab'>
            <AtListItem title='选择：类型' arrow='right' />
            <AtListItem title='配送：快递' arrow='right' />
            </view>
            <View className='info-img'>
              {detail.imgList.map((item, index) => (
                <Image
                  key={index}
                  className='img'
                  src={item}
                  mode='widthFix'
                />
              ))}
            </View>
          </View>
          <View>
            {/* -- 底部操作栏 --  */}
            <View className="detail-bottom">
              <View className="nav" onClick={this.goToPage}>
                <AtIcon className="nav-icon" value='home'></AtIcon>
                首页
              </View>
              <View className="nav" onClick={this.goToPage}>
                <AtIcon className="nav-icon" value='phone'></AtIcon>
                客服
              </View>
              <View className="nav" onClick={this.goToPage}>
                <AtIcon className="nav-icon" value='shopping-cart'></AtIcon>
                购物车
              </View>
              <View className="nav-right">
                <View className="nav-join" >
                  <Text className="nav-join-txt">加入购物车</Text>
                </View>
                <View className="nav-buy" onClick={this.handleBuy}>
                <Text className="nav-buy-txt">立即购买</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
}
 
export default Details;