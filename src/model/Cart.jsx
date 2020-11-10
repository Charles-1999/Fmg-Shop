import { createCart } from '../service/Cart'

export default {
  namespace: 'cart',
  state: {},
  effects: {
    /**
     * 创建购物车
     * @param {Object} goods 要加入购物车的商品
     * @param {}
     */
    * createCart({ payload }, { call, put }) {
      const res = yield call(createCart, payload)
    }
  },
  reducers: {
    save(state, { payload }) {
      return {...state, ...payload}
    }
  }
}