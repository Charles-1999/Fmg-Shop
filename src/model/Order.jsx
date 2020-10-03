import { get } from 'lodash';
import  { getOrderList,mgetOrderList,getUserOrder} from '../service/Order';

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
      console.log(res)
      const info = get(res, 'orders',[]);
      console.log(info)
      const ids = info.map((arr) => {return arr.id})
      yield put({
        type: 'save',
      }); 
      yield put({
        type: 'mgetOrderList',
        payload: ids,
      }); 
    },
    //批量获取订单列表
    * mgetOrderList({ payload }, { call, put }) {
      const res = yield call(mgetOrderList, payload);
      console.log(res)
      yield put({
        type: 'save',
        payload:{
          orderList:res
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
