import Taro, { getCurrentInstance, useDidShow } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text, Image, Input, Picker } from "@tarojs/components"
import Navbar from '@components/navbar/navbar'
import { connect } from "react-redux"
import { timeFormat } from '@utils/time'
import { isValidPhone } from '@utils/check'

import './index.less'
import '../study_common.less'

function Apply(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const { courseInfos, dataList } = props
  const [currCourse, setCurrCourse] = useState({})
  const [currPreApply, setCurrPreApply] = useState({})
  const [sessionIndex, setSessionIndex] = useState(0)
  const [memberList, setMemberList] = useState([])
  const [idCard, setIdCard] = useState('')
  const [phone, setPhone] = useState('')

  useEffect(() => {
    // pid：预报名id， cid：课程id
    const { pid, cid } = getCurrentInstance().router.params

    // 设置当前报名的课程
    const currCourse = courseInfos.find(item => item.id == cid)
    setCurrCourse(currCourse)

    // 设置当前预报名信息
    const currPreApply = dataList.find(item => item.id == pid)
    setCurrPreApply(currPreApply)

    // 设置联系人手机号码
    setPhone(currPreApply.phone)

    // 设置场次在场次列表中的索引
    const sessionIndex = currCourse.session.findIndex(item => item.id === currPreApply.session_id)
    setSessionIndex(sessionIndex)
  }, [])

  useDidShow(() => {
    const list = Taro.getStorageSync('memberList')
    if (list.length != 0) {
      list.forEach(item => item.birth = new Date(item.birth).getTime())
      setMemberList(list.filter(item => item.checked))
    }
  })

  /* 添加成员 */
  function addMember() {
    Taro.navigateTo({
      url: '/pages/studies/member_list/index'
    })
  }

  /* 移除成员 */
  function removeMember(id) {
    let tempList = Taro.getStorageSync('memberList')
    tempList.forEach(item => {
      if (item.id === id) item.checked = false
    })
    setMemberList(tempList.filter(item => item.checked))
    Taro.setStorageSync('memberList', tempList)
  }

  /* 输入手机号码 */
  function checkPhone(phone) {
    if (isValidPhone(phone)) setPhone(phone)
    else Taro.showToast({
      title: '请填写正确的手机号码',
      icon: 'none'
    })
  }

  /* 去支付 */
  function checkOut() {
    if (memberList.length == 0) {
      Taro.showToast({
        title: '请选择参与的成员',
        icon: 'none'
      })
      return
    }

    let formArr = [phone, idCard]
    if (formArr.some(item => item == '')) {
      Taro.showToast({
        title: '请填写联系人信息',
        icon: 'none'
      })
      return
    }

    props.dispatch({
      type: 'study/preToApply',
      payload: {
        pid: currPreApply.id,
        session_id: currPreApply.session_id,
        parters: memberList,
        people: memberList.length,
        number: idCard,
        phone: phone
      }
    }).then(() => {
      Taro.showToast({
        title: '报名成功！',
        icon: 'success'
      })
      setTimeout(() => {
        Taro.redirectTo({
          url: '/pages/studies/preApply_list/index?status=' + 2
        })
      }, 2000)
    }).catch(err => {
      Taro.showToast({
        title: `报名失败，请重新尝试。(错误码${err.statusCode})`,
        icon: 'none'
      })
    })
  }

  return (
    <View className={isIphoneX ? 'isIphoneX apply' : 'apply'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='报名'
        backgroundColor='#2D79F7'
        color='#fff'
        backColor='white'
      />
      <View className='container_study'>
        <View className='course_info'>
          <Text className='name'>{currCourse.name}</Text>
          <View className='time'>
            <View className='date'>
              <View className='year'>{currCourse.session ? new Date(currCourse.session[sessionIndex].begin_time).getFullYear() + '年' : null}</View>
              <View>{currCourse.session ? timeFormat(currCourse.session[sessionIndex].begin_time, 'MMDD') : null}</View>
            </View>
            <View className='mid'>
              <View className='session'>{`第${sessionIndex + 1}期`}</View>
              <View className='day'>{`共${currCourse.session ? currCourse.session[sessionIndex].days : null}天`}</View>
            </View>
            <View className='date'>
              <View className='year'>{currCourse.session ? new Date(currCourse.session[sessionIndex].end_time).getFullYear() + '年' : null}</View>
              <View>{currCourse.session ? timeFormat(currCourse.session[sessionIndex].end_time, 'MMDD') : null}</View>
            </View>
          </View>
        </View>
        <View className='wrapper'>
          {memberList.map(member => (
            <View className='member_wrap' key={member.id}>
              <Image src='http://qiniu.daosuan.net/picture-1606228544000' className='del' onClick={removeMember.bind(this, member.id)} />
              <View className='info_wrap'>
                <View className='name'>{member.name}</View>
                <View className='idCard'>
                  <Text>二代身份证</Text>
                  <Text className='id_text'>{member.number.replace(member.number.substring(4, 15), '***********')}</Text>
                </View>
              </View>
            </View>
          ))}
          <View className='add_wrap' onClick={addMember.bind(this)}>
            <Image src='http://qiniu.daosuan.net/picture-1606228515000' />
            添加成员
          </View>
        </View>
        <View className='wrapper'>
          <View className='title_wrap'>联系人信息</View>
          <View className='input_wrap'>
            <View className='title'>证件</View>
            <Input type="idcard" placeholder='联系人证件号码' onBlur={(e) => setIdCard(e.detail.value)} />
          </View>
          <View className='input_wrap'>
            <View className='title'>手机号码</View>
            <Input type="number" value={phone} placeholder='联系人手机号码' onBlur={(e) => checkPhone(e.detail.value)} />
          </View>
        </View>
      </View>
      <View className={isIphoneX ? 'isIphoneX tool_bar' : 'tool_bar'}>
        <View className='bar_item' onClick={checkOut.bind(this)}>去支付</View>
      </View>
    </View>
  )
}

export default connect(({ study }) => ({
  ...study
}))(Apply)
