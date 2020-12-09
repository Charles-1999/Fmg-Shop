import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Navbar from '@components/navbar/navbar'
import { connect } from 'react-redux'
import { timeFormat } from '@utils/time'

import './index.less'
// import '../style/study_common.less'

function ApplyDetail(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const { dataList } = props
  const [currCourse, setCurrCourse] = useState({})
  const [apply, setApply] = useState(null)
  const [sessionIndex, setSessionIndex] = useState(0)

  useEffect(() => {
    const { id } = getCurrentInstance().router.params

    // 设置当前报名信息
    const apply = dataList.find(item => item.id == id)
    setApply(apply)

    // 设置当前课程信息
    const currCourse = apply.courseInfo
    setCurrCourse(currCourse)

    // 设置场次在场次列表中的索引
    const sessionIndex = currCourse.session.findIndex(item => item.id === apply.session_id)
    setSessionIndex(sessionIndex)
  }, [])

  return (
    <View className={isIphoneX ? 'isIphoneX apply_detail' : 'apply_detail'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='报名详情'
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
        {apply && apply.parters ?
          <View className='member_list wrapper'>
            <View className='title_wrap'>成员信息</View>
            {apply.parters.map(member => (
              <View className='member_wrap' key={member.id}>
                <View className='info_wrap'>
                  <View className='name'><Text>{member.name}</Text><Text>{member.sex == 1 ? '男' : '女'}</Text><Text>{member.phone}</Text></View>
                  <View className='idCard'>
                    <Text>二代身份证</Text>
                    <Text className='id_text'>{member.number.replace(member.number.substring(4, 15), '***********')}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
          : null
        }
        {apply && apply.pre_apply ?
          <View className='contact wrapper'>
            <View className='title_wrap'>联系人信息</View>
            <View className='contact_wrap'>
              <View className='info_wrap'>
                <View className='name'><Text>{apply.pre_apply.name}</Text><Text>{apply.pre_apply.phone}</Text></View>
              </View>
            </View>
          </View>
          : null
        }
        {apply && apply.name ?
          <View className='contact wrapper'>
            <View className='title_wrap'>联系人信息</View>
            <View className='contact_wrap'>
              <View className='info_wrap'>
                <View className='name'><Text>{apply.name}</Text><Text>{apply.phone}</Text></View>
              </View>
            </View>
          </View>
          : null
        }
        {apply ?
          <View className='order_wrap wrapper'>
            <View className='title_wrap'>订单详情</View>
            <View className='order_info'>
              <View className='title'>报名人数</View>
              <View className='content'>{apply.people}人</View>
            </View>
            {apply.total_price ?
              <View className='order_info'>
                <View className='title'>订单总价</View>
                <View className='content'><Text className='sign'>¥</Text>{apply.total_price}</View>
              </View>
              : null
            }
            <View className='status'>
              {apply.status_text}
            </View>
          </View>
          : null
        }
      </View>
      <View className={isIphoneX ? 'isIphoneX tool_bar' : 'tool_bar'}>
        {apply && apply.status_text == '预报名'
          ? <View className='bar_item' onClick={() => {Taro.navigateTo({url: `/pages/studies/apply/index?pid=${apply.id}&cid=${apply.course_id}`})}}>报名</View>
          : null
        }
        {apply && apply.status_text == '未支付'
          ? <View className='bar_item' onClick={() => { }}>支付</View>
          : null
        }
      </View>
    </View>
  )
}

export default connect(({ study }) => ({
  ...study
}))(ApplyDetail)
