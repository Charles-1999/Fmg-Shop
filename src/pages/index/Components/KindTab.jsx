import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components'
import PropTypes from 'prop-types';
import { get } from 'lodash';
import '../index.scss'

class KindTab extends Component {
  constructor () {
    super(...arguments);
    this.state={
    }
  }
  enterGoodsKind = (id) => {
    Taro.navigateTo({
      url: `/pages/index/kindGoodsList?id=${id}`,
    });
  }

  render () {
    const { kindList } = this.props;
   // console.log(kindList.filter(item => get(item, 'parent_id', '') == 0))
    //const data = kindList.filter(item => get(item, 'parent_id', '') == 0 );
    const data = Array.from(kindList);
    return (
      <View className='kind-tab-wrap'>
        <View className='kind-tab-row'>
        {data.map(item => (
          <View className='kind-tab-item' key={item.id} onclick={this.enterGoodsKind.bind(this,item.id)}>
              <View className='pic' >
                <Image src={'http://qiniu.daosuan.net/'+item.picture} style='width:95rpx;height:95rpx' />
              </View>
              <View className='title'>
                {item.title}
              </View>
          </View>
        ))}
        </View>
       
      </View>
    )
  }
}


export default KindTab;

