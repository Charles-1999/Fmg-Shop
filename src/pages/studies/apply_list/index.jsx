import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View } from "@tarojs/components"
import Navbar from '@components/navbar/navbar'
import { connect } from "react-redux"

import './index.less'


function ApplyList(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const [currTab, setCurrTab] = useState(0)
  const [dataList, setDataList] = useState([])

  useEffect(() => {
    const { status } = getCurrentInstance().router.params
    getPreApplyList(status)
  }, [])

  function switchTab(tab) {
    setCurrTab(tab)
    getPreApplyList(tab)
  }

  // 获取预报名列表
  async function getPreApplyList(status) {
    // 1: 取消, 2: 预报名, 4: 已报名
    const statusArr = [null, 2, 4, null, 1]

    // 获取预报名列表
    await props.dispatch({
      type: 'study/getPreApplyList',
      payload: {
        status: statusArr[status]
      }
    })
    console.log(props.preApplyList)
    const ids = props.preApplyList.map(item => item.id)
    mgetPreApply(ids)
  }

  // 批量获取预报名信息
  async function mgetPreApply(ids) {
    await props.dispatch({
      type: 'study/mgetPreApply',
      payload: {
        ids
      }
    })
  }

  return (
    <View className={isIphoneX ? 'isIphoneX apply_list' : 'apply_list'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='我的报名'
      />
      <View className='tab_bar'>
        <View className={currTab == 0 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 0)}>全部</View>
        <View className={currTab == 1 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 1)}>预报名</View>
        <View className={currTab == 2 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 2)}>已报名</View>
        <View className={currTab == 3 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 3)}>已结束</View>
        <View className={currTab == 4 ? 'tab_item active' : 'tab_item'} onClick={switchTab.bind(this, 4)}>已取消</View>
      </View>
      <View className='list_wrap'>
        {dataList.map((data, index) => (
          <View className='apply_wrap' key={data.id}></View>
        ))}
      </View>
    </View>
  )
}

export default connect(({ study }) => ({
  ...study
}))(ApplyList)
