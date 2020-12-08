import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text, Input, RadioGroup, Label, Radio, Picker } from "@tarojs/components"
import Navbar from '@components/navbar/navbar'

import './index.less'
import '../study_common.less'

export default function UpdataMember(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  let sexArr = [
    {
      value: 1,
      text: '男',
      checked: false
    },{
      value: 2,
      text: '女',
      checked: false
    },
  ]

  const [sexs, setSexs] = useState(sexArr)
  let memberList = Taro.getStorageSync("memberList")
  const [id, setId] = useState(Infinity)
  const [name, setName] = useState('')
  const [idCard, setIdCard] = useState('')
  const [phone, setPhone] = useState('')
  const [sex, setSex] = useState('')
  const [birth, SetBirth] = useState('')

  useEffect(() => {
    const { id } = getCurrentInstance().router.params
    const member = memberList.find(item => item.id == id)

    // 设置性别
    let temp = [...sexs]
    temp.forEach(item => item.checked = item.value == member.sex ? true : false)
    setSexs(temp)
    setId(member.id)
    setName(member.name)
    setSex(member.sex)
    setIdCard(member.number)
    setPhone(member.phone)
    SetBirth(member.birth)
  }, [])

  /* 处理性别单选框变更事件 */
  function handleRadioChange(e) {
    setSex(e.detail.value)
  }

  /* 确认 */
  function comfirm() {
    let formArr = [name, idCard, phone, sex, birth]
    if (formArr.some(item => item == '')) {
      Taro.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    // 更新信息
    let member = { id, name, number: idCard, phone, sex, birth }
    const index = memberList.findIndex(item => item.id == id)
    memberList.splice(index, 1, member)

    // 加入到缓存
    Taro.setStorageSync('memberList', memberList)

    Taro.navigateBack({
      delta: 1
    })
  }

  return (
    <View className={'updata_member'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='更新成员信息'
        backgroundColor='#2D79F7'
        color='#fff'
        backColor='white'
      />
      <View className='container'>
        <View className='wrapper'>
          <View className='input_wrap'>
            <View className='title'>姓名</View>
            <Input type="text" value={name} placeholder='与成员证件姓名一致' onBlur={(e) => setName(e.detail.value)}/>
          </View>
          <View className='input_wrap'>
            <View className='title'>性别</View>
            <View className='radio-list'>
              <RadioGroup onChange={handleRadioChange.bind(this)}>
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
            <Input type="idcard" value={idCard} placeholder='与成员证件号码一致' onBlur={(e) => setIdCard(e.detail.value)}/>
          </View>
          <View className='input_wrap'>
            <View className='title'>手机号码</View>
            <Input type="number" value={phone} placeholder='成员本人手机号码' onBlur={(e) => setPhone(e.detail.value)}/>
          </View>
          <View className='btn_wrap'>
            <View className='btn' onClick={comfirm.bind(this)}>确认</View>
          </View>
        </View>
      </View>
    </View>
  )
}
