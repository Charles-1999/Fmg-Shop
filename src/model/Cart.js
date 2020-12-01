import Taro from '@tarojs/taro'
import { createCart, getCart, updateCart, delCart } from '../service/Cart'
import { get as getGlobaData } from '../global_data'

export default {
  namespace: 'cart',
  state: {
    cartList: [],
  },
  effects: {
    /**
     * 创建购物车
     * @param {Object} goods 要加入购物车的商品
     * @param {}
     */
    * createCart({ payload }, { call, put }) {
      const res = yield call(createCart, payload)
    },
    /**
     * 获取购物车列表
     * @param
     */
    * getCart({ payload }, { call, put }) {
      const cartList = yield call(getCart, payload)

      // 设置购物车小红点
      const length = cartList.data.length
      if (length > 0) {
        Taro.setTabBarBadge({
          index: 3,
          text: length + ''
        })
      } else {
        Taro.removeTabBarBadge({
          index: 3
        })
      }

      yield put({
        type: 'save',
        payload: {
          cartList: cartList.data
        }
      })
    },
    /* 获取购物车列表并且处理数据 */
    * getCartListWithProcess({ payload }, { call, put }) {
      let cartList, res
      let { goodsList } = payload
      if (!payload.cartList) {
        res = yield call(getCart, payload)
        cartList = res.data
      }
      else cartList = payload.cartList

      cartList.forEach((cart, index) => {
        /* 找出规格id对应的规格序号 */
        const spec_index = goodsList[index].specification.findIndex((spec) => spec.id === cart.goods_specification_id)
        cart.spec_index = spec_index

        /* 检验是否无货 */
        cart.soldOut = goodsList[index].specification[spec_index].total === 0 ? true : false

        /* 购物车价格 */
        cart.price = goodsList[index].specification[spec_index].showPrice
      })

      // 设置购物车小红点
      const length = cartList.length
      if (length > 0) {
        Taro.setTabBarBadge({
          index: 3,
          text: length + ''
        })
      } else {
        Taro.removeTabBarBadge({
          index: 3
        })
      }

      yield put({
        type: 'save',
        payload: {
          cartList
        }
      })

      if (!payload.cartList) {
        yield put({
          type: 'sava',
          payload: {
            cartCount: res.count
          }
        })
      }
    },
    /* 获取购物车列表和商品列表 */
    * getCartAndGoodsList({ payload }, { call, put, select }) {
      let cartList = yield call(getCart, payload)
      cartList = cartList.data

      /* 设置购物车小红点 */
      const length = cartList.length
      if (length > 0) {
        let text = length > 99 ? '99+' : length + ''
        Taro.setTabBarBadge({
          index: 3,
          text
        })
      } else {
        Taro.removeTabBarBadge({
          index: 3
        })
      }

      /* 处理缓存数据 */
      let cartListStor = Taro.getStorageSync('cartListStor')
      // 如果有缓存
      if (cartListStor) {
        // 先检查缓存中是否有多出来的数据
        cartListStor.forEach((cart, index) => {
          // 如果缓存中有而数据库没有，则删除缓存中的
          if (!cartList.find(item => item.id === cart.id)) {
            cartListStor.splice(index, 1)
          }
        })

        // 再检查缓存中有无少数据
        cartList.forEach((cart, index) => {
          // 如果缓存没有该购物车，则添加到缓存
          let i = cartListStor.findIndex(item => item.id === cart.id)
          if (i === -1) {
            cartListStor.push({ id: cart.id, is_check: false })
            cart.is_check = false
          } else {
            // 如果找到，则把缓存中的状态添加到cartList中
            cart.is_check = cartListStor[i].is_check
          }
        })
      } else {
        // 如果没有缓存,则添加到缓存
        cartListStor = cartList.map(cart => {
          return { id: cart.id, is_check: false }
        })
        cartList.forEach(cart => cart.is_check = false)
      }
      Taro.setStorageSync('cartListStor', cartListStor)

      // 获取商品列表  put.resolve 让其变成堵塞的 同步   或者在后面yield take('goods/mgetGoodsListEntity/@@end')
      yield put.resolve({
        type: 'goods/mgetGoodsListEntity',
        payload: cartList.map(item => item.goods_id)
      })
      const goodsList = yield select(state => state.goods.goodsList)

      // 合并goodsList到cartList
      cartList.forEach((item, index) => {
        item = Object.assign(item, { goods: goodsList.find(goods => goods.id == item.goods_id) })
      })

      yield put({
        type: 'saveCartList',
        payload: {
          cartList,
          goodsList
        }
      })
    },
    /* 更新购物车 */
    * updateCart({ payload }, { call, put }) {
      const res = yield call(updateCart, payload)
    },
    /* 删除购物车 */
    * delCart({ payload }, { call, put }) {
      const res = yield call(delCart, payload)
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    saveCartList(state, { payload }) {
      let { cartList, goodsList } = payload
      cartList.forEach((cart, index) => {
        const goods = goodsList.find(goods => goods.id == cart.goods_id)
        /* 找出规格id对应的规格序号 */
        const spec_index = goods.specification.findIndex((spec) => spec.id === cart.goods_specification_id)
        cart.spec_index = spec_index

        /* 检验是否无货 */
        cart.soldOut = goods.specification[spec_index].total === 0 ? true : false

        /* 购物车价格 */
        cart.price = goods.specification[spec_index].showPrice
      })
      return { ...state, cartList }
    }
  }
}
