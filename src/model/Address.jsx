import { get } from 'lodash';
import  { getAddressInfoList, getAddressInfoUid, addAddressInfo, deleteAddressInfo, editAddressInfo } from '../service/Address';

export default {
  namespace: 'address',
  state: {
    cityList: [],
    provinceList: [],
    areaList: [],
    addressList: [],
  },
  effects: {
    //获取省渲染名称-------------
    * getProvinceList({ payload }, { call, put }) {
      const res = yield call(getAddressInfoList, payload);
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
      yield put({
        type: 'save',
        payload:{
          areaList:res
        }
      }); 
    },
    //获取用户所有的地址
    * getAddressInfoUid({ payload }, { call, put }) {
      const res = yield call(getAddressInfoUid, payload);
      yield put({
        type: 'save',
        payload:{
          addressList:res
        }
      }); 
    },
    //创建地址
    * setAddressInfo({ payload }, { call, put }) {
      const res = yield call(addAddressInfo, payload);
      yield put({
        type: 'save',
        payload:res
      }); 
    },
     //修改地址
     * editAddressInfo({ payload }, { call, put }) {
      const res = yield call(editAddressInfo, payload);
      yield put({
        type: 'save',
        payload:res
      }); 
    },
     //删除地址
     * deleteAddressInfo({ payload }, { call, put }) {
      const res = yield call(deleteAddressInfo, payload);
      yield put({
        type: 'save',
        payload:res
      }); 
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};


