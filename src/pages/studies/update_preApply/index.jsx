import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, Input, Picker } from "@tarojs/components"
import Navbar from '@components/navbar/navbar'
import { connect } from "react-redux"

import './index.less'

function UpdatePreApply(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const { preApply, courseInfos } = props
  const [currApply, setCurrApply] = useState({}) // 当前预报名信息
  const [courseInfo, setCourseInfo] = useState({}) // 当前课程
  const [sessionArr, setSessionArr] = useState([]) // 可选的场次列表
  const [sessionIndex, setSessionIndex] = useState(0) // 选择的场次索引
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [people, setPeople] = useState('')

  useEffect(() => {
    const { pid } = getCurrentInstance().router.params

    // 获取当前预报名的信息
    const currApply = preApply.find(item => item.id == pid)
    setCurrApply(currApply)
    setName(currApply.name)
    setPhone(currApply.phone)
    setPeople(currApply.people)

    // 获取当前报名的课程信息
    const courseInfo = courseInfos.find(item => item.id == currApply.course_id)
    setCourseInfo(courseInfo)

    // 设置当前选择的场次
    setSessionIndex(courseInfo.session.findIndex(item => item.id === currApply.session_id))

    // 设置可选的场次列表
    setSessionArr(courseInfo.session.map((item, index) => `第${index + 1}期`))
  }, [])


  /* 选择场次 */
  function handlePickerChange(e) {
    setSessionIndex(Number(e.detail.value))
  }

  /* 修改预报名信息 */
  async function update() {
    await props.dispatch({
      type: 'study/updatePreApply',
      payload: {
        pid: currApply.id,
        name,
        phone,
        people,
        session_id: courseInfo.session[sessionIndex].id
      }
    })
    Taro.showToast({
      title: '修改成功！',
      icon: 'success',
      duration: 1000
    })
    setTimeout(() => {
      Taro.redirectTo({
        url: '/pages/studies/preApply_list/index?status=' + 1
      })
    }, 1000)
  }

  return (
    <View className={isIphoneX ? 'isIphoneX update_preApply' : 'update_preApply'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='修改预报名信息'
      />
      <View className='form_wrap'>
        <View className='title_wrap'>修改预报名信息</View>
        <View className='form_item'>
          <View className='title'>姓名</View>
          <Input value={name} placeholder="联系人姓名" onBlur={(e) => { setName(e.detail.value.trim()) }} />
        </View>
        <View className='form_item'>
          <View className='title'>电话</View>
          <Input value={phone} placeholder="联系人电话" type="number" onBlur={(e) => { setPhone(e.detail.value.trim()) }} />
        </View>
        <View className='form_item'>
          <View className='title'>人数</View>
          <Input value={people} placeholder="预约人数" type="number" onBlur={(e) => { setPeople(Number(e.detail.value)) }} />
        </View>
        <View className='form_item'>
          <View className='title'>场次</View>
          <Picker mode="selector" className='picker' range={sessionArr} onChange={handlePickerChange}>
            <View className='picker_item'>{sessionArr[sessionIndex]}</View>
          </Picker>
        </View>
      </View>
      <View className='course_wrap'>
        <View className='title_wrap'>课程信息</View>
        <View className='name'>{courseInfo.name}</View>
      </View>
      <View className='session_wrap'>
        <View className='title_wrap'>场次信息</View>
        <View className='session_list'>
          {(courseInfo.session ?? []).map((session, index) => (
            <View className='session' key={session.id}>
              <View className='title'>第{index + 1}期</View>
              <View className='info_wrap'>
                <Text className='title'>计划人数：</Text>
                <Text className='content'>{session.people_limit}</Text>
              </View>
              <View className='info_wrap'>
                <Text className='title'>价格：</Text>
                <Text className='content'>{session.money}</Text>
              </View>
              <View className='info_wrap'>
                <Text className='title'>活动时间：</Text>
                <Text className='content'>{new Date(session.begin_time).toLocaleDateString() + ' - ' + new Date(session.end_time).toLocaleDateString()}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View className={isIphoneX ? 'isIphoneX tool_bar' : 'tool_bar'}>
        <View className='bar_item' onClick={update}>确认修改</View>
      </View>
    </View>
  )
}

export default connect(({ study }) => ({
  ...study
}))(UpdatePreApply)
