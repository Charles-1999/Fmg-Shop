import { get } from 'lodash';
import  { getOrderList,mgetOrderList,editOrderInfo,delOrderInfo, createOrder } from '../service/Order';

export default {
  namespace: 'order',
  state: {
    orderList:[],
    orderInfoList:[],
    userOrderInfo:[],
    ids:[],
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
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
