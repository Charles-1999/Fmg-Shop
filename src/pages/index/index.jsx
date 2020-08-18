import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View } from '@tarojs/components'
import { AtSearchBar,  AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import { get } from 'lodash';
import PropTypes from 'prop-types';
import './index.scss'
import Recommend from './recommend'
<<<<<<< HEAD
=======
import Goods from '../../model/Goods'
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7


@connect(({ goods }) => ({
   ...goods
}))

class HomeListView extends Component {
  constructor () {
    super(...arguments);
    this.state={
      value:'',
    }
  }
  componentDidMount() {
    //const { dispatch } = this.props;
    this.props.dispatch({
      type: 'goods/getGoodsPlace',
      ///payload: { page: 1, limit: 5,}, 
    });
    this.props.dispatch({
      type: 'goods/getGoodsCategory',
      payload: { page: 1, limit: 5 }, 
    });
    // this.props.dispatch({
    //   type: 'good/getGoodsSale',
    //   payload: { page: 1, limit: 5 }, 
    // });
    // this.props.dispatch({
    //   type: 'good/getGoodsSpecification',
    //   payload: { page: 1, limit: 5 }, 
    // });
    // Taro.login()
    // .then(response=>{
    //   console.log(response.code)
    // })
    //初始化拉取表格数据
    // this.props.dispatch({
    //   type: 'home/getGoodsPlace'
    // })
   
  }
  
  handleClick (value) {
    this.setState({
      current: value
    })
  }
  onChange (value) {
    this.setState({
      value: value
    })
  }

  render () {
    const { placeList } = this.props;

    return (
      <View className='index'>
        <View className='top-view'>
          <View className='fmg-logo'>
            LOGO
          </View>
          <View className='search-box'>
            <AtSearchBar
              value={this.state.value}
              maxLength={50}
              onChange={this.onChange.bind(this)}
              placeholder='香草小镇'
            />
          </View>
          <View className='bell'><AtIcon value='bell' size='20' color='#9999'></AtIcon></View>
        </View>
      
      </View>
    )
  }
}

// Index.propTypes = {
//   dispatch: PropTypes.func.isRequired,
//   placeList: PropTypes.arrayOf({}),
// };
// Index.defaultProps = {
//   placeList: [],
// };

export default HomeListView;

