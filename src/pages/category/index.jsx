import React, {Component} from 'react';
import { View, Text, Button } from '@tarojs/components';

//import Menu from '../../components/menu/menu'

class CategoryListView extends Component {
  constructor() {
    super(...arguments)
  }
  render(){
    return (
      <View className='categorylist'>
        分类
        {/* <Menu isActive={1} /> */}
      </View>
    )
  }
}
export default CategoryListView;