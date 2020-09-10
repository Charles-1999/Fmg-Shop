import React, { Component } from 'react'
import { View, Text, Image, PickerView, PickerViewColumn } from '@tarojs/components'
import { AtForm, AtInput, AtButton } from 'taro-ui'
import { get } from 'lodash';
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
    cityCode: '',
    cityList: [],
    area: '',
    areaCode: '',
    areaList: [],
    province: '',
    provinceCode: '',
    provinceList: [],
    getValue: 0,
    getTitle: '',
    getClose: '',
    showPicker: true,
    changeType: false,
  }

  async componentDidMount() { // 这是一个建立定时器的好地方
    let { province, city, area, chooseCity} = this.props;
    console.log(444);
    console.log(province)
    await this.props.dispatch({
      type: 'address/getProvinceList',
      payload: {
        country_id: 1,
      }
    });
    const {provinceList} = this.props;
    this.setState({
        province: province,
        city: city,
    }, () => {
        this.getProvinceList(provinceList);
    })
  }

  getProvinceList = (provinceList) => {  //获取省份接口
    console.log(333333333)
    this.setState({
      provinceList: provinceList,
      getValue: [],
    })
    this.getCity(get(provinceList[0],'id'), '');
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
    })
    const {cityList} = this.props;
    this.getArea(get(cityList[0],'id'), '');
  } 

  getArea = (code, val) => { // 获取区接口
    console.log(33333333333333333333);
    console.log(code);
    console.log(val)
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
  }
  confirm = () => { //关闭
    if (this.state.province === '选择试驾城市' ) {
        this.setState({
            showPicker: false,
            province: this.state.provinceList[0].name,
            city: this.state.cityList[0].name,
            provinceCode: this.state.provinceList[0].id,
            cityCode: this.state.cityList[0].id,
            getValue: [0, 0, 0]
        });
    } else {
        this.setState({
            showPicker: false
        });
    }
  }
  clickFun = () => { //点击确认
    // if (this.state.province === '选择试驾城市' || this.state.changeType === false) {
    //     this.setState({
    //         showPicker: false,
    //         province: this.state.provinceList[0].name,
    //         city: this.state.cityList[0].name,
    //         area: this.state.areaList[0].name,
    //         provinceCode: this.state.provinceList[0].id,
    //         cityCode: this.state.cityList[0].id,
    //         areaCode: this.state.areaList[0].id,
    //         getValue: [0, 0, 0]
    //     });
    //     this.props.chooseCity(this.state.provinceList[0].name, this.state.provinceList[0].id, this.state.cityList[0].name, this.state.cityList[0].id, this.state.areaList[0].name, this.state.areaList[0].id) // 这个地方把值传递给了props的事件当中
    // } else {
        this.setState({
            showPicker: false
        });
        this.props.chooseCity(this.state.province, this.state.provinceCode, this.state.city, this.state.cityCode, this.state.area, this.state.areaCode) // 这个地方把值传递给了props的事件当中
    // }
    // console.log(text,v);
  }
    render () {
    const { showPicker, city, province, getTitle, getClose,area} = this.state;
    return (
      <View className='addressBox'>
        <View className='addressTitle' onClick={this.openClose}>
    <View className='addressTitle' >{province}{city}{area}</View>
            <View className='rightIcon'></View>

            2222222
        </View>
        {   showPicker
            ?<View className='picker'>
                <View className='topList'>
                    {getClose ? <View className='close' onClick={this.confirm}></View> : ''}
                    <View className='title'>{getTitle?getTitle:''}</View>
                    <View className='sure' onClick={this.clickFun}>确认</View>
                </View>
                <PickerView indicatorStyle='height: 50px;' style='width: 100%; height: 200px; text-align: center; line-height: 50px;' value={this.state.getValue} onChange={this.onChange}>
                    <PickerViewColumn>
                        {this.state.provinceList.map(item => {
                            return (
                                <View data-code={item.id}>{item.name}</View>
                            )
                        })}
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {this.state.cityList.map((item) => {
                            return (
                                <View data-code={item.id}>{item.name}</View>
                            );
                        })}
                    </PickerViewColumn>
                    <PickerViewColumn>
                        {this.state.areaList.map((item) => {
                            return (
                                <View data-code={item.id}>{item.name}</View>
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

