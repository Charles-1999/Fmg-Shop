import { get } from 'lodash';
import  { getOrderList,mgetOrderList,getUserOrder} from '../service/Order';

export default {
  namespace: 'order',
  state: {
    orderList:[],
    orderInfoList:[],
    userOrderInfo:[],
    ids:0,
  },
  effects: {
    //获取订单列表-------------
    * getOrderList({ payload }, { call, put }) {
      const res = yield call(getOrderList, payload);
      const info = get(res, 'orders',[]);
      yield put({
        type: 'save',
        payload:{
          orderList:info
        },
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
    //获取用户订单
    * getUserOrder({ payload }, { call, put }) {
      const res = yield call(getUserOrder, payload);
      yield put({
        type: 'save',
        payload:{
          userOrderInfo:res
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