import  { getAccountInfo } from '../service/Account';
 
export default {
  namespace: 'account',
  state: {
    accountList: [],
  },
  effects: {
    //获取账户信息列表
    * getAccountInfo({ payload }, { call, put }) {
      const response = yield call(getAccountInfo, {payload});
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
