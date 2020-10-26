import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import Navbar from '@components/navbar/navbar'
import { get as getGlobalData } from '../../global_data'
import request from '../../utils/request'

import './index.less'

export default class Studies extends Component {
  constructor(props) {
    super(props)
    this.state = {
      statusBarHeight: getGlobalData('statusBarHeight'),
      capsule: getGlobalData('capsule'),
      currTab: 1,
      data: [
        {
          id: 1,
          nums: 10,
          img: 'http://qiniu.daosuan.net/picture-1603293201000',
          title: '学生“自然课堂”研学实践活动',
          content: '打造自然生态课堂，深入了解湖北历史、地理和人文背景，在细节中学习，反思自我，完善人格。'
        }, {
          id: 2,
          nums: 25,
          img: 'http://qiniu.daosuan.net/picture-1603293254000',
          title: '荆门爱飞客三日研学旅行',
          content: '解秘空气动力学、流体力学等科学知识，探宄 高科技机器人、3D打印技术，感受飞行探秘者向小小飞行家的激情蜕变。'
        }, {
          id: 3,
          nums: 9,
          img: 'http://qiniu.daosuan.net/picture-1603293272000',
          title: '饱览华夏千年历史——北京研学之旅',
          content: '寻访无人机研学基地，学习无人机相关知识，能够操作无人机进行简单飞行。'
        }, {
          id: 4,
          nums: 30,
          img: 'http://qiniu.daosuan.net/picture-1603293284000',
          title: '2020冬令营 | 长白山冰雪奇缘亲子营：冰雪视界，遇见奇妙',
          content: '2020年寒假，我们相约长白山，感受冬天应该有的样子：体验嘎巴嘎巴的冷，仰望最湛蓝的天空，在原始森林里穿越，揭秘天池的神秘面纱，寻找东北民俗文化，农夫山泉水源地调研......'
        },
      ],
      infomations: [
        {
          abstract: "为满足人民群众日益增长的旅游休闲需求，促进旅游休闲产业健康发展，推进具有中国特色的国民旅游休闲体系建设，根据《国务院关于加快发展旅游业的意见》（国发〔2009〕41号），制定本纲要。",
          cover: "http://qiniu.daosuan.net/picture-1603436018000",
          create_time: 1591103432,
          id: 10,
          status: 2,
          title: "国民旅游休闲纲要",
          update_time: 1591103432,
        }, {
          abstract: "聚焦综合素质评价，第五届中国研学旅行论坛在北京师范大学珠海园区成功举办",
          cover: "http://qiniu.daosuan.net/picture-1603436018000",
          create_time: 1590907570,
          id: 11,
          status: 2,
          title: "第五届中国研学旅行论坛：中国研学事业将进入专业化发展时代",
          update_time: 1590911458,
        }, {
          abstract: "2020年5月27日，世纪明德湖北公司为响应湖北省政府关于重振旅游行业的决定，在总部的支持和陈总的关怀下，由世纪明德高级副总裁、新兴事业群总经理王吉带领湖北公司全员奔赴武汉市黄陂区木兰天池景区开展20夏周期首次团建活动。",
          cover: "http://qiniu.daosuan.net/picture-1603435958000",
          create_time: 1590811720,
          id: 7,
          status: 2,
          title: "荆楚子弟多才俊 疫后重来未可知",
          update_time: 1590906529,
        }, {
          abstract: "2020年4月30日，世纪明德集团董事长、总裁陈自富，世纪明德集团董事、高级副总裁黎明，世纪明德湖南公司总经理陈敏，世纪明德贵州公司总经理王冬梅，世纪明德怀化公司总经理胡基红一行到访怀化市溆浦县，考察当地研学旅行发展情况及北斗溪营地开发现状。",
          cover: "http://qiniu.daosuan.net/picture-1603436033000",
          create_time: 1590818110,
          id: 8,
          status: 2,
          title: "精诚协作，共创未来丨世纪明德与溆浦县人民政府签订战略合作协议",
          update_time: 1590818215,
        }, {
          abstract: "",
          cover: "http://qiniu.daosuan.net/picture-1603436018000",
          create_time: 1589434738,
          id: 3,
          status: 2,
          title: "教育部：国家将进一步加大推进研学实践教育工作力度",
          update_time: 1589434854,
        }, {
          abstract: "",
          cover: "http://qiniu.daosuan.net/picture-1603435958000",
          create_time: 1589434824,
          id: 4,
          status: 2,
          title: "研学旅行遇政策风口，行业爆发还有多远？",
          update_time: 1589434854,
        }, {
          abstract: "中小学学生赴境外研学旅行活动指南（试行）",
          cover: "http://qiniu.daosuan.net/picture-1603436018000",
          create_time: 1589379219,
          id: 2,
          status: 2,
          title: "中小学学生赴境外研学旅行活动指南（试行）",
          update_time: 1589379241,
        }
      ]
    }
  }

  componentDidMount = () => {

  }

  itemTap(id) {
    Taro.navigateTo({
      url: '/pages/studies/course/index'
    })
  }

  newsTap() {
    Taro.navigateTo({
      url: '/pages/studies/news/index'
    })
  }

  // 自己封装的setState
  setData = (...params) => {
    this.setState(...params)
    console.log(...params)
  }

  render() {
    console.log('%c ........render.........', 'color:green');
    const { statusBarHeight, capsule, currTab, data, infomations } = this.state;
    const isIphoneX = Taro.getStorageSync('isIphoneX');
    const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;

    return (
      <View className={isIphoneX ? 'isIphoneX studies' : 'studies'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
        <Navbar
          statusBarHeight={statusBarHeight}
          capsuleHeight={capsuleHeight}
          showTitle
          showBack
          title='研学'
        >
        </Navbar>
        {currTab == 1 ?
          <View className='container'>
            <View className='big_title'>
              <Image src='http://qiniu.daosuan.net/picture-1598883875000' mode='heightFix' />
              <Text>最新课程</Text>
            </View>
            <View className='waterFall'>
              <View className='left' id='left'>
                {((data ?? []).filter(x => x.id % 2 != 0)).map(item => (
                  <View className='item' key={item.id} onClick={this.itemTap.bind(this, item.id)}>
                    <Image src={item.img} mode='widthFix' />
                    <Text className='title'>{item.title}</Text>
                    <View className='nums'>{item.nums}<Text>人已报名</Text></View>
                    <Text className='content'>{item.content}</Text>
                  </View>
                ))}
              </View>
              <View className='right' id='right'>
                {((data ?? []).filter(x => x.id % 2 == 0)).map(item => (
                  <View className='item' key={item.id} onClick={this.itemTap.bind(this, item.id)}>
                    <Image src={item.img} mode='widthFix' />
                    <Text className='title'>{item.title}</Text>
                    <View className='nums'>{item.nums}<Text>人已报名</Text></View>
                    <Text className='content'>{item.content}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className='big_title'>
              <Image src='http://qiniu.daosuan.net/picture-1598884155000' mode='heightFix' />
              <Text>热门课程</Text>
            </View>
            <View className='waterFall'>
              <View className='left' id='left'>
                {((data ?? []).filter(x => x.id % 2 != 0)).map(item => (
                  <View className='item' key={item.id}>
                    <Image src={item.img} mode='widthFix' />
                    <Text className='title'>{item.title}</Text>
                    <View className='nums'>{item.nums}<Text>人已报名</Text></View>
                    <Text className='content'>{item.content}</Text>
                  </View>
                ))}
              </View>
              <View className='right' id='right'>
                {((data ?? []).filter(x => x.id % 2 == 0)).map(item => (
                  <View className='item' key={item.id}>
                    <Image src={item.img} mode='widthFix' />
                    <Text className='title'>{item.title}</Text>
                    <View className='nums'>{item.nums}<Text>人已报名</Text></View>
                    <Text className='content'>{item.content}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          : ''
        }
        {currTab == 2 ?
          <View className='container'>
            <View className='big_title'>
              <Image src='http://qiniu.daosuan.net/picture-1598883875000' mode='heightFix' />
              <Text>最新资讯</Text>
            </View>
            <View className='news_list'>
              {infomations.map(item => (
                <View className='news' key={item.id} onClick={this.newsTap}>
                  <View className='left'>
                    <View className='title'>{item.title}</View>
                    <View className='abstract'>{item.abstract}</View>
                    <View className='time'>{new Date(item.create_time*1000).toLocaleString()}</View>
                  </View>
                  <View className='right'>
                    <Image src={item.cover} />
                  </View>
                </View>
              ))}
            </View>
          </View>
          : ''
        }
        <View className={isIphoneX ? 'isIphoneX tab_bar' : 'tab_bar'}>
          <View className={currTab == 1 ? 'active tab_item' : 'tab_item'} onClick={() => { this.setData({ currTab: 1 }) }}>课程</View>
          <View className={currTab == 2 ? 'active tab_item' : 'tab_item'} onClick={() => { this.setData({ currTab: 2 }) }}>资讯</View>
        </View>
      </View>
    )
  }
}