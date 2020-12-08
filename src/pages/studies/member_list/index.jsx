import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Image, Checkbox, Text } from "@tarojs/components"
import Navbar from '@components/navbar/navbar'

import './index.less'
import '../study_common.less'

export default function MemberList(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  let memberList = Taro.getStorageSync('memberList') || []
  const [tempList, setTempList] = useState(memberList)

  useDidShow(() => {
    memberList = Taro.getStorageSync('memberList') || []
    setTempList(memberList)
  })

  /* 添加成员 */
  function addMember() {
    Taro.navigateTo({
      url: '/pages/studies/add_member/index'
    })
  }

  /* 修改成员信息 */
  function updataMember(id) {
    Taro.navigateTo({
      url: '/pages/studies/update_member/index?id=' + id
    })
  }

  /* 点击复选框 */
  function checkedClick(index) {
    // 复制数组
    let list = [...tempList]
    list[index].checked = !list[index].checked

    setTempList(list)
  }

  /* 确认 */
  function confirm() {
    // 重新设置缓存
    Taro.setStorageSync('memberList', tempList)

    Taro.navigateBack({
      delta: 1
    })
  }

  return (
    <View className={isIphoneX ? 'isIphoneX member_list' : 'member_list'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='成员选择'
        backgroundColor='#2D79F7'
        color='#fff'
        backColor='white'
      />
      <View className='container'>
        <View className='btn_wrap wrapper'>
          <View className='btn' onClick={addMember.bind(this)}>
            <Image src='http://qiniu.daosuan.net/picture-1606228515000' />
              新增成员
            </View>
        </View>
        <View className='list_wrap wrapper'>
          {(memberList ?? []).map((item, index) => (
            <View className='member_wrap' key={item.id}>
              <Image src='http://qiniu.daosuan.net/icon-1606046423000' className='edit' onClick={updataMember.bind(this, item.id)} />
              <View className='info_wrap'>
                <View className='name'>{item.name}</View>
                <View className='idCard'>
                  <Text>身份证</Text>
                  <Text className='id_text'>{item.number.replace(item.number.substr(4, 11), '***********')}</Text>
                </View>
              </View>
              <View className='checkBox'>
                <Checkbox checked={item.checked} onClick={checkedClick.bind(this, index)} />
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className={isIphoneX ? 'isIphoneX tool_bar' : 'tool_bar'}>
        <View className='bar_item' onClick={confirm.bind(this)}>确认</View>
      </View>
    </View>
  )
}
