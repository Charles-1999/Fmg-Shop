import React, { Component } from 'react'
import Taro from '@tarojs/taro';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { View, Image, Text ,Input} from '@tarojs/components'
import { AtTag } from 'taro-ui'
import '../index.scss'
import request from '../../../utils/request'
import GoodsCard from './GoodsCard'
import SelectFloat from '@components/SelectFloat/index'

@connect(({ goods }) => ({
  ...goods
}))

//新品榜
class SaleNew extends Component {
  static defaultProps = {
    kindList: [],
  };

  constructor () {
    super(...arguments);
    this.state={
      like: false,
      userId: Taro.getStorageSync('userId'),
      data: {}, // 接口返回来的数据
      showPrice: '', // 显示的价格
      isOpen: false, // 是否打开选择框
      showType: 0, // 选择框显示类型 0：都显示  1：加入购物车  2：立即购买
      currChoose: null, // 当前选则的规格
      currNum: 1, // 当前选择的数量 ,
      total: 0, // 商品余量
    }
  }

    
  componentDidMount(){
    this.props.dispatch({
      type: 'goods/getGoodsNewList',
      payload: {
        sale_tag:1,
      }
    });

  }
  
  onLikeTab = () => {
    let status = this.state.like;
    this.setState({
      like:!status,
    })
  }
  toDetail = (id) => {
    Taro.navigateTo({
      url: `/pages/details/index?gid=${id}`,
    });
  }

  /* 设置发货方式
    只有一种发货方式时，返回其自身；
    多种发货方式时，默认第一种方式
  */
  setGetWay = () => {
    let {get_way} = this.state.data;
    switch (get_way) {
      case 1:case 2:case 4:
        return get_way;
      case 3:case 5:case 7:
        return 1;
      case 6:
        return 2;
    }
  }
  // // 加入购物车
  async addCart(good_id) {
    const { goodsSaleNewList } = this.props;
    if(goodsSaleNewList){
      this.setState({
        data: goodsSaleNewList.filter(item => item.id == good_id)[0],
        isOpen: true,
      })
    }
  }


  render () {
    const { goodsSaleNewList } = this.props;
    console.log(goodsSaleNewList)
    const list = Array.from(goodsSaleNewList)
    const {isOpen,showType,showPrice,currChoose,currNum,total,data} = this.state;
 
    return (
      <View className='sale-new-wrap'>
        <View className='title-list'>
          <View className='name'>
            新品榜
          </View>
          <View className='icon'>
            <Image src='http://qiniu.daosuan.net/picture-1598883875000' style='width:140rpx;height:80rpx' />
          </View>
          {/* <View className='more'>
            <View className='checkmore'>进入专题</View>
            <Image src='http://qiniu.daosuan.net/picture-1598883365000' style='width:50rpx;height:30rpx' />
          </View> */}
        </View>
        <View className='goods-items-wrap'>
          <GoodsCard sale_tag={1} />
        {/* <View className='goods-card'>
        <View className='goods-items-wrap'>
          {list.map((item => (
            <View className='item' key={item.id}>
            <View className='cover' onclick={this.toDetail.bind(this,item.id)}>
              <Image src={get(item,'cover','')} className='img' />
            </View>
            {get(item,'name','').length >= 10 ?
              <View className='goods-name'>
              {get(item,'name','').substring(0,19)}
            </View>
            :
            <View className='name-detail'>
              <View className='name'>
                {get(item,'name','').substring(0,10)}
              </View>
              <View className='detail'>
                {get(item,'sale_point','').substring(0,10)}
              </View>
            </View>
            }
             {get(item,'sale','') ? 
                <AtTag className='count-tag' size='small' type='primary' >满减优惠</AtTag>:  <View className='count-null'> </View>
              }
            <View className='info'>
             
              <View className='price'>
                <View className='yuan'>¥</View>
                <View className='number'>
                  {get(item,'specification',[]).map(function(spe,index) {
                    const currentPrice = get(get(item,'specification',[])[0],'price');
                    if( get(spe,'price') >= currentPrice){
                      currentPrice === get(spe,'price');
                    }
                    if(index == get(item,'specification',[]).length-1)
                      return <View key={item.id}>{currentPrice}</View>
                  })}
                </View>
              </View>
              <View className='join-cart' onClick={this.addCart.bind(this,item.id)}> 加入购物车 </View>
            </View>
              
          </View>
          )))}        
        </View>
        <SelectFloat 
          currGoods={data}
          isOpen={isOpen}
          showType={1}
          hiddenFloat={() => {this.setState({isOpen: false})}}
          //chooseType={this.chooseType} 
        />
        {/* <View className={isOpen?'active float_wrap':'float_wrap'}>
            <View className='mask' onClick={this.hiddenFloat}></View>
            <View className={isOpen?'container active':'container'}>
              <View className='info_wrap'>
                <Image src={data.cover ? (typeof currChoose == 'number' ? 'http://qiniu.daosuan.net/' + data.specification[currChoose].picture : 'http://qiniu.daosuan.net/' + data.cover) : ''} />
                <Text className='name'>{data.name}</Text>
                <Text className='price'>
                  <Text className='sign'>￥</Text>{showPrice*0.01}
                </Text>
              </View>
              <View className='select_wrap'>
                <View className='title'>{data.template ? data.template.join('、') : ''}：</View>
                <View className='options_list'>
                  {data.specification ? data.specification.map((spec,spec_index) => (
                    <View className={currChoose == spec_index ? 'option active' : 'option'} key={spec_index} onClick={this.chooseType.bind(this,spec_index)}>
                      {data.template.map((temp, temp_index) => (
                        temp_index == 0 ? spec.specification[temp] : ' ' + spec.specification[temp]
                      ))}
                    </View>
                  )):''}
                </View>
              </View>
              <View className='num_wrap'>
                <View className='left'>
                  <View className='title'>购买数量：</View>
                  <View className='total'>剩余{total}件</View>
                </View>
                <View className='right'>
                  <View className='btn' onClick={this.handleClickNum} data-num={-1}>-</View>
                  <Input value={currNum} type='number' onBlur={this.handleInputNum} />
                  <View className='btn' onClick={this.handleClickNum} data-num={1}>+</View>
                </View>
              </View>
              {showType == 0 ?
                <View className='select_tool_bar'>
                  <View className='cart' onClick={this.addCart.bind(this)}>加入购物车</View>
                  <View className='buy' onClick={this.buyNow}>立即购买</View>
                </View>
                : ''
              }
              {showType == 1 ?
                <View className='select_tool_bar'>
                  <View className='cart' onClick={this.addCart.bind(this)}>加入购物车</View>
                </View>
                : ''
              }
              {showType == 2 ?
                <View className='select_tool_bar'>
                  <View className='buy' onClick={this.buyNow}>立即购买</View>
                </View>
                : ''
              }
            </View>
          </View> */}
    
      {/* </View> */}
        </View>
      </View>
    )
  }
}


export default SaleNew;

