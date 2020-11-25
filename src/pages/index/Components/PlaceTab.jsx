import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Image } from '@tarojs/components'
import '../index.scss'

@connect(({ goods }) => ({
  ...goods
}))

//场地滑动选择tab
class PlaceTab extends Component {

  constructor () {
    super(...arguments);
    this.state={
      currentId: 0,
      placeList: [],
     
    }
  }
  componentDidMount(){
    const { placeList } = this.props

    this.setState({
      placeList:placeList
    })
  }
  handleTypeTab = (e,id) => {
    this.setState({
      currentId: e,
    })
    if(e==5){
      Taro.navigateTo({
        url: `/pages/studies/index`,
      });
    }
    else{
      Taro.navigateTo({
        url: `/pages/index/placeGoodsList?id=${this.state.currentId}`,
      });
    }
   
  }

  render () {
   
 
    return (
      <View className='place-tab-row'>
      {this.state.placeList.map(item => (
        <View className='place-tab-item' key={item.id} onClick={this.handleTypeTab.bind(this,item.id)}>
            <View className='pic'>
              <Image src={item.picture} style='width:130rpx;height:130rpx;border-radius: 9px;' />
            </View>
            <View className='title'>
              {item.place}
            </View>
        </View>
      ))}
       
      </View>
    )
  }
}


export default PlaceTab;

