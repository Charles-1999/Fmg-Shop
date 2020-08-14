import  {getGoodsPlace} from './service';

export default {
  namespace: 'placeList',
  state: {
    placeList: [],
  },
  effects: {
    * getGoodsPlace({ payload }, { call, put }) {
      const response = yield call(getGoodsPlace, {...payload});
      // const { data } = response;
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
