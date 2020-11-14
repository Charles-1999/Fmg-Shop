import React, { Component } from 'react'
import Taro, {Current} from '@tarojs/taro';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { AtTag } from 'taro-ui';
import { View, Image } from '@tarojs/components';
import request from '../../../utils/request'
import SelectFloat from '@components/SelectFloat/index'
import '../index.scss'

//商品卡片
@connect(({ goods }) => ({
  ...goods
  
}))
class GoodsCard extends Component {
  constructor () {
    super(...arguments);
    this.state={
      data: {}, // 接口返回来的数据
      isOpen: false, // 是否打开选择框
      goodsList:[],
    }
  }

  async componentDidMount(){
    // const { list } = this.props;
    // if(list){
    //   this.setState({
    //     goodsList:list,
    //   })
    // }
    const {place_tag, kind_tag, sale_tag} = this.props;
    console.log(place_tag, kind_tag, sale_tag)
    await this.props.dispatch({
      type: 'goods/getGoodsList',
      payload: {
        place_tag:place_tag,
        kind_tag:kind_tag,
        sale_tag:sale_tag,
      }
    });
    console.log(this.props.goodsListIds)
    if (this.props.goodsListIds !== []){
      await this.props.dispatch({
        type: 'goods/mgetGoodsListEntity',
        payload: 
          this.props.goodsListIds
        
      })
      console.log(this.props.goodsList)
    }
    this.setState({
      goodsList:this.props.goodsList

    })
  }

  //商品详情
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

// 加入购物车
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
  const {isOpen,data} = this.state;
    return (
      <View className='goods-card'>
        <View className='goods-items-wrap'>
          {this.state.goodsList.map((item => (
            <View className='item' key={item.id}>
              <View className='cover' onclick={this.toDetail.bind(this,item.id)}>
                <Image src={get(item,'cover','')} className='first-img' />
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
                <View className='count'>
                  <AtTag className='count-tag' size='small' type='primary' >满减优惠</AtTag>
                </View>:  <View className='count-null'>
                </View>
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
        /> 
      </View>
    )
  }
}

export default GoodsCard;
