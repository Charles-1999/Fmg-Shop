import  { getAccountInfo, mgetAccountInfo } from '../service/Account';
 
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
    /* 批量获取用户 */
    * mgetAccountInfo({ payload }, { call, put }) {
      let accountList = yield call(mgetAccountInfo, payload)
      yield put({
        type: 'save',
        payload: accountList
      })
    }
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
