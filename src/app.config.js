/*
 * @Author: your name
 * @Date: 2020-10-26 15:46:00
 * @LastEditTime: 2020-11-21 23:28:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /凤鸣谷商城/src/app.config.js
 */
export default {
  pages: [
    'pages/index/index',
    'pages/login/index',
    'pages/user/index',
    'pages/cart/index',
    'pages/cart/confirm/index',
    'pages/cart/address_list/index',
    'pages/category/index',
    'pages/goods_list/index',
    'pages/find/index',
    'pages/details/index',
    'pages/details/comments/index',
    'pages/index/placeGoodsList',
    'pages/index/kindGoodsList',
    'pages/user/Address/addressList',
    'pages/user/Address/addAddress',
    'pages/user/Address/editAddress',
    'pages/user/Order/orderDetail',
    'pages/user/Order/myOrder',
    'pages/user/Order/deliveryDetail',
    'pages/user/Order/comment',
    'pages/user/Order/commentSuccess',
    'pages/studies/index',
    'pages/studies/course/index',
    'pages/studies/news/index',
    'pages/studies/apply/index',
    'pages/studies/apply_list/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  },
  'tabBar': {  //用来配置底部导航栏
    'color': "#333", //文字颜色
    'selectedColor': "#2895d4",  //文字选中后的颜色
    'backgroundColor': "white",
    'borderStyle': "black",
    'list': [  //配置页面路径以及icon图标及其选中，最少2个，最多5个
      {
        'pagePath': 'pages/index/index',
        'text': '首页',
        'iconPath': './assets/nav/home.png',
        'selectedIconPath': './assets/nav/homeA.png'
      },
      {
        'pagePath': 'pages/category/index',
        'text': "分类",
        'iconPath': './assets/nav/category.png',
        'selectedIconPath': './assets/nav/categoryA.png'
      },
      {
        'pagePath': 'pages/find/index',
        'text': '发现',
        'iconPath': './assets/nav/find.png',
        'selectedIconPath': './assets/nav/findA.png'
      },
      {
        'pagePath': 'pages/cart/index',
        'text': '购物车',
        'iconPath': './assets/nav/cart.png',
        'selectedIconPath': './assets/nav/cartA.png'
      },
      {
        'pagePath': 'pages/user/index',
        'text': '我的',
        'iconPath': './assets/nav/my.png',
        'selectedIconPath': './assets/nav/myA.png'
      }
    ]
  },
  // networkTimeout: {
  //   request: 6000,
  //   connectSocket: 5000,
  //   uploadFile: 4000,
  //   downloadFile: 5000
  // },


}
