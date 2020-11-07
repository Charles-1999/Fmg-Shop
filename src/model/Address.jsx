import Taro from '@tarojs/taro'
import { get } from 'lodash';
import  { getAddressInfoList, getAddressInfoUid, addAddressInfo, deleteAddressInfo, editAddressInfo } from '../service/Address';

export default {
  namespace: 'address',
  state: {
    cityList: [],
    provinceList: [],
    areaList: [],
    addressList: [],
    addresss: null
  },
  effects: {
    //获取省渲染名称-------------
    * getProvinceList({ payload}, { call, put }) {
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
      const addressList = yield call(getAddressInfoUid, payload)
      let currAddress = Taro.getStorageSync("currAddress")

      if(addressList.length === 0) {
        currAddress = null
      } else {
        if(!currAddress) {
          currAddress = addressList[0]
          addressList.forEach(item => item.checked = false)
          addressList[0].checked = true
        } else {
          const index = addressList.findIndex(item => item.id === currAddress.id)
          addressList.forEach(item => item.checked = false)
          // 若找不到（被删除），则在收货地址列表中的第一个作为当前选中
          if(index === -1) {
            currAddress = addressList[0]
            addressList[0].checked = true
          }else {
            addressList[index].checked = true
            currAddress = addressList[index]
          }
        }
      }
      Taro.setStorageSync('currAddress', currAddress)

      yield put({
        type: 'save',
        payload:{
          addressList
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
      const address = yield call(editAddressInfo, payload);
      yield put({
        type: 'saveAddressInfo',
        payload: {
          address
        }
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


