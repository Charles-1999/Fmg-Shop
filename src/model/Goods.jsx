import  { getGoodsPlace, getGoodsPlaceEntity, getGoodsCategory, getGoodsSale, getGoodsSpecification } from '../service/Goods';
import { get } from 'lodash';

export default {
  namespace: 'goods',
  state: {
    placeList: {},
    filters: {},
    pagination: {
      current: 1,
      pageSize: 5,
    },
  },
  effects: {

    //获取商品属地标签
    * getGoodsPlace({ payload }, { call, put }) {
      const res = yield call(getGoodsPlace, payload);
      const ids = get(res.data, 'info',[]).map((arr) => {return arr.id})
      console.log(ids)
      yield put({
        type: 'save',
        payload: {
          placeList: res
        }
      }); 
    },
    //批量获取属地标签
    * getGoodsPlaceEntity({ payload }, { call, put }) {
      const res = yield call(getGoodsPlaceEntity, payload);
      yield put({
        type: 'save',
        payload: {
          placeList: res
        }
      }); 
    }, 
    //获取种类标签列表
    * getGoodsCategory({ payload }, { call, put }) {
      const response = yield call(getGoodsCategory, {payload});
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //获取销售标签列表
    * getGoodsSale({ payload }, { call, put }) {
      const response = yield call(getGoodsSale, {payload});
      yield put({
        type: 'save',
        payload: response,
      });
    },
    //获取规格模版列表
    * getGoodsSpecification({ payload }, { call, put }) {
      const response = yield call(getGoodsSpecification, {payload});
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
