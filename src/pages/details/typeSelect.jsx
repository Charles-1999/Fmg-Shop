import React, {Component} from 'react';
import { View, Icon, Navigator, Image, Text, Button } from '@tarojs/components';
import { AtIcon, AtListItem } from 'taro-ui'
import MySwiper from '../../components/MySwiper/index';
import './index.scss'

class TypeSelectView extends Component {
    constructor() {
        super(...arguments)
    }
    state = { 
      detail: {
        name:"凤鸣谷.香草手工除螨沐浴露|百年手工古法制作，强力除螨美背",
        price:"20",
        sendprice:"免运费",
        amount:"169",
      },
    }

    render() { 
      const {detail} = this.state;
      return (  
        <View className="select-page">
         
        </View>
      );
    }
}
 
export default TypeSelectView;