import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text, Input, RadioGroup, Label, Radio, Picker } from "@tarojs/components"
import Navbar from '@components/navbar/navbar'
import { isValidPhone } from '@utils/check'

import './index.less'
import '../study_common.less'

export default function AddMember(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const sexs = [
    {
      value: 1,
      text: '男',
      checked: true
    },{
      value: 2,
      text: '女',
      checked: false
    },
  ]

  const [name, setName] = useState('')
  const [idCard, setIdCard] = useState('')
  const [phone, setPhone] = useState('')
  const [sex, setSex] = useState('')
  const [birth, SetBirth] = useState('')

  /* 确认 */
  function comfirm() {
    let sex = sexs.find(item => item.checked).value
    let formArr = [name, idCard, phone, sex, birth]
    if (formArr.some(item => item == '')) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    let member = { name, number: idCard, phone, sex, birth, checked: false }
    let memberList = Taro.getStorageSync('memberList') || []

    // 设置member的id值
    let id
    if (memberList.length === 0) {
      id = 1
    }
    else id = Math.max(...memberList.map(item => item.id)) + 1

    // 动态添加属性
    let member_temp = Object.assign(member, { id })

    // 加入到缓存
    memberList.push(member_temp)
    Taro.setStorageSync('memberList', memberList)

    Taro.navigateBack({
      delta: 1
    })
  }

  /* 输入手机号码 */
  function checkPhone(phone) {
    if (isValidPhone(phone)) setPhone(phone)
    else Taro.showToast({
      title: '请填写正确的手机号码',
      icon: 'none'
    })
  }

  return (
    <View className={'add_member'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='添加成员'
        backgroundColor='#2d79f8'
        color='#fff'
        backColor='white'
      />
      <View className='container_study'>
        <View className='wrapper'>
          <View className='input_wrap'>
            <View className='title'>姓名</View>
            <Input type="text" placeholder='与成员证件姓名一致' onBlur={(e) => setName(e.detail.value)}/>
          </View>
          <View className='input_wrap'>
            <View className='title'>性别</View>
            <View className='radio-list'>
              <RadioGroup>
                {sexs.map((item, index) => (
                  <Label className='radio-list_label' key={index} for={index}>
                    <Radio className='radio-list_radio' value={item.value} checked={item.checked} color="#2d79f8">{item.text}</Radio>
                  </Label>
                ))}
              </RadioGroup>
            </View>
          </View>
          <View className='input_wrap'>
            <View className='title'>出生日期</View>
            <Picker mode="date" className='date_picker' end={new Date().toLocaleDateString()} onChange={(e) => { SetBirth(e.detail.value) }}>
                <View className='picker_view'>{birth == '' ? <Text>请选择</Text> : birth}</View>
            </Picker>
          </View>
          <View className='input_wrap'>
            <View className='title'>证件类型</View>
            <View className='text'>二代身份证</View>
          </View>
          <View className='input_wrap'>
            <View className='title'>证件</View>
            <Input type="idcard" placeholder='与成员证件号码一致' onBlur={(e) => setIdCard(e.detail.value)}/>
          </View>
          <View className='input_wrap'>
            <View className='title'>手机号码</View>
            <Input type="number" placeholder='成员本人手机号码' onBlur={(e) => checkPhone(e.detail.value)}/>
          </View>
          <View className='btn_wrap'>
            <View className='btn' onClick={comfirm.bind(this)}>确认</View>
          </View>
        </View>
      </View>
    </View>
  )
}
