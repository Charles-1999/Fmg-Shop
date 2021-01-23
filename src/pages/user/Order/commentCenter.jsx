import React, { Component } from 'react'
import { View, Image, Navigator } from '@tarojs/components'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData , set as setGlobalData} from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import './commentCenter.scss'
import ListGood from './list_good'

@connect(({ order, goods, comment }) => ({
  ...order,...goods,...comment,
}))
class CommentCenter extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),
    userId: Taro.getStorageSync('userId'),
    tag:0,
    status:4,
    comment:0,
    ids:[],
    commentList:[],
    goods_info:[],
    isHaveComment:true,
    userCommentList:[],
  }
 
  async componentDidMount () {
    this.getUserCommentList();
    this.getList(4,0);
  }
  async getUserCommentList(){
    await this.props.dispatch({
      type: 'comment/getUserComment',
      payload: {
        uid:this.state.userId
      },
    })
    this.setState({
      userCommentList:this.props.userCommentList,
    })
  }
  //获取评价信息列表
  async getList(status,comment){
    //获取订单list
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        author_id:this.state.userId,
        status: status,
        limit:10,
      },
    })
    const orderList = this.props.orderList;
    const total = get(orderList,'total');
    await this.props.dispatch({
      type: 'order/getOrderList',
      payload: {
        author_id:this.state.userId,
        limit:total,
      },
    })
    const orders = get(this.props.orderList,'orders');
    const Ids = orders.map((arr) => {return arr.id})
    await this.props.dispatch({
      type: 'order/mgetOrderList',
      payload: {
        ids:Ids
      },
    })
    const orderInfoList = this.props.orderInfoList.filter(item=>item.order_status==status||item.order_status==this.state.status)
    const list = orderInfoList.map(item=> {return item.order_detail})
    console.log(list);
    if(list == ""){
      this.setState({
        isHaveComment:false
      })
    }
    else{
      const detailList = list.reduce((a,b)=>{return a.concat(b)})
      console.log(detailList)
      const commentList = detailList.filter(item=> get(item,'is_comment')==comment)
      this.setState({
        commentList:commentList,
      })
      //获取评论商品信息
      this.state.commentList.map(good => {
        this.setState({
          ids:[...this.state.ids,get(good,'goods_id')]
        })
        return this.state.ids
      })
      await this.props.dispatch({
        type: 'goods/mgetGoodsListEntity',
        payload: 
          this.state.ids
      })
      this.setState({
        goods_info:this.props.goodsList,
        isHaveComment:true,
      })
    }
  }

  handleChangeTag=e=>{
    if(e==0){
      this.getList(4,0)
      this.setState({
        tag:0,
        status:4
      })
    }
    else{
      this.getList(5,1)
      this.setState({
        tag:1,
        status:4
      })
    }
  }

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;
    const userInfo = Taro.getStorageSync('userInfo'); //获取当前用户信息
    console.log('render')
    return (
      <View className='comment-center-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='评价中心'
        ></Navbar>
        <View className='comment-center-header'>
          <View className='touxiang'>
            <Image circle size='large' src={userInfo.avatarUrl}></Image>
          </View>
          <Navigator className='number-card' url='/pages/user/Order/userComment'>
            <View className='number'>
              {this.state.userCommentList.length}
            </View>
            <View className='title'>
              全部评价
            </View>
          </Navigator>
        </View>
        <View className='select-tab'>
          {this.state.tag==0?
            <View className='comment-tab-active' onClick={this.handleChangeTag.bind(this,0)}>待评价</View>:
            <View className='comment-tab' onClick={this.handleChangeTag.bind(this,0)}>待评价</View>
          }
          {this.state.tag==1?
            <View className='comment-tab-active' onClick={this.handleChangeTag.bind(this,1)}>可追评</View>:
            <View className='comment-tab' onClick={this.handleChangeTag.bind(this,1)}>可追评</View>
          }
        </View>
        {this.state.isHaveComment?
          <View className='comment-list-wrap' key={this.state.status}>
            {this.state.commentList.map(item=>(
              <View key={item.id} class='comment-list-card'>
                <ListGood 
                  key={this.state.goods_info}
                  goodId={get(item,'goods_id','')} 
                  speId={get(item,'goods_specification_id','')} 
                  price={get(item,'goods_amount','')} 
                  quality={get(item,'purchase_qty','')} 
                  message={get(item,'message','')}
                  goodsInfo={this.state.goods_info}
                  detailID={get(item,'id')}
                  oId={get(item,'child_order_id')}
                  ooId={get(item,'order_id')}
                  status={this.state.status}
                  isShowComment
                  is_comment={get(item,'is_comment')}
                /> 
              </View>
            ))}
          </View>
        :<View className='comment-null'>暂时没有待评论噢</View>
      }
       
       
      </View>
    )
  }
}

export default CommentCenter;