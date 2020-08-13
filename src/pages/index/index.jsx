import React, { Component } from 'react'
import Taro, { get } from '@tarojs/taro';
import { connect } from '@tarojs/redux';
import { View } from '@tarojs/components'
import { AtSearchBar,  AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import './index.scss'
import Recommend from './recommend'

// @connect(({ placeList }) => ({
//   placeList,
// }))

class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      typeTab:[
        { id:1, name:'推荐'},
        { id:2, name:'香草小镇'},
        { id:3, name:'一号营地'},
        { id:4, name:'红耕乐园'},
        { id:5, name:'运动基地'},
        { id:6, name:'水上营地'},
      ],
      value: '',
      current: 0,
    }
  }
  componentDidMount() {
    console.log("sdf"+this.props.dispatch);
    //初始化拉取表格数据
    // this.props.dispatch({
    //   type: 'home/getGoodsPlace'
    // })
   // this.handleGetListData();
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

  handleGetListData = () => {
    console.log(this.props.dispatch());
    this.props.dispatch({
      type: 'placeList/getGoodsPlace',
      payload: { page: 1, limit: 5 }, 
    });
  };

  render () {
//console.log(this.props.dispatch && this.props.dispatch());
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
              <View style='font-size:18px;text-align:center;height:100px;'>标签页二的内容</View>
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
        
   
        {/* <Menu isActive={0} /> */}
          
      </View>
    )
  }
}
export default Index;

