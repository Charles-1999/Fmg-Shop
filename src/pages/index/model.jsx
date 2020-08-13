import * as getGoodsPlaceListApi from './service';

export default {
  namespace: 'placeList',
  state: {
    placeList: [],
  },
  effects: {
    *getGoodsPlace({ payload }, { call, put }) {
      const response = yield call(getGoodsPlaceListApi.getGoodsPlace, {...payload});
      const { data } = response;
      yield put({
        type: 'save',
        payload: data,
      });
    },

    // *getGoodsPlace({payload}, { call, put, select }) {
    //   const { page, limit } = yield select(state => state.common);
    //   const { status, data } = yield call(getGoodsPlaceListApi.getGoodsPlace, {
    //     page,
    //     limit,
    //   });
    //   if (status === 'ok') {
    //     yield put({
    //       type: 'save',
    //       payload: {
    //         placeList: data.rows,
    //       },
    //     });
    //   }
    // },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
