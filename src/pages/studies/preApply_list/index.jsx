import Taro, { getCurrentInstance } from '@tarojs/taro'
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

  const [currTab, setCurrTab] = useState(0)
  const [dataList, setDataList] = useState([])

  useEffect(() => {
    const { status } = getCurrentInstance().router.params
    switchTab(status)
  }, [])

  function switchTab(tab) {
    setCurrTab(tab)
    getPreApplyList(tab)
  }

  /* 获取预报名列表 */
  async function getPreApplyList(status) {
    // 1: 取消, 2: 预报名, 4: 已报名
    const statusArr = [null, 2, 4, null, 1]

    // 获取预报名列表
    await props.dispatch({
      type: 'study/getPreApplyList',
      payload: {
        status: statusArr[status],
        page: 1,
        limit: 100
      }
    }).then(preApplyList => {
      const ids = preApplyList.map(item => item.id)
      mgetPreApply(ids)
    })
  }

  /* 批量获取预报名信息 */
  async function mgetPreApply(ids) {
    await props.dispatch({
      type: 'study/mgetPreApply',
      payload: {
        ids
      }
    }).then(preApply => {
      const ids = preApply.map(item => item.course_id)
      mgetCourseInfo(ids, preApply)
    })
  }

  /* 批量获取课程信息 */
  async function mgetCourseInfo(ids, preApply) {
    ids = [...new Set(ids)]
    await props.dispatch({
      type: 'study/mgetCourseInfo',
      payload: {
        ids
      }
    }).then(courseInfo => {
      preApply.forEach(apply => {
        apply = Object.assign(apply, { courseInfo: courseInfo.find(course => course.id === apply.course_id) })
      })
      setDataList(preApply)
    })
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
        backType='redirect'
        url='/pages/studies/index'
        title='预报名'
      />
      <View className='tab_bar'>
        <View className={currTab == 0 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 0)}>全部</View>
        <View className={currTab == 1 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 1)}>预报名</View>
        <View className={currTab == 2 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 2)}>已报名</View>
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
                <View className='btn'>报名</View>
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
