import Taro, { getApp, useDidShow } from '@tarojs/taro'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { View, Image, Text } from '@tarojs/components'
import Navbar from '@components/navbar/navbar'
import './index.less'

function Studies(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3
  const userInfo = Taro.getStorageSync('userInfo')

  const tabs = new Map([['course', 1], ['news', 2], ['my', 3]])
  const [currTab, setCurrTab] = useState(1)
  const { courseInfos, newsList } = props

  useDidShow(() => {
    if (currTab == tabs.get('course')) {
      getCourseList()
    } else if (currTab == tabs.get('news')) {
      getNewsList()
    }
  })

  /* 获取课程列表 */
  function getCourseList(page = 1, limit = 10) {
    props.dispatch({
      type: 'study/getCourseList',
      payload: {
        page,
        limit
      }
    })
  }

  /* 获取咨询列表 */
  function getNewsList(page = 1, limit = 10) {
    props.dispatch({
      type: 'study/getNewsList',
      payload: {
        page,
        limit
      }
    })
  }

  /* 切换Tab */
  function switchTab(tab) {
    setCurrTab(tab)

    if (tab == tabs.get('course')) {
      getCourseList()
    } else if (tab == tabs.get('news')) {
      getNewsList()
    }
  }

  function courseTap(id) {
    Taro.navigateTo({
      url: '/pages/studies/course/index?id=' + id
    })
  }

  function newsTap(id) {
    Taro.navigateTo({
      url: '/pages/studies/news/index?id=' + id
    })
  }

  function toPreApplyList(status = 0) {
    Taro.navigateTo({
      url: '/pages/studies/preApply_list/index?status=' + status
    })
  }

  return (
    <View className={isIphoneX ? 'isIphoneX studies' : 'studies'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        backType="switchTab"
        url="/pages/index/index"
        title='研学'
        backgroundColor='#2D79F7'
        color='#fff'
      >
      </Navbar>
      {currTab == 1 ?
        <View className='container_course'>
          <View className='big_title'>
            <Image src='http://qiniu.daosuan.net/picture-1598883875000' mode='heightFix' />
            <Text>最新课程</Text>
          </View>
          <View className='course_list'>
            {(courseInfos ?? []).map(course => (
              <View className='course_wrap' key={course.id} onClick={courseTap.bind(this, course.id)}>
                <Image src={course.cover} mode='widthFix' />
                <View className='course_info'>
                  <Text className='name'>{course.name}</Text>
                  <Text className='describe'>{course.describe}</Text>
                  <Text className='price'><Text className='sign'>￥</Text>{course.min_price}</Text>
                  <View className='tag_wrap'>
                    {course.course_tag.map(tag => (
                      <View className='tag' key={tag}></View>
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View className='big_title'>
            <Image src='http://qiniu.daosuan.net/picture-1598884155000' mode='heightFix' />
            <Text>热门课程</Text>
          </View>
        </View>
        : ''
      }
      {currTab == 2 ?
        <View className='container_course'>
          <View className='big_title'>
            <Image src='http://qiniu.daosuan.net/picture-1598883875000' mode='heightFix' />
            <Text>最新资讯</Text>
          </View>
          <View className='news_list'>
            {(newsList ?? []).map(news => (
              <View className='news' key={news.id} onClick={newsTap.bind(this, news.id)}>
                <View className='left'>
                  <View className='title'>{news.title}</View>
                  <View className='abstract'>{news.desc}</View>
                  <View className='time'>{new Date(news.create_time * 1000).toLocaleString()}</View>
                </View>
                <View className='right'>
                  <Image src={news.cover} />
                </View>
              </View>
            ))}
          </View>
        </View>
        : ''
      }
      {currTab == 3 ?
        <View className='container_user container'>
          <View className='user_info'>
            <Image className='avator' src={userInfo.avatarUrl} />
            <View className='name'>{userInfo.nickName}</View>
          </View>
          <View className='bottom'>
            <View className='item' onClick={toPreApplyList.bind(this, 1)}>预报名</View>
            <View className='item' onClick={toPreApplyList.bind(this, 2)}>已报名</View>
            <View className='item' onClick={toPreApplyList}>游记</View>
          </View>
        </View>
        : ''
      }
      <View className={isIphoneX ? 'isIphoneX tab_bar' : 'tab_bar'}>
        <View className={currTab == 1 ? 'active tab_item' : 'tab_item'} onClick={switchTab.bind(this, 1)}>课程</View>
        <View className={currTab == 2 ? 'active tab_item' : 'tab_item'} onClick={switchTab.bind(this, 2)}>资讯</View>
        <View className={currTab == 3 ? 'active tab_item' : 'tab_item'} onClick={switchTab.bind(this, 3)}>我的</View>
      </View>
    </View>
  )
}

export default connect(({ study }) => ({
  ...study
}))(Studies)
