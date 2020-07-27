import React, {Component} from 'react';
import { View, Icon, Navigator, Image, Text, } from '@tarojs/components';
import Menu from '../../components/menu/menu'
import { AtIcon, AtAvatar, AtTabBar, AtInputNumber } from 'taro-ui'
import './index.scss'

class CartListView extends Component {
  constructor() {
    super(...arguments)
  }
  state = {
    carts: [
      {
        id: 1,
        title: '商品1112221214534534543',
        image:
          'https://tva1.sinaimg.cn/large/00831rSTgy1gczok56tkzj30m80m8qe4.jpg',
        num: 3,
        price: '28.00',
        selected: true
      },
      {
        id: 2,
        title: '3333333这个是一个商品介绍简介',
        image:
          'https://tva1.sinaimg.cn/large/00831rSTgy1gczok56tkzj30m80m8qe4.jpg',
        num: 3,
        price: '828.00',
        selected: true
      },
      {
        id: 3,
        title: '第三方阿道夫热而4524234',
        image:
          'https://tva1.sinaimg.cn/large/00831rSTgy1gczok56tkzj30m80m8qe4.jpg',
        num: 3,
        price: '18.00',
        selected: true
      },
      {
        id: 4,
        title: '好喝⾼颜值MEOW莫斯卡托⽓泡葡萄酒甜型⾹槟少⼥粉猫起泡酒(v1)',
        image:
          'https://tva1.sinaimg.cn/large/00831rSTgy1gczok56tkzj30m80m8qe4.jpg',
        num: 3,
        price: '88.00',
        selected: true
      },
      {
        id: 5,
        title: '好喝⾼颜值MEOW莫斯卡托⽓泡葡萄酒甜型⾹槟少⼥粉猫起泡酒(v1)',
        image:
          'https://tva1.sinaimg.cn/large/00831rSTgy1gczok56tkzj30m80m8qe4.jpg',
        num: 3,
        price: '88.00',
        selected: true
      },
    ],
    hascheckList: [], 
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: true,// 全选状态，默认全选
    editState: 0,
  }
  render(){
    const { carts, selectAllStatus, totalPrice, hasList } = this.state;
    let count = 0;
    carts.map(it => {
      if(it.selected === true) {
        count++;
      }
    })
    return (
      <View className='cartlist'>
        <View className='top-cart'>
          <View className='bag-icon'><AtIcon value='shopping-bag' size='17' color='black'></AtIcon></View>
          <View className='store-name'>凤鸣商城</View>
          <View className='more'><AtIcon value='chevron-right' size='18' color='black' class='more'></AtIcon></View>
          <View className='store-edit'>编辑</View>
        </View>
        <View className='midCard'>
          <View className='cart-box'>
              {carts.map((item, index) => {
                return (
                  <View className='cart-list' key={index}>
                    {item.selected ? (
                      <Icon
                        type='success'
                        color="#b30000"
                        data-index={index}
                        className="cart-pro-select"
              
                      ></Icon>
                    ) : (
                      <Icon
                        type='circle'
                        className='cart-pro-select'
                        data-index={index}
         
                      ></Icon>
                    )}
                    <Navigator url={'../details/details?id=' + item.id}>
                      <Image className='cart-thumb' src={item.image}></Image>
                    </Navigator>
                    <Text className='cart-pro-name'>{item.title}</Text>
                    <Text className='cart-pro-price'>{'￥' + item.price}</Text>
                    <View className='cart-count-box'>
                    <AtInputNumber
                      min={0}
                      max={10}
                      step={1}
                      value={this.state.value}
                      //onChange={this.handleChange.bind(this)}
                    />
                      {/* <Text
                        className="cart-count-down"
              
                        data-index={index}
                      >
                        -
                      </Text>
                      <Text className="cart-count-num">{item.num}</Text>
                      <Text
                        className="cart-count-add"
   
                        data-index={index}
                      >
                        +
                      </Text> */}
                    </View>
                  </View>

                )
              })}
          </View>
        </View>
        <View className='bottom-cart'>
        <Icon
          type='success'
          color="#b30000"
          className="cart-pro-select"
          size='19'
        ></Icon>
        <View className='select-all'>全选</View>
        <View className='cart-money'>
          
        </View>
        <View className='cont'>
          结算
        </View>
        </View>
        <Menu isActive={3} />
      </View>
    )
  }
}

export default CartListView;