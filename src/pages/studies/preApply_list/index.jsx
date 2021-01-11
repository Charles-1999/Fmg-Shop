import Taro, { getCurrentInstance, useDidShow, useReachBottom } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text, Image } from "@tarojs/components"
import Navbar from '@components/navbar/navbar'
import { connect } from "react-redux"
import { formatTimeStamp } from '@utils/time'
import { payApply } from '@utils/pay'

import './index.less'

function PreApplyList(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const [currTab, setCurrTab] = useState(1)
  const [dataList, setDataList] = useState([])
  const [courseInfos, setCourseInfos] = useState([])
  const [firstShow, setFirstShow] = useState(true)
  const { page, total } = props
  const LIMIT = 10

  useEffect(() => {
    const { status } = getCurrentInstance().router.params
    setFirstShow(false)
    setCurrTab(status)
    getApplyList(status)
  }, [])

  useDidShow(() => {
    if (!firstShow) getApplyList(currTab)
  })

  /* 触底加载 */
  useReachBottom(() => {
    if (page * LIMIT < total)
      getApplyList(currTab, page + 1)
  })

  /* 在getApplyList之后，检测到courseInfos有返回时 */
  useEffect(() => {
    let { page } = props
    let res_mget_apply = props.dataList
    let res_mget_course = props.courseInfos

    if (res_mget_apply instanceof Array) {
      if (page == 1) {
        // 首次加载
        setCourseInfos(res_mget_course)

        res_mget_apply.forEach(data => {
          data = Object.assign(data, { courseInfo: res_mget_course.find(item => item.id == data.course_id) })
        })

        setDataList(res_mget_apply)
      } else {
        // 触底加载
        // state中的dataList和courseInfos
        let [SDataList, SCourseInfos] = [[...dataList], [...courseInfos]]

        // 把新请求回来的追加到原数组
        SDataList.push(...res_mget_apply)
        SCourseInfos.push(...res_mget_course)

        // 去重
        let obj = {}
        SCourseInfos = SCourseInfos.reduce((item, next) => {
          obj[next.id] ? null : obj[next.id] = true && item.push(next)
          return item
        }, [])
        setCourseInfos(SCourseInfos)

        SDataList.forEach(data => {
          data = Object.assign(data, { courseInfo: SCourseInfos.find(item => item.id == data.course_id) })
        })
        setDataList(SDataList)
      }
    }
  }, [props.courseInfos])

  /* 切换tab */
  function switchTab(tab) {
    setCurrTab(tab)
    getApplyList(tab)
  }

  /* 获取报名列表 */
  function getApplyList(status, page = 1, limit = 10) {
    status = parseInt(status)

    // 预报名状态 1: 取消, 2: 预报名, 4: 已报名
    const preApplyMap = new Map([['已取消', 1], ['预报名', 2], ['已报名', 4]])
    // 已报名状态 1: 未支付, 2: 已支付, 3: 已完成, 4: 已取消, 5: 申请退款中, 6: 已退款
    const applyMap = new Map([['未支付', 1], ['已支付', 2], ['已完成', 3], ['已取消', 4], ['申请退款中', 5], ['已退款', 6], ['售后', 7]])
    // status 0: 全部, 1: 预报名, 2: 未支付, 3: 已支付, 4: 已取消, 5: 售后
    const statusMap = new Map([['预报名', 1], ['未支付', 2], ['已支付', 3], ['已取消', 4], ['售后', 5]])
    const statusArr = [null, preApplyMap.get('预报名'), applyMap.get('未支付'), applyMap.get('已支付'), applyMap.get('已取消'), applyMap.get('售后')]

    // 获取预报名或报名列表
    let type = 'study/'
    status == statusMap.get('预报名') ? type += 'getPreApplyList' : type += 'getApplyList'
    props.dispatch({
      type,
      payload: {
        status: statusArr[status],
        page,
        limit,
      }
    })
  }

  /* 取消报名 */
  function cancle(aid) {
    Taro.showModal({
      title: '提示',
      content: '确认取消报名？',
      success: res => {
        if (res.confirm) {
          props.dispatch({
            type: 'study/cancleApply',
            payload: {
              aid
            }
          }).then(() => {
            getApplyList(currTab)
          })
        }
      }
    })
  }

  /* 统一下单 */
  function pay(pid) {
    payApply(pid, null, null, () => {
      Taro.navigateTo({
        url: '/pages/studies/apply_detail/index?id=' + pid
      })
    })
  }

  /**
   * 退款
   * @param {Number} aid 报名id
   */
  function refund(aid) {
    Taro.showModal({
      title: '提示',
      content: '是否确认退款？',
      success: res => {
        if (res.confirm) {
          props.dispatch({
            type: 'study/refund',
            payload: {
              aid
            }
          }).then(() => {

          })
        }
      }
    })
  }

  return (
    <View className={isIphoneX ? 'isIphoneX preApply_list' : 'preApply_list'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='我的报名'
        color='#fff'
        backgroundImageStatus='linear-gradient(90deg, #2d79f8, #4279ea)'
        backgroundImageCapsule='linear-gradient(90deg, #2d79f8, #4279ea)'
        backColor='white'
      />
      <View className='tab_bar'>
        <View className={currTab == 1 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 1)}>预报名</View>
        <View className={currTab == 2 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 2)}>未支付</View>
        <View className={currTab == 3 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 3)}>已支付</View>
        <View className={currTab == 4 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 4)}>已取消</View>
        <View className={currTab == 5 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 5)}>售后</View>
      </View>
      <View className='list_wrap'>
        {dataList.map((data, index) => (
          <View className='apply_wrap' key={data.id}>
            <View className='top_wrap'>
              {currTab == 1
                ? <Text className='create_time'>{'预报名日期：' + new Date(formatTimeStamp(data.create_time)).toLocaleDateString()}</Text>
                : null
              }
              {currTab == 2
                ? <Text className='create_time'>{'报名日期：' + new Date(formatTimeStamp(data.create_time)).toLocaleDateString()}</Text>
                : null
              }
              {currTab == 3
                ? <Text className='create_time'>{'支付日期：' + new Date(formatTimeStamp(data.update_time)).toLocaleDateString()}</Text>
                : null
              }
              {currTab == 4
                ? <Text className='create_time'>{'取消日期：' + new Date(formatTimeStamp(data.update_time)).toLocaleDateString()}</Text>
                : null
              }
              {currTab == 5
                ? <Text className='create_time'>{'申请日期：' + new Date(formatTimeStamp(data.update_time)).toLocaleDateString()}</Text>
                : null
              }
              {currTab == 6
                ? <Text className='create_time'>{'处理日期：' + new Date(formatTimeStamp(data.update_time)).toLocaleDateString()}</Text>
                : null
              }
              <Text className='status'>{data.status_text}</Text>
            </View>
            <View className='info_wrap' onClick={() => { Taro.navigateTo({ url: `/pages/studies/apply_detail/index?id=${data.id}&status=${currTab}` }) }}>
              <Image src={data.courseInfo.cover} className='cover' />
              <View className='info'>
                <View className='name'>{data.courseInfo.name}</View>
                <View className='session'>{'第' + (data.courseInfo.session.findIndex(item => data.session_id === item.id) + 1) + '期：' + new Date(data.courseInfo.session.find(item => data.session_id === item.id).begin_time).toLocaleDateString()}</View>
                <View className='people'>{`人数：${data.people} 人`}</View>
                {currTab == 2 && data.total_price
                  ? <View className='price'>{`应付 ¥${data.total_price}`}</View>
                  : null}
              </View>
            </View>
            {currTab == 1
              ? <View className='btn_wrap'>
                {/* <View className='btn cancle' onClick={cancle.bind(this, data.id)}>取消</View> */}
                <View className='btn plain' onClick={() => Taro.navigateTo({ url: `/pages/studies/update_preApply/index?pid=${data.id}` })}>修改</View>
                <View className='btn' onClick={() => Taro.navigateTo({ url: `/pages/studies/apply/index?pid=${data.id}&cid=${data.course_id}` })}>报名</View>
              </View>
              : null
            }
            {currTab == 2
              ? <View className='btn_wrap'>
                <View className='btn cancle' onClick={cancle.bind(this, data.id)}>取消</View>
                <View className='btn plain' onClick={() => Taro.navigateTo({ url: `/pages/studies/update_apply/index?pid=${data.id}` })}>修改</View>
                <View className='btn' onClick={pay.bind(this, data.id)}>支付</View>
              </View>
              : null
            }
            {currTab == 3
              ? <View className='btn_wrap'>
                <View className='btn plain' onClick={refund.bind(this, data.id)}>退款</View>
              </View>
              : null
            }
          </View>
        ))}
        {page * LIMIT >= total
          ? <View className='no_wrap'>
            <Image src='http://qiniu.daosuan.net/picture-1598884234000' mode='widthFix' className='icon_noMore' />
            <Text>没有更多啦</Text>
          </View>
          : <View className='get_more'>上拉加载更多</View>
        }
      </View>
    </View>
  )
}

export default connect(({ study }) => ({
  ...study
}))(PreApplyList)
