import React from 'react'
import { View, ListView, Text, TextInput, TouchableOpacity, AsyncStorage } from 'react-native'
import { connect } from 'react-redux'
//import SearchBar from 'react-native-search-bar';

// For empty lists
import AlertMessage from '../Components/AlertMessage'

import I18n from 'react-native-i18n'

// Styles
import styles from './Styles/CategoryStyle'

import Parse from 'parse/react-native';

import { Actions as NavigationActions } from 'react-native-router-flux'
import BaiduMapScreen from '../Containers/BaiduMapScreen'

class CategoryScreen extends React.Component {

  constructor (props) {
    super(props)

    var c_query = new Parse.Query('CategoryList').ascending('categoryId');
    var length = 0
    var categoryId = {}
    var categoryName = {}
    c_query.find({
      success: function(results){
        for(var i = 0;i < results.length;i++){
          categoryId[i] = results[i].attributes.categoryId
          categoryName[i] = results[i].attributes.categoryName
        }
        length = results.length
      }.bind(this)
    })

    var category = []
    const dataObjects = {}
    var query = new Parse.Query('LocationList').ascending('categoryId');
    query.find({
      success: function(results){
        for(var i = 0;i < length;i++){
          for(var j = 0;j < results.length;j++){
            if(categoryId[i] == results[j].attributes.categoryId){
              var obj = {title: results[j].attributes.name, description: results[j].attributes.address + ', ' + results[j].attributes.city + ', ' + results[j].attributes.postal_code};
              category.push(obj);
            }
          }
          dataObjects[categoryName[i]] = category
          category = []
        }
        this.setState({
          dataSource: ds.cloneWithRowsAndSections(dataObjects),
          data:dataObjects,
          length:length,
          categoryId:categoryId,
          categoryName:categoryName
        })
      }.bind(this),
//------------------cache-----------------------------------
      error: function(error) {
        AsyncStorage.getItem('results', (err, results) => {
          AsyncStorage.getItem('lt_results', (err, lt_results) => {

            for(var i = 0;i < JSON.parse(results).length;i++){
              categoryId[i] = JSON.parse(results)[i].categoryId
              categoryName[i] = JSON.parse(results)[i].categoryName
            }
            length = JSON.parse(results).length

            for(var i = 0;i < length;i++){
              for(var j = 0;j < JSON.parse(lt_results).length;j++){
                if(categoryId[i] == JSON.parse(lt_results)[j].categoryId){
                  var obj = {title: JSON.parse(lt_results)[j].name, description: JSON.parse(lt_results)[j].address + ', ' + JSON.parse(lt_results)[j].city + ', ' + JSON.parse(lt_results)[j].postal_code};
                  category.push(obj);
                }
              }
              dataObjects[categoryName[i]] = category
              category = []
            }
            this.setState({
              dataSource: ds.cloneWithRowsAndSections(dataObjects),
              data:dataObjects,
              length:length,
              categoryId:categoryId,
              categoryName:categoryName
            })
          })
        })
      }.bind(this)
    })
//-----------------------------------------------------------------
    const rowHasChanged = (r1, r2) => r1 !== r2
    const sectionHeaderHasChanged = (s1, s2) => s1 !== s2
    // DataSource configured
    const ds = new ListView.DataSource({rowHasChanged, sectionHeaderHasChanged})

    // Datasource is always in state
    this.state = {
      dataSource: ds.cloneWithRowsAndSections(dataObjects),
      data:dataObjects,
      length:length,
      categoryId:categoryId,
      categoryName:categoryName
    }
  }

  _renderRow (rowData, sectionID) {
    return (
      <TouchableOpacity onPress={() => NavigationActions.BaiduMapScreen(rowData.title)}>
        <View style={styles.row}>
          <Text style={styles.boldLabel}>{rowData.title}</Text>
          <Text style={styles.label}>{rowData.description}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _noRowData () {
    return this.state.dataSource.getRowCount() === 0
  }

  _renderHeader (data, sectionID) {
    //console.log('results:',  data)
    if(data.length != 0){
      return <Text style={styles.boldLabel}>{I18n.t(sectionID)}</Text>
    }else{
      return <Text style={styles.emptyLabel}></Text>
    }
  }

  setSearchText(event) {
    let searchText = event.nativeEvent.text;
    this.setState({searchText});

    this.filterNotes(searchText);
  }

  filterNotes(searchText) {
    var text = searchText.toLowerCase();

    var name = {}
    var address = {}
    var city = {}
    var postal_code = {}
    var f_categoryId = {}
    var cj = 0

    var f_category = []
    const filteredData = {}
    var query = new Parse.Query('LocationList').ascending('categoryId');
    query.find({
      success: function(results){
        for(var i = 0;i < results.length;i++){
          if(((results[i].attributes.name).toLowerCase()).search(text) !== -1 || ((results[i].attributes.city).toLowerCase()).search(text) !== -1 || ((results[i].attributes.address).toLowerCase()).search(text) !== -1){
            name[cj] = results[i].attributes.name
            address[cj] = results[i].attributes.address
            city[cj] = results[i].attributes.city
            postal_code[cj] = results[i].attributes.postal_code
            f_categoryId[cj] = results[i].attributes.categoryId
            cj++
          }
        }
        for(var i = 0;i < this.state.length;i++){
          for(var j = 0;j < Object.keys(name).length;j++){
            if(this.state.categoryId[i] == f_categoryId[j]){
              var obj = {title: name[j], description: address[j] + ', ' + city[j] + ', ' + postal_code[j]};
              f_category.push(obj);
            }
          }
          filteredData[this.state.categoryName[i]] = f_category
          f_category = []
        }
        const rowHasChanged = (r1, r2) => r1 !== r2
        const sectionHeaderHasChanged = (s1, s2) => s1 !== s2
        // DataSource configured
        const ds = new ListView.DataSource({rowHasChanged, sectionHeaderHasChanged})
        this.setState({
          dataSource: ds.cloneWithRowsAndSections(filteredData)
        });
      }.bind(this),
//------------------cache-------------------------------------------
      error: function(error) {
        AsyncStorage.getItem('lt_results', (err, lt_results) => {
          for(var i = 0;i < JSON.parse(lt_results).length;i++){
            if(((JSON.parse(lt_results)[i].name).toLowerCase()).search(text) !== -1 || ((JSON.parse(lt_results)[i].city).toLowerCase()).search(text) !== -1 || ((JSON.parse(lt_results)[i].address).toLowerCase()).search(text) !== -1){
              name[cj] = JSON.parse(lt_results)[i].name
              address[cj] = JSON.parse(lt_results)[i].address
              city[cj] = JSON.parse(lt_results)[i].city
              postal_code[cj] = JSON.parse(lt_results)[i].postal_code
              f_categoryId[cj] = JSON.parse(lt_results)[i].categoryId
              cj++
            }
          }
          for(var i = 0;i < this.state.length;i++){
            for(var j = 0;j < Object.keys(name).length;j++){
              if(this.state.categoryId[i] == f_categoryId[j]){
                var obj = {title: name[j], description: address[j] + ', ' + city[j] + ', ' + postal_code[j]};
                f_category.push(obj);
              }
            }
            filteredData[this.state.categoryName[i]] = f_category
            f_category = []
          }
          const rowHasChanged = (r1, r2) => r1 !== r2
          const sectionHeaderHasChanged = (s1, s2) => s1 !== s2
          // DataSource configured
          const ds = new ListView.DataSource({rowHasChanged, sectionHeaderHasChanged})
          this.setState({
            dataSource: ds.cloneWithRowsAndSections(filteredData)
          });
        })
      }.bind(this)
    })
//-------------------------------------------------------------------------
  }

  render () {
    const { fetching } = this.props
    const editable = !fetching
    const textInputStyle = editable ? styles.textInput : styles.textInputReadonly
    return (
      <View style={styles.container}>
        <TextInput
          ref='search'
          style={textInputStyle}
          value={this.state.searchText}
          editable={editable}
          keyboardType='default'
        //  backgroundColor='white'
          onChange={this.setSearchText.bind(this)}
          underlineColorAndroid='transparent'
          placeholder={I18n.t('search')}
          placeholderTextColor='#595959'/>
        <AlertMessage title={I18n.t('nosearch')} show={this._noRowData()} />
        <ListView
          renderSectionHeader={this._renderHeader}
          contentContainerStyle={styles.listContent}
          dataSource={this.state.dataSource}
          onLayout={this.onLayout}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryScreen)
