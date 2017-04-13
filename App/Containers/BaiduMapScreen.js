import React, {
    Component,
    PropTypes
} from 'react';

import {
    MapView,
    MapTypes,
    Geolocation
} from 'react-native-baidu-map';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    TouchableOpacity,
    Image,
    Platform
} from 'react-native';

import { Colors, Images, Metrics } from '../Themes'
import Icon from 'react-native-vector-icons/FontAwesome'

//import SearchBar from 'react-native-search-bar';
import I18n from 'react-native-i18n'
import ModalDropdown from 'react-native-modal-dropdown';

import Dimensions from 'Dimensions';

import Styles from './Styles/MapviewStyle'
import RoundedButton from '../Components/RoundedButton'

import Parse from 'parse/react-native';
import ParseReact from 'parse-react/react-native';
var ParseComponent = ParseReact.Component(React);

export default class BaiduMap extends Component {

  constructor(props) {
    //console.log('props:', props.data)
    super(props);

//------------cache---------------------------
    var query = new Parse.Query('LocationList').ascending('createdAt');
    query.find({
      success: function(lt_results){
        try {
          AsyncStorage.setItem('lt_results', JSON.stringify(lt_results));
        } catch (error) {
          console.log('error: ', error)
        }
      }.bind(this)
    })

    var c_query = new Parse.Query('CategoryList').ascending('categoryId');
    c_query.find({
      success: function(results){
        try {
          AsyncStorage.setItem('results', JSON.stringify(results));
        } catch (error) {
          console.log('error: ', error)
        }
      }.bind(this)
    })
//---------------------------------------------------

    Geolocation.getCurrentPosition()
      .then(data => {
        this.setState({
          latitude: data.latitude,
          longitude: data.longitude,
          center: {
            latitude: data.latitude,
            longitude: data.longitude
          },
          marker:{
            longitude:data.longitude,
            latitude:data.latitude,
            title:I18n.t('yourlocation')
          }
        });
      }
    )

    var c_query = new Parse.Query('CategoryList').ascending('categoryId');
    var c_option = []
    var c_icon = []
    c_query.find({
      success: function(results){
        for(var i = 0;i < results.length;i++){
          c_option[i] = I18n.t(results[i].attributes.categoryName)
          c_icon[i] = results[i].attributes.categoryIcon
        }
        this.setState({
          c_option:c_option,
          c_icon:c_icon
        })
//---------------cache----------------------------------------------------------
      //  AsyncStorage.clear
        try {
          AsyncStorage.setItem('c_option', JSON.stringify(c_option));
          AsyncStorage.setItem('c_icon', JSON.stringify(c_icon));
        } catch (error) {
          console.log('error: ', error)
        }
      }.bind(this),
      error: function(error) {
        AsyncStorage.getItem('c_option', (err, c_option) => {
          AsyncStorage.getItem('c_icon', (err, c_icon) => {
      //      console.log(JSON.parse(c_option), JSON.parse(c_icon));
            this.setState({
              c_option:JSON.parse(c_option),
              c_icon:JSON.parse(c_icon),
              dropdown_flag:false
            })
          })
        })
      }.bind(this)
    })
//-------------------------------------------------------------------------------

    this.state = {
      dropdown_flag:true,
      miles:12.4,
      latitude:0,
      longitude:0,
      c_option:[],
      c_icon:[],
      dropdown_defaultValue: I18n.t('pleaseselect'),
      mayType: MapTypes.NORMAL,
      zoom: 15,
      trafficEnabled: false,
      baiduHeatMapEnabled: false,
    };
  }
  componentDidMount() {
    Geolocation.getCurrentPosition()
      .then(data => {
        this._executeQuery(
              {
                latitude: data.latitude,
                longitude: data.longitude,
              }
            );
          }
        )
  }
  _executeQuery(currentLocation) {
    var query = new Parse.Query('LocationList').ascending('createdAt');
    var geoPoint = new Parse.GeoPoint({latitude: currentLocation.latitude,longitude: currentLocation.longitude,});

    query.withinMiles('location', geoPoint, this.state.miles);

    var marker = []
    query.find({
      success: function(results) {
        for(var i = 0;i < results.length;i++){
          var obj = {latitude: results[i].attributes.latitude, longitude: results[i].attributes.longitude, title:results[i].attributes.name};
          marker.push(obj);
        }
        if(!this.props.data){
          this.setState({
            markers: marker
          });
        }else{
          var category_click_query = new Parse.Query('LocationList').ascending('createdAt');
          category_click_query.find({
            success: function(c_results){
              for(var i = 0;i < c_results.length;i++){
                if(this.props.data == c_results[i].attributes.name){
                  this.setState({
                    center: {
                      latitude: c_results[i].attributes.latitude,
                      longitude: c_results[i].attributes.longitude
                    },
                    markers:[{
                      latitude:c_results[i].attributes.latitude,
                      longitude:c_results[i].attributes.longitude,
                      title:this.props.data
                    }]
                  })
                  break
                }
              }
            }.bind(this)
          })
        }
//----------------cache----------------------------------------------------
        try {
          AsyncStorage.setItem('marker', JSON.stringify(marker));
        } catch (error) {
          console.log('error: ', error)
        }
      }.bind(this),
      error: function(error) {
        AsyncStorage.getItem('marker', (err, marker) => {
          AsyncStorage.getItem('lt_results', (err, lt_results) => {
            if(!this.props.data){
              this.setState({
                markers: JSON.parse(marker)
              });
            }else{
              for(var i = 0;i < JSON.parse(lt_results).length;i++){
                if(this.props.data == JSON.parse(lt_results)[i].name){
                  this.setState({
                    center: {
                      latitude: JSON.parse(lt_results)[i].latitude,
                      longitude: JSON.parse(lt_results)[i].longitude
                    },
                    markers:[{
                      latitude:JSON.parse(lt_results)[i].latitude,
                      longitude:JSON.parse(lt_results)[i].longitude,
                      title:this.props.data
                    }]
                  })
                  break
                }
              }
            }
          })
        })
      }.bind(this)
    });
//--------------------------------------------------------------------------
  }

  getValue(id, name){
    var l_query = new Parse.Query('LocationList').ascending('categoryId');
    var c_query = new Parse.Query('CategoryList').ascending('categoryId');
    var geoPoint = new Parse.GeoPoint({latitude: this.state.latitude,longitude: this.state.longitude});

    l_query.withinMiles('location', geoPoint, this.state.miles);

    var markers = []
    c_query.find({
      success: function(results){
        for(var i = 0;i < results.length;i++){
          if(name == results[i].attributes.categoryName){
    //        var c_id = results[i].attributes.categoryId
          }
        }
        var c_id = parseInt(id) + 1  //----------static----------
        l_query.find({
          success: function(l_results){
            for(var i = 0;i < l_results.length;i++){
              if(c_id == l_results[i].attributes.categoryId){
                var obj = {latitude: l_results[i].attributes.latitude, longitude: l_results[i].attributes.longitude, title:l_results[i].attributes.name};
                markers.push(obj);
              }else{
                var obj = {};
                markers.push(obj);
              }
            }
            this.setState({
              marker:this.state.marker,
              markers: markers
            });
//---------------------------cache---------------------------------------
            try {
              AsyncStorage.setItem('l_results', JSON.stringify(l_results));
            } catch (error) {
              console.log('error: ', error)
            }
          }.bind(this)
        })
      }.bind(this),
      error: function(error) {
        AsyncStorage.getItem('results', (err, results) => {
          AsyncStorage.getItem('l_results', (err, l_results) => {
            for(var i = 0;i < JSON.parse(results).length;i++){
              if(name == JSON.parse(results)[i].categoryName){
        //        var c_id = JSON.parse(results)[i].categoryId
              }
            }
            var c_id = parseInt(id) + 1  //----------static----------
            for(var i = 0;i < JSON.parse(l_results).length;i++){
              if(c_id == JSON.parse(l_results)[i].categoryId){
                var obj = {latitude: JSON.parse(l_results)[i].latitude, longitude: JSON.parse(l_results)[i].longitude, title:JSON.parse(l_results)[i].name};
                markers.push(obj);
              }else{
                var obj = {};
                markers.push(obj);
              }
            }
            this.setState({
              marker:this.state.marker,
              markers: markers
            });
          })
        })
      }.bind(this)
    })
//--------------------------------------------------------------------------
  }

  dropdown_renderRow(rowData, rowID, highlighted) {
    let evenRow = rowID % 2;
    return (
      <View style={[styles.dropdown_row, evenRow && {backgroundColor: 'lemonchiffon'}]}>
        <Image style={styles.dropdown_image}
               mode='stretch'
               source={{uri: this.state.dropdown_flag ? this.state.c_icon[rowID]._url : this.state.c_icon[rowID].url}}
        />
        <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
          {rowData}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          trafficEnabled={this.state.trafficEnabled}
          baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
          zoom={this.state.zoom}
          mapType={this.state.mapType}
          center={this.state.center}
          marker={this.state.marker}
          markers={this.state.markers}
          style={Styles.map}
          onMapClick={(e) => {
          }}>
        </MapView>
        <View style={styles.dropdown_view}>
          <ModalDropdown style={styles.dropdown}
             textStyle={styles.dropdown_text}
             options={this.state.c_option}
             dropdownStyle={styles.dropdown_dropdown}
             defaultValue={this.state.dropdown_defaultValue}
             renderRow={this.dropdown_renderRow.bind(this)}
             onSelect={this.getValue.bind(this)}
          />
        </View>
        <View style={styles.column}>
          <TouchableOpacity onPress={() => {
             Geolocation.getCurrentPosition()
               .then(data => {
                 this.setState({
                   zoom: 15,
                   marker: {
                     latitude: data.latitude,
                     longitude: data.longitude,
                     title: I18n.t('yourlocation')
                   },
                   center: {
                     latitude: data.latitude,
                     longitude: data.longitude
                   }
                 });
               })
               .catch(e =>{
                 console.warn(e, 'error');
               })
             }}>
              <Image source={Images.compass} style={styles.compass_image}/>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
}

const styles = StyleSheet.create({
                 row: {
                   flexDirection: 'row'
                 },
                 column: {
                   flexDirection: 'column',
                   marginTop: (Platform.OS === 'ios') ? Dimensions.get('window').height - 113 : Dimensions.get('window').height - 140,
                   marginLeft: (Platform.OS === 'ios') ? Dimensions.get('window').width - 43 : Dimensions.get('window').width - 87,
                   marginBottom: (Platform.OS === 'ios') ? 2 : 5,
                   marginRight: (Platform.OS === 'ios') ? 2 : 30
                 },
                 btn: {
                   height: 24,
                   borderRadius: 4,
                   alignItems: 'center',
                   justifyContent: 'center',
                   backgroundColor: '#cccccc',
                   paddingLeft: 8,
                   paddingRight: 8,
                   margin: 4
                 },
                 container: {
                   flex: 1,
                   justifyContent: 'flex-start'
                 },
                 dropdown_view: {
                   marginLeft: 8,
                   marginRight: Dimensions.get('window').width - 200,
                   marginTop: 70,
                   flex: 1
                 },
                 dropdown: {
                    width: 150,
                    borderWidth: 0,
                    borderRadius: 3,
                    backgroundColor: 'cornflowerblue',
                 },
                 dropdown_text: {
                    height: 30,
                    lineHeight: 30,
                    marginHorizontal: 6,
                    fontSize: 18,
                    color: 'white',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  },
                  dropdown_row: {
                    flex: 1,
                    flexDirection: 'row',
                    height: 40,
                    alignItems: 'center',
                  },
                  dropdown_image: {
                    marginLeft: 4,
                    width: 30,
                    height: 30,
                  },
                  compass_image: {
                    width: 40,
                    height: 40,
                  },
                 dropdown_dropdown: {
                   width: 150
                 }
               });
