import  { getGoodsPlace, getGoodsCategory, getGoodsSale, getGoodsSpecification } from '../service/Goods';


export default {
  namespace: 'goods',
  state: {
    placeList: {},
    // filters: {},
    // pagination: {
    //   current: 1,
    //   pageSize: 5,
    // },
  },
  effects: {
    //获取商品属地标签
    * getGoodsPlace({ payload }, { call, put }) {
      const res = yield call(getGoodsPlace, payload);
      console.log(111)
      console.log(res)
      yield put({
        type: 'save',
        payload: {
          placeList: res
        }
      }); 
      
      // yield put({
      //   type: 'save',
      //   payload:res
      // });
    },
    // * getGoodsPlace(_, { call, put, select }) {
    //   const { placeList, filters, pagination } = yield select(state => state.getGoodsPlace);
    //   const response = yield call(getGoodsPlace, {
    //     filters,pagination,
    //   });
    //   if(response.statusCode === 200){
    //     if( Array.isArray(response.data) && response.data.length>0){
    //       yield put({
    //         type: 'save',
    //         payload: {
    //           placeList: pagination.current > 1 ? [...placeList, ...response.data] : response.data,
    //         }
    //       });
    //     }
    //   }
    //},
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
