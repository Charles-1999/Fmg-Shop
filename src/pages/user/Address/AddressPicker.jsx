import React, { Component } from 'react'
import { View, Text, Image, PickerView, PickerViewColumn } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { get } from 'lodash';
import Taro, {Current} from '@tarojs/taro'; 
import './AddressPicker.scss'
import { connect } from 'react-redux';

@connect(({ address }) => ({
  ...address,
}))
class addressPicker extends Component {
  static defaultProps = {
    iconList: [],
  };
  state = {
    city: '',
    cityCode: 0,
    cityList: [],
    area: '',
    areaCode: 0,
    areaList: [],
    province: '',
    provinceCode: 0,
    provinceList: [],
    getValue: [0,0,0],
    getTitle: '',
    getClose: true,
    showPicker: false,
    changeType: false,
    currentAddress:{}
  }

  async componentDidMount() {
    const userId = Taro.getStorageSync('userId'); //获取当前用户信息
    const{ currentId } = this.props;
    if(currentId){
      await  this.props.dispatch({
        type: 'address/getAddressInfoUid',
        payload: {
          uid:userId
        }
      })
      const{ addressList } = this.props;
      this.setState({
        currentAddress:addressList.filter(item => item.id == currentId)[0]
      })
      console.log(this.state.currentAddress)
      this.setState({
        provinceCode: get(this.state.currentAddress, 'province_id', ''),
        cityCode: get(this.state.currentAddress, 'city_id', ''),
        areaCode: get(this.state.currentAddress, 'district_id', ''),
        province: get(this.state.currentAddress,'province_name',''),
        city: get(this.state.currentAddress,'city_name',''),
        area: get(this.state.currentAddress,'district_name',''),
      })
      this.getProvinceList(0,[this.state.provinceCode,this.state.cityCode,this.state.areaCode]);
    }
    else{
      this.getProvinceList();
    }
    
  }

  getProvinceList = (code, val) => {  //获取省份接口
    if(val){
      this.props.dispatch({
        type: 'address/getProvinceList',
        payload: {
          country_id: 1,
        }
      }).then(()=>{
        const {provinceList} = this.props;
        val[0] = provinceList.findIndex(i => i.id == this.state.provinceCode)
        //this.getCity(get(provinceList[0],'id'), '');
        this.props.dispatch({
          type: 'address/getCityList',
          payload: {
            province_id: this.state.provinceCode
          }
        }).then(()=>{
          const {cityList} = this.props;
          val[1] = cityList.findIndex(i => i.id == this.state.cityCode)
          this.props.dispatch({
            type: 'address/getAreaList',
            payload: {
              city_id: this.state.cityCode
            }
          }).then(()=>{
            const {areaList} = this.props;
            val[2] = areaList.findIndex(i => i.id == this.state.areaCode)
            console.log(val[2])
            console.log(areaList)
            this.setState({
              provinceList: provinceList,
              cityList:cityList,
              areaList:areaList,
              getValue: val,
            })
            console.log(this.state.getValue)
          })
        })
      })
    }
    else{
      this.props.dispatch({
        type: 'address/getProvinceList',
        payload: {
          country_id: 1,
        }
      }).then(()=>{
        const {provinceList} = this.props;
        this.setState({
          provinceList: provinceList,
        })
        this.getCity(provinceList[0].id,'');
      })
    }
  }

  getCity = (code, val) => { // 获取城市接口
    this.props.dispatch({
      type: 'address/getCityList',
      payload: {
        province_id: get(code,'id')
      }
    }).then(()=>{
      const {cityList} = this.props;
      if (val && val.length > 0 && cityList!=='') {
        this.setState({
            cityList: cityList,
            province: get(this.state.provinceList[val[0]],'name'),
            provinceCode: code.id,
            city: get(cityList[val[1]],'name'),
            getValue: val,
            cityCode: get(cityList[val[1]],'id')
        })
      } 
      this.getArea(get(cityList[0],'id'), '');
    })
   
  } 

  getArea = (code, val) => { // 获取区接口
    this.props.dispatch({
      type: 'address/getAreaList',
      payload: {
        city_id: get(code,'id')
      }
    }).then(()=>{
      const {areaList} = this.props;
      if (val && val.length > 0 && areaList!=='') {
      this.setState({
          areaList: areaList,
          city: get(this.state.cityList[val[1]],'name'),
          cityCode: code.id,
          area: get(areaList[val[2]],'name'),
          getValue: val,
          areaCode: get(areaList[val[2]],'id')
      });
      } 
    })
  } 


  onChange = (e) => { // 滑动改变值
    const val = e.detail.value;
    console.log("val")
    console.log(val)
    this.getCity(this.state.provinceList[val[0]], val);
    this.getArea(this.state.cityList[val[1]], val);
    this.setState({
        changeType: true
    })
  }
  openClose = () => { // 点击状态
    this.setState({
        showPicker: !this.state.showPicker,
    });
    // if(this.state.showPicker == true){
    //   this.getProvinceList(0,[this.state.provinceCode,this.state.cityCode,this.state.areaCode]);
    // }
  }
  confirm = () => { //关闭
    this.setState({
      showPicker: false
    });
  }
  clickFun = () => { //点击确认
    this.setState({
      showPicker: false
    });
    this.props.chooseCity(this.state.province, this.state.provinceCode, this.state.city, this.state.cityCode, this.state.area, this.state.areaCode) // 这个地方把值传递给了props的事件当中
  }


  render () {
    const { showPicker, city, province, getTitle, getClose,area} = this.state;
    return (
      <View className='addressBox'>
        <View className='addressTitle' onClick={this.openClose}>
    <View className='addressTitle' >{province}{city}{area}</View>
            <View className='rightIcon'></View>
        </View>
        {   showPicker
            ?<View className='picker'>
                <View className='topList'>
                    {getClose ? <View className='close' onClick={this.confirm}>取消</View> : ''}
                    <View className='title'>{getTitle?getTitle:''}</View>
                    <View className='sure' onClick={this.clickFun}>确认</View>
                </View>
                <PickerView indicatorStyle='height: 50px;' style='width: 100%; height: 200px; text-align: center; line-height: 50px;' value={this.state.getValue} onChange={this.onChange}>
                    <PickerViewColumn>
                        {this.state.provinceList.map(item => {
                            return (
                                <View data-code={item.id} key={item.id}>{item.name}</View>
                            )
                        })}
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {this.state.cityList.map((item) => {
                            return (
                                <View data-code={item.id} key={item.id}>{item.name}</View>
                            );
                        })}
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {this.state.areaList.map((item) => {
                            return (
                                <View data-code={item.id} key={item.id}>{item.name}</View>
                            );
                        })}
                    </PickerViewColumn>
                </PickerView>
            </View>
            :''
        }
  </View>
    )
  }
}

export default addressPicker;

