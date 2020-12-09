/*
 * @Author: your name
 * @Date: 2020-11-18 09:40:36
 * @LastEditTime: 2020-12-01 19:22:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /凤鸣谷商城/src/model/Order.js
 */
import { get } from 'lodash';
import  { getOrderList,mgetOrderList,editOrderInfo,delOrderInfo, createOrder, getPrice, exchangeOrder, getOrderSum} from '../service/Order';


export default {
  namespace: 'order',
  state: {
    orderList:[],
    orderInfoList:[],
    userOrderInfo:[],
    ids:[],
    exchangeId:0,
    orderListSum:{},
  },
  effects: {
    //获取订单列表-------------
    * getOrderList({ payload }, { call, put }) {
      const res = yield call(getOrderList, payload);
      const info = get(res, 'orders',[]);
      //const ids = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
        payload:{
          orderList:res
        }
      });
    },
    //批量获取订单列表
    * mgetOrderList({ payload }, { call, put }) {
      const res = yield call(mgetOrderList, payload);
      yield put({
        type: 'save',
        payload:{
          orderInfoList:res
        }
      });
    },
    //修改用户子订单
    * editOrderInfo({ payload }, { call, put }) {
      const res = yield call(editOrderInfo, payload);
      yield put({
        type: 'save',
        payload:res,
      });
    },
    //删除用户子订单
    * delOrderInfo({ payload }, { call, put }) {
      const res = yield call(delOrderInfo, payload);
      yield put({
        type: 'save',
        payload:res,
      });
    },
    /* 创建订单 */
    * createOrder({ payload }, { call, put }) {
      const res = yield call(createOrder, payload)
    },
    /* 获取价格信息 */
    * getPrice({ payload }, { call, put }) {
      const res_price = yield call(getPrice, payload)
      yield put({
        type: 'save',
        payload: { res_price }
      })
    },
    //退换货 exchangeOrder
    * exchangeOrder({ payload }, { call, put }) {
      console.log(payload)
      const { resolve } = payload
      const res = yield call(exchangeOrder, payload);
      console.log(res)
      yield put({
        type: 'save',
        payload:{
          exchangeId:res,
        },
      }); 
    },
    //获取订单个数
    * getOrderSum({ payload }, { call, put }) {
      const res = yield call(getOrderSum, payload);
      yield put({
        type: 'save',
        payload:{
          orderListSum:res
        }
      });
    },

  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
