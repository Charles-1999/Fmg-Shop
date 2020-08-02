import React, {Component} from 'react';
import { View, Icon, Navigator, Image, Text, } from '@tarojs/components';
//import Menu from '../../components/menu/menu'
import { AtIcon, AtAvatar, AtTabBar, AtInputNumber } from 'taro-ui'
import './index.scss'
import storepic from '../../assets/img/shangPing.jpg'

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
          storepic,
        num: 2,
        price: '28.00',
        selected: false
      },
      {
        id: 2,
        title: '3333333这个是一个商品介绍简介',
        image:
          storepic,
        num: 1,
        price: '828.00',
        selected: true
      },
      {
        id: 3,
        title: '第三方阿道夫热而4524234',
        image:
         storepic,
        num: 6,
        price: '18.00',
        selected: true
      },
      {
        id: 4,
        title: '好喝⾼颜值MEOW莫斯卡托⽓泡葡萄酒甜型⾹槟少⼥粉猫起泡酒(v1)',
        image:
          storepic,
        num: 3,
        price: '88.00',
        selected: true
      },
      {
        id: 5,
        title: '好喝⾼颜值MEOW莫斯卡托⽓泡葡萄酒甜型⾹槟少⼥粉猫起泡酒(v1)',
        image:
          storepic,
        num: 3,
        price: '88.00',
        selected: true
      },
    ],
    hascheckList: [], 
    totalPrice: 0, // 总价，初始为0
    selectAllStatus: false,// 全选状态，默认全选
    editState: false,
    value:0,
  }

  componentDidShow() {
    // const cart = []
    // this.setState({
    //   carts: cart
    // })
    this.getTotalPrice();
  }
  getTotalPrice() {
    let carts = this.state.carts // 获取购物车列表
    let total = 0
    for (let i = 0; i < carts.length; i++) {
      // 循环列表得到每个数据
      if (carts[i].selected) {
        // 判断选中才会计算价格
        total += carts[i].num * carts[i].price // 所有价格加起来
      }
    }
    console.log(total);
    this.setState({
      // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    })
  }
  /**
   * 当前商品选中事件
   */
  selectList(id,e) {
    const index = e.currentTarget.dataset.index
    let carts = this.state.carts
    // const selected = carts[index].selected
    // carts[index].selected = !selected
    carts.forEach(item => {
      if (id == item.id) {
        item.selected = !item.selected
      }
    })
    // const checkall = this.data.selectAllStatus === true ? false : false
    this.setState({
      carts: carts, 
      // selectAllStatus: false
    })
    this.getTotalPrice();
  }
 /**
   * 购物车全选事件
   */
  onSelectAll() {
    let carts = this.carts
    console.log(carts)
    // items.map((item,index)=>{
    //   if(item.selected){
    //     items[index].selected = true
    //   }else{
    //     items[index].selected = false
    //   }
    //   this.setState({
    //     carts:items,
    //     selectAllStatus:true,

    //   })
    // })
    //////
    // let select = this.state.selectAllStatus;
    // console.log("dfs"+select);
    // select = !select;
    // console.log(select)
    // let carts = this.state.carts
    // for (let i = 0; i < carts.length; i++) {
    //   carts[i].selected = select;
    // }
    // this.setState({
    //   selectAllStatus: select,
    //   carts: carts
    // })
    
    this.getTotalPrice()
  }

  closeFun() {
    let list = []
    let listTotal = []
    this.state.carts.map((v, k) => {
      console.log('购物车数据', v)
      if (v.select) {
        list.push(v)
      } else {
        listTotal.push(v)
      }
    })
  }
  onChangeEditState(){
    let status = this.state.editState;
    this.setState({
      editState: !status,
    })
  }
  handleNumChange(t,item) {
    let carts = this.state.carts
    console.log(carts)
    carts[t-1].num = item;
    this.setState({
      carts: carts
    })
    console.log('item: '+ item );
    this.getTotalPrice();
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
          {!this.state.editState ? 
          <View className='store-edit' onClick={this.onChangeEditState}>编辑</View>:
          <View className='store-edit'>完成</View>
          }
          
        </View>
        <View className='midCard'>
          <View className='cart-box'>
              {carts.map((item, index) => {
                return (
                  <View className='cart-list' key={index}>
                    {item.selected ? (
                      <Icon
                        type='success'
                        color='#b30000'
                        data-index={index}
                        className="cart-pro-select"
                        onClick={this.selectList.bind(this,item.id)}
                      ></Icon>
                    ) : (
                      <Icon
                        type='circle'
                        className='cart-pro-select'
                        data-index={index}
                        onClick={this.selectList.bind(this,item.id)}
                      ></Icon>
                    )}
                    <Navigator url={'../details/details?id=' + item.id}>
                      <Image className='cart-thumb' src={item.image}></Image>
                    </Navigator>
                    <Text className='cart-pro-name'>{item.title}</Text>
                    <Text className='cart-pro-price'>{'￥' + item.price}</Text>
                    <View className='cart-count-box'>
                    <AtInputNumber
                      min={1}
                      max={10}
                      step={1}
                      value={item.num}
                      onChange={this.handleNumChange.bind(this,item.id)}
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
        {selectAllStatus ? (
          <Icon
            type='success_circle'
            color='#b30000'
            className='total-select'
            onClick={this.onSelectAll}
          ></Icon>
          ) : (
          <Icon
            type='circle'
            color='#b30000'
            className='total-select'
            onClick={this.onSelectAll}
          ></Icon>
        )}
        <View className='select-all'>全选</View>
        <View className='cart-money'>
          {/* <Text >{count> 0? `已选(${count})`: '全选'}</Text> */}
          <Text className='cart-toatl-price'>{'合计￥' + totalPrice}</Text>
        </View>
        <View className='cont' onClick={this.closeFun}>
          结算
        </View>
        </View>
        {/* <Menu isActive={3} /> */}
      </View>
    )
  }
}

export default CartListView;