import React, { Component } from 'react'
import Taro, {Current} from '@tarojs/taro';
import { connect } from 'react-redux';
import { View, Image } from '@tarojs/components'
import { AtSearchBar, AtIcon, AtTag} from 'taro-ui'
import PropTypes from 'prop-types';
import { get } from 'lodash';
import './index.scss'
import Navbar from '../../components/navbar/navbar'
import more from '../../assets/icon/下拉.png'
import GoodsCard from './Components/GoodsCard'
import { get as getGlobalData } from '../../global_data'

@connect(({ goods }) => ({
  ...goods
}))

class kindGoodsList extends Component {
  static defaultProps = {
    goodsList: [],
    current_kind: [],
  };
  constructor () {
    super(...arguments);
    this.state={
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
      current_index: Current.router.params.id,
      kindList: [],
    }
    //this.setCurrentIndex = this.setCurrentIndex.bind(this)
  }
  componentDidMount(){
    this.props.dispatch({
      type: 'goods/getGoodsKind',
    });
    const { kindList } = this.props;
    this.setState({
      kindList: kindList,
    })
  }
  setCurrentIndex(event){
    this.setState({
      current_index: event
    })
  }

  render () {
    const capsuleHeight = this.state.capsule.height + (this.state.capsule.top - this.state.statusBarHeight) * 3
  


    return (
      <View className='kind-goods-list-wrap' style={{ marginTop: this.state.statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={this.state.statusBarHeight}
          capsuleHeight={capsuleHeight}
          showBack
          showSearch
        >
        </Navbar>
        <View className='top-list'>
        {this.state.kindList.filter(item => item.parent_id == 0).map(item =>(
        item.id == this.state.current_index ? 
          <View key={item.id}>
            <View className='kind-item-active' key={item.id} onClick={this.setCurrentIndex.bind(this,item.id)} >
              {item.title}
            </View>
          </View>
          :
          <View key={item.id}>
            <View className='kind-item' key={item.id} onClick={this.setCurrentIndex.bind(this,item.id)} >
              {item.title}
            </View>
          </View>
        ))}
        
        </View>
        <GoodsCard kind_tag={this.state.current_index} key={this.state.current_index} />
      </View>
    )
  }
}


export default kindGoodsList;

