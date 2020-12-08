import Taro, { getCurrentInstance } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { View, Image, Text, RichText, Button } from '@tarojs/components'
import Navbar from '@components/navbar/navbar'
import MySwiper from './swiper'
import './index.less'

function Course(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const [currTab, setCurrTab] = useState(0)
  const [courseInfo, setCourseInfo] = useState({})
  const [content, setContent] = useState(courseInfo.detail)
  const [cid, setCid] = useState(0)

  useEffect(() => {
    const { id } = getCurrentInstance().router.params
    setCid(id)
    let courseInfo = props.courseInfos.find(course => course.id == id)

    // 获取课程标签
    props.dispatch({
      type: 'study/mgetCourseTags',
      payload: {
        ids: courseInfo.course_tag
      }
    })

    setCourseInfo(courseInfo)
    setContent(courseInfo.detail)
  }, [])

  function switchTab(tab_id) {
    setCurrTab(tab_id)

    if (tab_id == 0) setContent(courseInfo.detail)
    else if(tab_id == 1) setContent(courseInfo.plan)
    else if(tab_id == 3) setContent(courseInfo.attention)
  }

  function apply() {
    Taro.navigateTo({
      url: '/pages/studies/preApply/index?cid=' + cid
    })
  }

  return (
    <View className={isIphoneX ? 'isIphoneX course' : 'course'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='研学课程'
        backgroundImageStatus='linear-gradient(90deg, #2d79f8, #4279ea)'
        backgroundImageCapsule='linear-gradient(90deg, #2d79f8, #4279ea)'
        color='#fff'
        backColor='white'
      >
      </Navbar>
      <MySwiper pictures={courseInfo.pictures} />
      <View className='baseInfo'>
        <View className='title'>{courseInfo.name}</View>
        <View className='sub_title'>{courseInfo.small_name}</View>
        <View className='content'>适合人群：{courseInfo.crowd}</View>
        <View className='content'>研学地点：广东省江门市鹤山市</View>
        <View className='content'>行程天数：{courseInfo.days}</View>
        <View className='content'>研学日期：{courseInfo.date}</View>
        <View className='tags'>
          {(props.courseTags ?? []).map(item => (
            <View className='tag' key={item.id}>{item.name}</View>
          ))}
        </View>
      </View>
      <View className='container'>
        <View className='tab_bar'>
          <View className={currTab==0?'tab_item active':'tab_item'} onClick={switchTab.bind(this,0)}>课程详情</View>
          <View className={currTab==1?'tab_item active':'tab_item'} onClick={switchTab.bind(this,1)}>行程安排</View>
          <View className={currTab==2?'tab_item active':'tab_item'} onClick={switchTab.bind(this,2)}>开营时间</View>
          <View className={currTab==3?'tab_item active':'tab_item'} onClick={switchTab.bind(this,3)}>注意事项</View>
        </View>
        <View className='content'>
          {currTab == 2
            ? <View className='session_list'>
                {courseInfo.session.map((session, index) => (
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
            : <RichText nodes={content}></RichText>
          }
        </View>
      </View>
      <View className={isIphoneX ? 'isIphoneX tool_bar' : 'tool_bar'} >
        <View className='tool_item'>
          <Image src='http://qiniu.daosuan.net/picture-1598882867000' mode='widthFix' />
          <Text>分享</Text>
          <Button openType='share'></Button>
        </View>
        <View className='tool_item'>
          <Image src='http://qiniu.daosuan.net/picture-1598883925000' mode='widthFix' />
          <Text>收藏</Text>
        </View>
        <View className='tool_item_2' onClick={apply.bind(this)}>
          预约报名
        </View>
      </View>
    </View>
  )
}
export default connect(({ study }) => ({
  ...study
}))(Course)
