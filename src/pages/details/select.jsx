import React, { Component } from 'react';
import { View, Image, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './select.less'

class Select extends Component {
  static defaultProps = {
    data: [],
    template: []
  }

  constructor() {
    super(...arguments)
  }

  render() {
    const {data, template} = this.props;
    return (
      <View className='select' >
        <View className='info_wrap' onClick={this.props.callback.bind(this, 0)}>
          <Text className='title'>选择</Text>
          <Text className='content'>{template.join("、")}</Text>
          <View className='type_list'>
            {data.map((item,index) => 
              index <= 4 ?
              <Image key={index} src={'http://qiniu.daosuan.net/'+item.picture} />
              : ''
            )}
            <Text>共{data.length}种{template}可选</Text>
          </View>
          <Image className='more' src='http://qiniu.daosuan.net/picture-1598883365000' />
        </View>
        <View className='info_wrap'>
          <Text className='title'>保障</Text>
          <Text className='content'>假一赔十·极速退款·七天无理由退换</Text>
        </View>
        <View className='info_wrap'>
          <Text className='title'>参数</Text>
          <Text className='content'>阿巴阿巴阿巴阿巴阿巴阿巴</Text>
          <Image className='more' src='http://qiniu.daosuan.net/picture-1598883365000' />
        </View>
      </View>
    )
  }
}

export default Select; 