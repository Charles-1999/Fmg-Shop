import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro';
import { AtGrid } from "taro-ui"
import './index.scss';
import product from '../../assets/img/shangPing.jpg';



class ProductList extends Component {

  state = {
    productList:[
      {
        id:1,
        img: product,
        desc:'现摘现发，新鲜当季水果',
        price:29.80,
      },
      {
        id:2,
        img: product,
        desc:'有机蔬菜礼盒新鲜顺丰',
        price:29.80,
      }, {
        id:3,
        img:product,
        desc:'啊复吗边草纯露喷雾30ml',
        price:29.80,
      },
    ],
    placeList:[
      {
        id:1,
        title: '香草小镇',
      },
      {
        id:2,
        title: '一号营地',
      },
      {
        id:3,
        title: '红耕乐园',
      },
      {
        id:4,
        title: '运动基地',
      }
    ]
  }


  render () {
    return (
      <View className='product-wrap'>
        <View className='new'>
          <View className='title'>
            新品上市
          </View>
          <View className='enter'>
            进入专题>
          </View>
          <View className='at-row'>
            {this.state.productList.map(item => 
              <View className='at-col' key={item.id}>
                <Image src={item.img} className='pic'></Image>
                <View className='introduction'>
                  {item.desc}            
                </View>
                <View className='price'>
                  {item.price}
                </View>
              </View>
            )}
        </View>
        </View>
        <View className='top'>
          <View className='title'>
            销量Top榜
          </View>
          <View className='enter'>
            进入专题>
          </View>
          <View className='at-row'>
            {this.state.productList.map(item => 
              <View className='at-col' key={item.id}>
                <Image src={item.img} className='pic'></Image>
                <View className='introduction'>
                  {item.desc}            
                </View>
                <View className='price'>
                  {item.price}
                </View>
              </View>
            )}
        </View>
        {this.state.placeList.map(place => 
           <View className='top'>
           <View className='title'>
             {place.title}
           </View>
           <View className='enter'>
             进入专题>
           </View>
           <View className='at-row'>
             {this.state.productList.map(item => 
               <View className='at-col' key={item.id}>
                 <Image src={item.img} className='pic'></Image>
                 <View className='introduction'>
                   {item.desc}            
                 </View>
                 <View className='price'>
                   {item.price}
                 </View>
               </View>
             )}
         </View>
         <View className='at-row'>
             {this.state.productList.map(item => 
               <View className='at-col' key={item.id}>
                 <Image src={item.img} className='pic'></Image>
                 <View className='introduction'>
                   {item.desc}            
                 </View>
                 <View className='price'>
                   {item.price}
                 </View>
               </View>
             )}
             
         </View>
         </View>
        )}
      </View>
      </View>

    )
  }
}
export default ProductList;

