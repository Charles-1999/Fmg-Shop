import { createCart, getCart, updateCart } from '../service/Cart'

export default {
  namespace: 'cart',
  state: {
    cartList: [],
    cartCount: 0
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
      const res = yield call(getCart, payload)

      yield put({
        type: 'save',
        payload: {
          cartList: res.data,
          cartCount: res.count
        }
      })
    },
    /* 获取购物车列表并且处理数据 */
    * getCartListWithProcess({ payload }, { call, put }) {
      let cartList, res
      let { goodsList } = payload
      if (!payload.cartList){
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

        /* 移动距离 */
        cart.x = 0
      })

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
    /* 更新购物车 */
    * updateCart({ payload }, { call, put }) {
      const res = yield call(updateCart, payload)
    }
  },
  reducers: {
    save(state, { payload }) {
      return {...state, ...payload}
    }
  }
}
