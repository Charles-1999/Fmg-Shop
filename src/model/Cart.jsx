import { createCart, getCart, updateCart } from '../service/Cart'

export default {
  namespace: 'cart',
  state: {
    cart: {},
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
     * 获取购物车
     * @param
     */
    * getCart({ payload }, { call, put }) {
      const cart = yield call(getCart, payload)
      yield put({
        type: 'save',
        payload: {
          cart
        }
      })
    },
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
