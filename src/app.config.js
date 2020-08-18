export default {
  pages: [
<<<<<<< HEAD
    'pages/login/index',
    'pages/index/index',
=======
    'pages/index/index',
    'pages/login/index',
   
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7
    'pages/user/index',
    'pages/cart/index',
    'pages/category/index',
    'pages/find/index',
    'pages/order/orderList',
    'pages/details/index',
    'pages/details/typeSelect',
    'pages/user/userInfoList',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
<<<<<<< HEAD
    navigationBarTextStyle: 'black'
  },
  'tabBar': {  //用来配置底部导航栏
    'color': "#333", //文字颜色
    'selectedColor': "#2a86d4",  //文字选中后的颜色
=======
    navigationBarTextStyle: 'black',
    navigationStyle: 'custom'
  },
  'tabBar': {  //用来配置底部导航栏
    'color': "#333", //文字颜色
    'selectedColor': "f5930b",  //文字选中后的颜色
>>>>>>> 45991747250e5e0c203065310304ba03a78913c7
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
