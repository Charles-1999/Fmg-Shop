import Taro, { getCurrentInstance, useDidShow, useReachBottom } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text, Image } from "@tarojs/components"
import Navbar from '@components/navbar/navbar'
import { connect } from "react-redux"
import { formatTimeStamp } from '@utils/time'

import './index.less'


function PreApplyList(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const [currTab, setCurrTab] = useState(1)
  const [dataList, setDataList] = useState([])
  const [courseInfos, setCourseInfos] = useState([])

  useDidShow(() => {
    const { status } = getCurrentInstance().router.params
    setCurrTab(status)
    // getPreApplyList(status == currTab ? currTab : status)
    getApplyList(status)
  })

  /* 触底加载 */
  useReachBottom(() => {
    let { page, total } = props
    if ( page * 10 < total)
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
        SCourseInfos =  SCourseInfos.reduce((item, next) => {
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

  // 切换tab
  function switchTab(tab) {
    setCurrTab(tab)
    getApplyList(tab)
  }

  /* 获取报名列表 */
  async function getApplyList(status, page = 1, limit = 10) {
    // 预报名状态 1: 取消, 2: 预报名, 4: 已报名
    // 已报名状态 1: 未支付, 2: 已支付, 4: 已取消
    // status 0: 全部, 1: 预报名, 2: 未支付, 3: 已支付, 4: 已取消,
    status = parseInt(status)
    const statusArr = [null, 2, 1, 2, 1]

    // 获取报名列表
    if ([2, 3].includes(status)) {
      props.dispatch({
        type: 'study/getApplyList',
        payload: {
          status: statusArr[status],
          page,
          limit,
        }
      })
    } else {
      // 获取预报名列表
      props.dispatch({
        type: 'study/getPreApplyList',
        payload: {
          status: statusArr[status],
          page,
          limit,
        }
      })
    }
  }

  /* 取消报名 */
  function cancle(pid) {
    Taro.showModal({
      title: '提示',
      content: '确认取消预定？',
      success: res => {
        if (res.confirm) {
          props.dispatch({
            type: 'study/canclePreApply',
            payload: {
              pid
            }
          }).then(() => {
            getPreApplyList(currTab)
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
        // backType='redirect'
        // url='/pages/studies/index'
        title='我的报名'
        color='#fff'
        backgroundImageStatus='linear-gradient(90deg, #2d79f8, #4279ea)'
        backgroundImageCapsule='linear-gradient(90deg, #2d79f8, #4279ea)'
      />
      <View className='tab_bar'>
        <View className={currTab == 0 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 0)}>全部</View>
        <View className={currTab == 1 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 1)}>预报名</View>
        <View className={currTab == 2 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 2)}>未支付</View>
        <View className={currTab == 3 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 3)}>已支付</View>
        <View className={currTab == 4 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 4)}>已取消</View>
      </View>
      <View className='list_wrap'>
        {dataList.map((data, index) => (
          <View className='apply_wrap' key={data.id}>
            <View className='top_wrap'>
              <Text className='create_time'>{'预报名日期：' + new Date(formatTimeStamp(data.create_time)).toLocaleDateString()}</Text>
              <Text className='status'>{data.status_text}</Text>
            </View>
            <View className='info_wrap'>
              <Image src={data.courseInfo.cover} className='cover' />
              <View className='info'>
                <View className='name'>{data.courseInfo.name}</View>
                <View className='session'>{'第' + (data.courseInfo.session.findIndex(item => data.session_id === item.id) + 1) + '期：' + new Date(data.courseInfo.session.find(item => data.session_id === item.id).begin_time).toLocaleDateString()}</View>
                <View className='people'>{`人数：${data.people} 人`}</View>
              </View>
            </View>
            {data.status == 2
              ? <View className='btn_wrap'>
                <View className='btn cancle' onClick={cancle.bind(this, data.id)}>取消</View>
                <View className='btn update' onClick={() => Taro.navigateTo({ url: `/pages/studies/update_preApply/index?pid=${data.id}` })}>修改</View>
                <View className='btn' onClick={() => Taro.navigateTo({ url: `/pages/studies/apply/index?pid=${data.id}&cid=${data.course_id}` })}>报名</View>
              </View>
              : null
            }
          </View>
        ))}
      </View>
    </View>
  )
}

export default connect(({ study }) => ({
  ...study
}))(PreApplyList)
