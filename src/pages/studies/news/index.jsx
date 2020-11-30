import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Image, Text, RichText, Button } from '@tarojs/components'
import Navbar from '@components/navbar/navbar'

import './index.less'
import { connect } from 'react-redux'

function News(props) {
  const statusBarHeight = Taro.getStorageSync('statusBarHeight')
  const capsule = Taro.getStorageSync('capsule')
  const isIphoneX = Taro.getStorageSync('isIphoneX')
  const capsuleHeight = capsule.height + (capsule.top - statusBarHeight) * 3

  let data = {
    abstract: "为满足人民群众日益增长的旅游休闲需求，促进旅游休闲产业健康发展，推进具有中国特色的国民旅游休闲体系建设，根据《国务院关于加快发展旅游业的意见》（国发〔2009〕41号），制定本纲要。",
    attribute: 0,
    author_name: "",
    content: '<p class="ql-align-center"><strong>国民旅游休闲纲要</strong></p><p class="ql-align-center">（2013—2020年）</p><p>为满足人民群众日益增长的旅游休闲需求，促进旅游休闲产业健康发展，推进具有中国特色的国民旅游休闲体系建设，根据《国务院关于加快发展旅游业的意见》（国发〔2009〕41号），制定本纲要。</p><p><strong>一、指导思想和发展目标</strong></p><p>（一）指导思想。以邓小平理论、“三个代表”重要思想、科学发展观为指导，按照全面建成小康社会目标的总体要求，以满足人民群众日益增长的旅游休闲需求为出发点和落脚点，坚持以人为本、服务民生、安全第一、绿色消费，大力推广健康、文明、环保的旅游休闲理念，积极创造开展旅游休闲活动的便利条件，不断促进国民旅游休闲的规模扩大和品质提升，促进社会和谐，提高国民生活质量。</p><p>（二）发展目标。到2020年，职工带薪年休假制度基本得到落实，城乡居民旅游休闲消费水平大幅增长，健康、文明、环保的旅游休闲理念成为全社会的共识，国民旅游休闲质量显著提高，与小康社会相适应的现代国民旅游休闲体系基本建成。</p><p><strong>二、主要任务和措施</strong></p><p>（三）保障国民旅游休闲时间。落实《职工带薪年休假条例》，鼓励机关、团体、企事业单位引导职工灵活安排全年休假时间，完善针对民办非企业单位、有雇工的个体工商户等单位的职工的休假保障措施。加强带薪年休假落实情况的监督检查，加强职工休息权益方面的法律援助。在放假时间总量不变的情况下，高等学校可结合实际调整寒、暑假时间，地方政府可以探索安排中小学放春假或秋假。</p><p>（四）改善国民旅游休闲环境。稳步推进公共博物馆、纪念馆和爱国主义教育示范基地免费开放。城市休闲公园应限时免费开放。稳定城市休闲公园等游览景区、景点门票价格，并逐步实行低票价。落实对未成年人、高校学生、教师、老年人、现役军人、残疾人等群体实行减免门票等优惠政策。鼓励设立公众免费开放日。逐步推行中小学生研学旅行。各地要将游客运输纳入当地公共交通系统，提高旅游客运质量。鼓励企业将安排职工旅游休闲作为奖励和福利措施，鼓励旅游企业采取灵活多样的方式给予旅游者优惠。</p><p>（五）推进国民旅游休闲基础设施建设。加强城市休闲公园、休闲街区、环城市游憩带、特色旅游村镇建设，营造居民休闲空间。发展家庭旅馆和面向老年人和青年学生的经济型酒店，支持汽车旅馆、自驾车房车营地、邮轮游艇码头等旅游休闲基础设施建设。加强公园绿地等公共休闲场所保护，对挤占公共旅游休闲资源的应限期整改。加快公共场所无障碍设施建设，逐步完善街区、景区等场所语音提示、盲文提示等无障碍信息服务。</p><p>（六）加强国民旅游休闲产品开发与活动组织。鼓励开展城市周边乡村度假，积极发展自行车旅游、自驾车旅游、体育健身旅游、医疗养生旅游、温泉冰雪旅游、邮轮游艇旅游等旅游休闲产品，弘扬优秀传统文化。大力发展红色旅游，提高红色旅游经典景区和精品线路的吸引力和影响力。开发适合老年人、妇女、儿童、残疾人等不同人群需要的旅游休闲产品，开发农村居民喜闻乐见的都市休闲、城市观光、文化演艺、科普教育等旅游休闲项目，开发旅游演艺、康体健身、休闲购物等旅游休闲消费产品，满足广大群众个性化旅游需求。鼓励学校组织学生进行寓教于游的课外实践活动，健全学校旅游责任保险制度。加强旅游休闲的基础理论、产品开发和产业发展等方面的研究，加大旅游设施设备的研发力度，提升旅游休闲产品科技含量。</p><p>（七）完善国民旅游休闲公共服务。加强旅游休闲服务信息披露和旅游休闲目的地安全风险信息提示，加强旅游咨询公共网站建设，推进机场、火车站、汽车站、码头、高速公路服务区、商业集中区等公共场所旅游咨询中心建设，完善旅游服务热线功能，逐步形成方便实用的旅游信息服务体系。完善道路标识系统，健全铁路、公路、水路、民航等的旅游交通服务功能，提升旅游交通服务保障水平。加强旅游休闲的安全、卫生等保障工作，加强突发事件应急处置能力建设，健全旅游安全救援体系。加强培训，提高景区等场所工作人员、服务人员和志愿者无障碍服务技能。创新人才培养模式，提高旅游休闲高等教育、职业教育质量，加快旅游休闲各类紧缺人才培养。</p><p>（八）提升国民旅游休闲服务质量。制定旅游休闲服务规范和质量标准，健全旅游休闲活动的安全、秩序和质量的监管体系，完善国民旅游休闲质量保障体系。倡导诚信旅游经营，加强行业自律。加强跨行业、跨地区、多渠道的沟通和协调，打击欺客宰客、价格欺诈等严重侵害消费者权益的违法行为。发挥社会监督和舆论监督作用，畅通旅游休闲投诉渠道，建立公正、高效的投诉处理机制。依法维护经营者和消费者的合法权益，维护公平竞争的旅游休闲市场环境。</p><p><strong>三、组织实施</strong></p><p>（九）加强组织领导。发展改革和旅游部门负责实施本纲要的组织协调和督促检查。各相关部门要将旅游休闲纳入工作范畴，发挥工会、共青团、妇联等人民团体以及相关行业协会的作用，共同推动国民旅游休闲活动发展。</p><p>（十）加强规划指导。要把国民旅游休闲纳入各级国民经济和社会发展规划，以及相关行业和部门的发展规划。加强对各地旅游休闲发展的分类指导，鼓励有条件的地方编制适合本地区旅游休闲发展专项规划。城乡规划要统筹考虑旅游休闲场地和设施用地，优化布局。</p><p>（十一）加大政策扶持力度。逐步增加旅游休闲公共服务设施建设的资金投入。鼓励社会力量投资建设旅游休闲设施，开发特色旅游休闲线路和优质旅游休闲产品。鼓励和支持私人博物馆、书画院、展览馆、体育健身场所、音乐室、手工技艺等民间休闲设施和业态发展。落实国家关于中小企业、小微企业的扶持政策。</p><p>（十二）加强监督管理。地方各级人民政府要按照本纲要的要求，加强旅游市场管理，强化综合执法，确保旅游休闲的相关法律法规和标准规范得到有效实施。</p>',
    cover: "eyJleHBpcmVfYXQiOi0xLCJhY2NvdW50X2lkIjotMSwicGF0aCI6InN0b3JhZ2U6Ly9pbmZvcm1hdGlvbl9jb3ZlckAxMC8xNTkwOTA3OTcxLWNvdmVyLmpwZyIsInB1YmxpYyI6dHJ1ZSwiZmlsZV9uYW1lIjoiIn0=",
    create_time: 1590907385,
    id: 10,
    information_type: 2,
    institution_id: 1,
    institution_name: "系统",
    resources: [],
    status: 2,
    title: "国民旅游休闲纲要",
    update_time: 1591103432,
  }

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
      >
      </Navbar>
      <View className='container'>
        <View className='title_wrap'>
          <View className='title'>{data.title}</View>
          <View className='info'>
            <View className='time'>发布时间：{new Date(data.create_time*1000).toLocaleString()}</View>
            <View className='institution'>来源：{data.institution_name}</View>
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
