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
  const data = {
    address: {
      city_id: 170,
      city_name: "武汉市",
      country_id: 1,
      country_name: "中国",
      details: "汇源农谷体验园",
      district_id: 0,
      district_name: "",
      id: 13,
      province_id: 17,
      province_name: "湖北省",
      zip_code: ""
    },
    attribute: 0,
    author_id: 4,
    course_type: 4,
    cover: ["picture-1603293284000"],
    description: "打造自然生态课堂，深入了解湖北历史、地理和人文背景，在细节中学习，反思自我，完善人格。",
    details: "<p>1、走进基地、疏导研学课程目标，开营仪式，军事训练、队列训练、体验军旅生活，学会自强自立。</p><p>2、读万卷书，行万里路。少年儿童亲身体验科学的变化无穷和创造的无限乐趣，激发探索科学奥秘的热情，是课堂教育的补充，培养科学探索的兴趣，提供科学实践的机会。</p><p>3、打造自然生态课堂，深入了解湖北历史、地理和人文背景，在细节中学习，反思自我，完善人格。</p>",
    end_time: 1592582400,
    enroll_additional: "",
    id: 27,
    institution_id: 1,
    notice: '<p><span style="color: rgb(51, 51, 51);">1、出发前，相关人员沟通出行计划。</span></p><p><span style="color: rgb(51, 51, 51);">2、提前15天报名。&nbsp;（每批次200人左右，每车45人左右）</span></p><p><span style="color: rgb(51, 51, 51);">3、实际行程线路安排，可能根据天气等原因有所调整。</span></p><p><span style="color: rgb(51, 51, 51);">4、安全提示，不要到有危险的地区写生或攀爬；同时注意不要随意去动摆设的物品，以防意外损坏。</span></p>',
    price: 1480,
    resources: [],
    scheduling: '<p><br></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb7faaa9086.jpg" alt="1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb801618786.jpg" alt="汇源农谷1.jpg"></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80202bba9.jpg" alt="汇源农谷2.jpg"></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80251cb90.jpg" alt="汇源农谷3.jpg"></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb802c158ae.jpg" alt="汇源农谷4.jpg"></p><p><br></p><p><br></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb8053c796d.jpg" alt="2.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80834354e.jpg" alt="大口国家森林公园1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80885a704.jpg" alt="大口2.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb808c4aad5.jpg" alt="大口3.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb809072d71.jpg" alt="大口4.jpg"></p><p><br></p><p><br></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80b10b60b.jpg" alt="3.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80b5bacd8.jpg" alt="3.1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb810ab8172.jpg" alt="明显陵1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb811036e19.jpg" alt="明显陵2.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb811958b54.jpg" alt="莫愁村1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb8120d73f9.jpg" alt="莫愁村2.jpg"></p>',
    start_time: 1592064000,
    status: 1,
    sub_title: "亲近自然 快乐成长",
    suitable_for_crowd: "不限",
    tag: [{
      create_time: 1589378596,
      id: 1,
      name: "历史",
    },
    {
      create_time: 1589434450,
      id: 9,
      name: "社会实践",
    },
    {
      create_time: 1591019209,
      id: 13,
      name: "全真课堂",
    }],
    title: "学生“自然课堂”研学实践活动",
    travel_days: 3
  }
  const [content, setContent] = useState(courseInfo.detail)
  const [cid, setCid] = useState(0)

  useEffect(() => {
    const { id } = getCurrentInstance().router.params
    setCid(id)
    let courseInfo = props.courseList.find(course => course.id == id)

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
      >
      </Navbar>
      <MySwiper pictures={data.cover} />
      <View className='baseInfo'>
        <View className='title'>{courseInfo.name}</View>
        <View className='sub_title'>{courseInfo.small_name}</View>
        <View className='content'>适合人群：{courseInfo.crowd}</View>
        <View className='content'>研学地点：广东省江门市鹤山市</View>
        <View className='content'>行程天数：{courseInfo.days}</View>
        <View className='content'>研学日期：{courseInfo.date}</View>
        <View className='tags'>
          {props.courseTags.map(item => (
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

// export default class Course extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       statusBarHeight: getGlobalData('statusBarHeight'),
//       capsule: getGlobalData('capsule'),
//       data: {
//         address: {
//           city_id: 170,
//           city_name: "武汉市",
//           country_id: 1,
//           country_name: "中国",
//           details: "汇源农谷体验园",
//           district_id: 0,
//           district_name: "",
//           id: 13,
//           province_id: 17,
//           province_name: "湖北省",
//           zip_code: ""
//         },
//         attribute: 0,
//         author_id: 4,
//         course_type: 4,
//         cover: ["picture-1603293284000"],
//         description: "打造自然生态课堂，深入了解湖北历史、地理和人文背景，在细节中学习，反思自我，完善人格。",
//         details: "<p>1、走进基地、疏导研学课程目标，开营仪式，军事训练、队列训练、体验军旅生活，学会自强自立。</p><p>2、读万卷书，行万里路。少年儿童亲身体验科学的变化无穷和创造的无限乐趣，激发探索科学奥秘的热情，是课堂教育的补充，培养科学探索的兴趣，提供科学实践的机会。</p><p>3、打造自然生态课堂，深入了解湖北历史、地理和人文背景，在细节中学习，反思自我，完善人格。</p>",
//         end_time: 1592582400,
//         enroll_additional: "",
//         id: 27,
//         institution_id: 1,
//         notice: '<p><span style="color: rgb(51, 51, 51);">1、出发前，相关人员沟通出行计划。</span></p><p><span style="color: rgb(51, 51, 51);">2、提前15天报名。&nbsp;（每批次200人左右，每车45人左右）</span></p><p><span style="color: rgb(51, 51, 51);">3、实际行程线路安排，可能根据天气等原因有所调整。</span></p><p><span style="color: rgb(51, 51, 51);">4、安全提示，不要到有危险的地区写生或攀爬；同时注意不要随意去动摆设的物品，以防意外损坏。</span></p>',
//         price: 1480,
//         resources: [],
//         scheduling: '<p><br></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb7faaa9086.jpg" alt="1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb801618786.jpg" alt="汇源农谷1.jpg"></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80202bba9.jpg" alt="汇源农谷2.jpg"></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80251cb90.jpg" alt="汇源农谷3.jpg"></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb802c158ae.jpg" alt="汇源农谷4.jpg"></p><p><br></p><p><br></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb8053c796d.jpg" alt="2.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80834354e.jpg" alt="大口国家森林公园1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80885a704.jpg" alt="大口2.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb808c4aad5.jpg" alt="大口3.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb809072d71.jpg" alt="大口4.jpg"></p><p><br></p><p><br></p><p><br></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80b10b60b.jpg" alt="3.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb80b5bacd8.jpg" alt="3.1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb810ab8172.jpg" alt="明显陵1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb811036e19.jpg" alt="明显陵2.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb811958b54.jpg" alt="莫愁村1.jpg"></p><p><img style="width:100%" src="http://www.yxwcn.cn/d/file/content/2019/05/5cdb8120d73f9.jpg" alt="莫愁村2.jpg"></p>',
//         start_time: 1592064000,
//         status: 1,
//         sub_title: "亲近自然 快乐成长",
//         suitable_for_crowd: "不限",
//         tag: [{
//           create_time: 1589378596,
//           id: 1,
//           name: "历史",
//         },
//         {
//           create_time: 1589434450,
//           id: 9,
//           name: "社会实践",
//         },
//         {
//           create_time: 1591019209,
//           id: 13,
//           name: "全真课堂",
//         }],
//         title: "学生“自然课堂”研学实践活动",
//         travel_days: 3
//       },
//       currTab: 0,
//     }
//   }

//   componentDidMount = () => {
//     const {details} = this.state.data;
//     this.setData({
//       richText: details
//     })
//   }

//   switchTab(tabId) {
//     let richText
//     const {data} = this.state
//     if(tabId == 0) richText = data.details
//     else if(tabId == 1) richText = data.scheduling
//     else if(tabId == 3) richText = data.notice

//     this.setData({
//       currTab: tabId,
//       richText
//     })
//   }

//   // 自己封装的setState
//   setData = (...params) => {
//     this.setState(...params)
//     console.log(...params)
//   }

//   render() {
//     console.log('%c ........render.........', 'color:green');
//     const { statusBarHeight, capsule, data, currTab, richText } = this.state;
//     const isIphoneX = Taro.getStorageSync('isIphoneX');
//     const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3;

//     return (
//       <View className={isIphoneX ? 'isIphoneX course' : 'course'} style={{ marginTop: statusBarHeight + capsuleHeight }}>
//         <Navbar
//           statusBarHeight={statusBarHeight}
//           capsuleHeight={capsuleHeight}
//           showTitle
//           showBack
//           title='研学课程'
//         >
//         </Navbar>
//         <MySwiper pictures={data.cover} />
//         <View className='baseInfo'>
//           <View className='title'>{data.title}</View>
//           <View className='sub_title'>{data.sub_title}</View>
//           <View className='content'>适合人群：不限</View>
//           <View className='content'>研学地点：江门市</View>
//           <View className='content'>行程天数：3天</View>
//           <View className='content'>研学日期：6月-7月</View>
//           <View className='tags'>
//             {data.tag.map(item => (
//               <View className='tag' key={item.id}>{item.name}</View>
//             ))}
//           </View>
//         </View>
//         <View className='container'>
//           <View className='tab_bar'>
//             <View className={currTab==0?'tab_item active':'tab_item'} onClick={this.switchTab.bind(this,0)}>课程详情</View>
//             <View className={currTab==1?'tab_item active':'tab_item'} onClick={this.switchTab.bind(this,1)}>行程安排</View>
//             <View className={currTab==2?'tab_item active':'tab_item'} onClick={this.switchTab.bind(this,2)}>开营时间</View>
//             <View className={currTab==3?'tab_item active':'tab_item'} onClick={this.switchTab.bind(this,3)}>研学服务</View>
//           </View>
//           {currTab == 0 || 1 || 3 ?
//             <View className=''>
//               <RichText nodes={richText}></RichText>
//             </View>
//             : ''}
//         </View>
//         <View className={isIphoneX ? 'isIphoneX tool_bar' : 'tool_bar'} >
//           <View className='tool_item'>
//             <Image src='http://qiniu.daosuan.net/picture-1598882867000' mode='widthFix' />
//             <Text>分享</Text>
//             <Button openType='share'></Button>
//           </View>
//           <View className='tool_item'>
//             <Image src='http://qiniu.daosuan.net/picture-1598883925000' mode='widthFix' />
//             <Text>收藏</Text>
//           </View>
//           <View className='tool_item_2'>
//             预约报名
//           </View>
//         </View>
//       </View>
//     )
//   }
// }
