import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { View } from '@tarojs/components'
import { AtSearchBar,  AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import { get } from 'lodash';
import PropTypes from 'prop-types';
import './index.scss'
import Recommend from './recommend'
import Goods from '../../model/Goods'


@connect(({ goods }) => ({
   ...goods
}))

class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      typeTab:[
        { id:1, name:'推荐' },
        { id:2, name:'香草小镇' },
        { id:3, name:'一号营地' },
        { id:4, name:'红耕乐园' },
        { id:5, name:'运动基地' },
        { id:6, name:'水上营地' },
      ],
      value: '',
      current: 0, 
    }
  }
  
  componentDidMount= ()=> {
    //const { dispatch } = this.props;
    this.props.dispatch({
      type: 'goods/getGoodsPlace',
      payload: { page: 1, limit: 5 }, 
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

  mapStateToProps(state) {
    return {
      placeList: state
    }
  }
  //   /**
  //  * 分类回调
  //  * @param json
  //  */
  // onClassifyCall = json => {
  //   if (isObj(json) && Object.keys(json).length > 0) {
  //     this.fetchApi(json);
  //   }
  // };

  // /**
  //  * 列表滚动回调
  //  * @param json
  //  */
  // onGoodsCall = json => {
  //   if (json.type === 'loading') {
  //     this.fetchApi(null, {
  //       current: (this.props.pagination.current += 1),
  //     });
  //   }
  // };

  // /**
  //  * 获取数据
  //  * @param filters
  //  * @param pagination
  //  */
  // fetchApi = (filters, pagination) => {
  //   this.props.dispatch({
  //     type: 'good/save',
  //     payload: {
  //       filters: {
  //         ...this.props.filters,
  //         ...filters,
  //       },
  //       pagination: {
  //         ...this.props.pagination,
  //         ...pagination,
  //       },
  //     },
  //   });
  //   this.props.dispatch({
  //     type: 'good/getGoodsPlace',
  //   });
  // };

  render () {
    const { placeList } = this.props;
    console.log(placeList);
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
        <View>
          <AtTabs
            current={this.state.current}
            scroll
            tabList={[ 
              { title: '推荐' },
              { title: '香草小镇' },
              { title: '一号营地' },
              { title: '红耕乐园' },
              { title: '运动基地' },
              { title: '水上营地' }
            ]}
            onClick={this.handleClick.bind(this)} 
          >
            <AtTabsPane current={this.state.current} index={0}>
              <View style='font-size:18px;text-align:center;'>
                <Recommend />
              </View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={1}>
              <View style='font-size:18px;text-align:center;height:100px;'>
                二
              </View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={2}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页三的内容</View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={3}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页四的内容</View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={4}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页五的内容</View>
            </AtTabsPane>
            <AtTabsPane current={this.state.current} index={5}>
              <View style='font-size:18px;text-align:center;height:100px;'>

              </View>
            </AtTabsPane>
          </AtTabs>
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

export default Index;

