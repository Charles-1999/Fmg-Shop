import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { View, Image, Text, Input, Picker } from '@tarojs/components'
import Navbar from '@components/navbar/navbar'
import './index.less'
import '../study_common.less'

function PreApply(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const [cid, setCid] = useState(0) // 课程id
  const [courseInfo, setCourseInfo] = useState({}) // 当前课程
  const [sessionArr, setSessionArr] = useState([]) // 可选的场次列表
  const [sessionIndex, setSessionIndex] = useState(0) // 选择的场次索引
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [people, setPeople] = useState('')

  useEffect(() => {
    const { cid } = getCurrentInstance().router.params
    setCid(cid)
    let courseInfo = props.courseInfos.find(course => course.id == cid)
    setSessionArr(courseInfo.session.map((item, index) => `第${index + 1}期`))
    setCourseInfo(courseInfo)
  }, [])

  /* 选择场次 */
  function handlePickerChange(e) {
    setSessionIndex(Number(e.detail.value))
  }

  /* 预报名 */
  async function preApply() {
    const formItems = [name, phone, people]
    if (formItems.some(item => item == '')) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    if (phone.length != 11) {
      Taro.showToast({
        title: '请填写正确的手机号码',
        icon: 'none'
      })
      return
    }
    await props.dispatch({
      type: 'study/preApply',
      payload: {
        cid,
        name,
        phone,
        people,
        session_id: courseInfo.session[sessionIndex].id
      }
    })
    Taro.showToast({
      title: '预报名成功！',
      icon: 'success',
      duration: 1000
    })
    setTimeout(() => {
      Taro.reLaunch({
        url: '/pages/studies/preApply_list/index?status=' + 1
      })
    }, 1000)
  }

  return (
    <View className={isIphoneX ? 'isIphoneX apply' : 'apply'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='预约报名'
        backgroundImageStatus='linear-gradient(90deg, #2d79f8, #4279ea)'
        backgroundImageCapsule='linear-gradient(90deg, #2d79f8, #4279ea)'
        color='#fff'
        backColor='white'
      />
      <View className='container'>
        <View className='wrapper'>
          <View className='title_wrap'>填写预约信息</View>
          <View className='input_wrap'>
            <View className='title'>姓名</View>
            <Input value={name} placeholder="联系人姓名" onBlur={(e) => { setName(e.detail.value.trim()) }} />
          </View>
          <View className='input_wrap'>
            <View className='title'>电话</View>
            <Input value={phone} placeholder="联系人电话" type="number" onBlur={(e) => { setPhone(e.detail.value.trim()) }} />
          </View>
          <View className='input_wrap'>
            <View className='title'>人数</View>
            <Input value={people} placeholder="预约人数" type="number" onBlur={(e) => { setPeople(Number(e.detail.value)) }} />
          </View>
          <View className='input_wrap'>
            <View className='title'>场次</View>
            <Picker mode="selector" className='session_picker' range={sessionArr} onChange={handlePickerChange}>
              <View className='picker_item'>{sessionArr[sessionIndex]}</View>
            </Picker>
          </View>
        </View>
        <View className='wrapper'>
          <View className='course_wrap'>
            <View className='title_wrap'>课程信息</View>
            <View className='name'>{courseInfo.name}</View>
          </View>
        </View>
        <View className='wrapper'>
          <View className='title_wrap'>场次信息</View>
          <View className='session_list'>
            {(courseInfo.session ?? []).map((session, index) => (
              <View className='session' key={session.id}>
                <View className='title'>第{index + 1}期</View>
                <View className='info_wrap'>
                  <Text className='title'>计划人数：</Text>
                  <Text className='content'>{session.people_limit}人</Text>
                </View>
                <View className='info_wrap'>
                  <Text className='title'>价格：</Text>
                  <Text className='content'>¥{session.money}</Text>
                </View>
                <View className='info_wrap'>
                  <Text className='title'>活动时间：</Text>
                  <Text className='content'>{new Date(session.begin_time).toLocaleDateString() + ' - ' + new Date(session.end_time).toLocaleDateString()}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View className={isIphoneX ? 'isIphoneX tool_bar' : 'tool_bar'}>
        <View className='bar_item' onClick={preApply}>确认提交</View>
      </View>
    </View>
  )
}

export default connect(({ study }) => ({
  ...study
}))(PreApply)
