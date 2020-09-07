import React, { Component } from 'react';
import { View, Image, Text, RichText } from '@tarojs/components';
import './detailInfo.less'


class DetailInfo extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      currentTab: 0,
    }
  }
  
  switchTab = () => {
    let {currentTab} = this.state;
    currentTab = currentTab == 0 ? 1 : 0;
    this.setState({
      currentTab
    })
  }

  render() {
    const {currentTab} = this.state
    let {data} = this.props;
    if(data) data = data.replace('<img', '<img style="width:100%;height:auto" ')
    console.log(data)
    return (
      <View className='detail_info' >
        <View className='tabs'>
          <View className='tabs_title'>
            <View className={currentTab==0?'tabs_title_item current':'tabs_title_item'} onClick={this.switchTab}>商品详情</View>
            <Text>|</Text>
            <View className={currentTab==1?'tabs_title_item current':'tabs_title_item'} onClick={this.switchTab}>交易明细</View>
          </View>
          <View className='tabs_wrap'>
            { currentTab == 0 ? 
              <View className='tabs_item'>
                <RichText nodes={data}></RichText>
              </View>
              : ''
            }
            { currentTab == 1 ? 
              <View className='tabs_item'>标签2内容</View>
              : ''
            }
          </View>
        </View>
      </View>
    )
  }
}

export default DetailInfo; 