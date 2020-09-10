import { get } from 'lodash';
import  { getAddressInfoList } from '../service/Address';

export default {
  namespace: 'address',
  state: {
    cityList: [],
    provinceList: [],
    areaList: [],
  },
  effects: {
    //获取省渲染名称-------------
    * getProvinceList({ payload }, { call, put }) {
      const res = yield call(getAddressInfoList, payload);
      //console.log(res)
      yield put({
        type: 'save',
        payload:{
          provinceList:res
        }
      }); 
    },
     //获取市渲染名称-------------
    * getCityList({ payload }, { call, put }) {
      const res = yield call(getAddressInfoList, payload);
      //console.log(res)
      yield put({
        type: 'save',
        payload:{
          cityList:res
        }
      }); 
    },
     //获取区渲染名称-------------
    * getAreaList({ payload }, { call, put }) {
      const res = yield call(getAddressInfoList, payload);
      //console.log(res)
      yield put({
        type: 'save',
        payload:{
          areaList:res
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


