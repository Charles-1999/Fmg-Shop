import React, { Component } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon, AtAvatar, AtTabBar, AtList, AtListItem } from 'taro-ui'
import { get } from 'lodash';
import { connect } from 'react-redux';
import Taro, {Current} from '@tarojs/taro'; 
import { get as getGlobalData } from '../../../global_data'
import Navbar from '../../../components/navbar/navbar'
import request from '../../../utils/request'
import ListGood from './list_good'
import './deliveryDetail.scss'
import formatTime from '../../.../../../utils/time'

@connect(({ order, goods }) => ({
  ...order,
}))
class deliveryDetail extends Component {
  state = {
    statusBarHeight: getGlobalData('statusBarHeight'),
    capsule: getGlobalData('capsule'),

  }
  componentDidMount(){
    // const data = await request('https://poll.kuaidi100.com/print/billparcels.do', {
    //   body: {
    //     method:'billparcels',
    //     key:'flHKGrTQ6370',
    //     sign: 'tflHKGrTQ6370'
    //   },
    //   method: 'GET'
    // })
  }

  render () {
    const {statusBarHeight, capsule} = this.state; 
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;

    return (
      <View className='order-detail-wrap' style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='物流详情'
        ></Navbar>
        <view class='g_con'>
          <view class='topExpress'>
            <view class='topExpress-left'>
              <image src='/images/Exchange_goods_map_1.png' style='width:60rpx;height:60rpx;border-radius:50%;'></image>
            </view>
            <view class='topExpress-right'>
              <view class='topExpress-right-top'>圆通速递</view>
              <view class='topExpress-right-middle'>运单号：813291235464788594</view>
              <view class='topExpress-right-bottom'>官方电话 95554 ></view>
            </view>
          </view>

          {/* <!-- 物流时间轴 --> */}
          <view class='expressRecord'>


            {/* <!-- 顶部收货地址 --> */}
            <view class='expressRecord-getAddress'>
              <view class='expressRecord-top'>
                <view class='getAddress-icon'>
                  收
                </view>
                <view class='getAddress-text'>[收货地址] 广东省深圳市南山区 南山街道 亿利达大厦</view>
              </view>
            </view>

            {/* <!-- 顶部收货地址半个时间轴线 --> */}
            <view class='noReach-online-top-close'></view>


            {/* <!-- 单个物流记录点时间轴：当前正在进行的物流状态 --> */}
            <view class='expressRecord-single-close'>

              {/* <!-- 左边子容器 --> */}
              <view class='expressRecord-single-noReach-online-top-close'>
                {/* <!-- 正在进行的时间轴上半个时间线 --> */}
                <view class='online-top-closing'></view>
                {/* <!-- 正在进行的时间轴点 --> */}
                <view class='dot-closing'></view>
                {/* <!-- 正在进行的时间轴下半个时间线 --> */}
                <view class='online-bottom'></view>
              </view>

              {/* <!-- 右边子容器 --> */}
              <view class='expressRecord-text'>
                <view class='expressRecord-statusing'>运输中</view>
                <view class='expressRecord-status-addressing'>武汉转运中心公司 已发出，下一站 深圳转运中心</view>
              </view>

              {/* <!-- 相对父级容器绝对定位的日期 --> */}
              <view class='expressRecord-dating'>
                <view class='expressRecord-date-text'>
                  昨天
                </view>
                <view class='expressRecord-date-time'>
                  20:39
                </view>
              </view>
            </view>

            {/* <!-- 单个物流记录点时间轴：已经过去的物流状态 --> */}
            <view class='expressRecord-single-close'>
              <view class='expressRecord-single-noReach-online-top-close'>
                <view class='online-top-close'></view>
                <view class='dot-close'></view>
                <view class='online-bottom'></view>
              </view>

              <view class='expressRecord-text'>
                <view class='expressRecord-status'></view>
                <view class='expressRecord-status-address'>武汉转运中心公司 已收入</view>
              </view>

              <view class='expressRecord-date'>
                <view class='expressRecord-date-text'>
                  昨天
                </view>
                <view class='expressRecord-date-time'>
                  20:37
                </view>
              </view>
            </view>

            <view class='expressRecord-single-close'>
              <view class='expressRecord-single-noReach-online-top-close'>
                <view class='online-top-close'></view>
                <view class='dot-close'></view>
                <view class='online-bottom'></view>
              </view>

              <view class='expressRecord-text'>
                <view class='expressRecord-status'></view>
                <view class='expressRecord-status-address'>湖北省孝感市汉川市公司 已打包</view>
              </view>

              <view class='expressRecord-date'>
                <view class='expressRecord-date-text'>
                  昨天
                </view>
                <view class='expressRecord-date-time'>
                  14:37
                </view>
              </view>
            </view>

            <view class='expressRecord-single-close'>
              <view class='expressRecord-single-noReach-online-top-close'>
                <view class='online-top-close'></view>
                <view class='dot-close'></view>
                <view class='online-bottom'></view>
              </view>

              <view class='expressRecord-text'>
                <view class='expressRecord-status'></view>
                <view class='expressRecord-status-address'>湖北省孝感市汉川市公司 已打包XXSFWERRTFDGDFGHTDBDHTEBGHTTER</view>
              </view>

              <view class='expressRecord-date'>
                <view class='expressRecord-date-text'>
                  昨天
                </view>
                <view class='expressRecord-date-time'>
                  14:37
                </view>
              </view>
            </view>

            <view class='expressRecord-single-close'>
              <view class='expressRecord-single-noReach-online-top-close'>
                <view class='online-top-close'></view>
                <view class='dot-close'></view>
                <view class='online-bottom'></view>
              </view>

              <view class='expressRecord-text'>
                <view class='expressRecord-status'>已揽件</view>
                <view class='expressRecord-status-address'>湖北省孝感市汉川市公司 已收件</view>
              </view>

              <view class='expressRecord-date'>
                <view class='expressRecord-date-text'>
                  昨天
                </view>
                <view class='expressRecord-date-time'>
                  14:17
                </view>
              </view>
            </view>

            <view class='expressRecord-single-close'>
              <view class='expressRecord-single-noReach-online-top-close'>
                <view class='online-top-close'></view>
                <view class='dot-close'></view>
                {/* <!-- 起始位置，下半个时间轴线不用 --> */}
                <view class='online-bottom-start'></view>
              </view>

              <view class='expressRecord-text'>
                <view class='expressRecord-status'>已发货</view>
                <view class='expressRecord-status-address'>卖家发货</view>
              </view>

              <view class='expressRecord-date'>
                <view class='expressRecord-date-text'>
                  昨天
                </view>
                <view class='expressRecord-date-time'>
                  13:50
                </view>
              </view>
            </view>
          </view>
          </view>
        </View>
    )
  }
}

export default deliveryDetail;