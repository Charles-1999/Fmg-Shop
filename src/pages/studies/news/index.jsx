import React, { useState, useEffect } from 'react'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { View, RichText } from '@tarojs/components'
import Navbar from '@components/navbar/navbar'

import './index.less'
import { connect } from 'react-redux'

function News(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  const [data, setData] = useState({})

  useEffect(() => {
    const { id } = getCurrentInstance().router.params
    let data = props.newsList.find(item => item.id == id)
    setData(data)
  }, [])

  return (
    <View className={isIphoneX ? 'isIphoneX news' : 'news'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
      <Navbar
        statusBarHeight={statusBarHeight}
        capsuleHeight={capsuleHeight}
        showTitle
        showBack
        title='研学资讯'
        color='#fff'
        backgroundImageStatus='linear-gradient(90deg, #2d79f8, #4279ea)'
        backgroundImageCapsule='linear-gradient(90deg, #2d79f8, #4279ea)'
        backColor='white'
      >
      </Navbar>
      <View className='container_news'>
        <View className='title_wrap'>
          <View className='title'>{data.title}</View>
          <View className='info'>
            <View className='time'>发布时间：{new Date(data.create_time*1000).toLocaleString()}</View>
            {/* <View className='institution'>标签：{}</View> */}
          </View>
        </View>
        <View className='content'>
          <RichText nodes={data.content} />
        </View>
      </View>
    </View>
  )
}

export default connect(({ study }) => ({
  ...study
}))(News)
