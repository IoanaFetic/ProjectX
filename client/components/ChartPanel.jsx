import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import Chart from './Chart.jsx'
import Chips, { Chip } from 'react-chips'
import Ionicon from 'react-ionicons'

const style = {
  optionLinks: {
        position: "absolute",
        top: "0.5em",
        left: "1em",
        cursor: "pointer",
        fontWeight: "bold",
        color: color.green,
        display: "flex"
    }
}
export default class ChartPanel extends TrackerReact(React.Component) {
  constructor(props){
    super(props)
    this.state = {
      showTotal: props.showTotal || false,
      showSettings: false
    }
  }

  processData(data, sortKey) {

    var dataObj = {} // temporary object to collate documents from DB
    var datasets = [] // to be entered into Chart.js object
    for (doc of data) { // loop through filtered documents in DB
      var sortEntry = doc[sortKey] // the value this document will be sorted by. ie Kamis
      var valueEntry = doc['value'] // ie. shelf price
      if (sortEntry && !isNaN(parseFloat(valueEntry))) { // check value is numerical
        if (!dataObj[sortEntry]) { // if no document with the sort value has been found so far (ie Kamis)
          dataObj[sortEntry] = { // initiate field in dataObj with group as the key
            n: new Array(12).fill(0), // array of 0s (number of documents found)
            t: new Array(12).fill(0) // array of 0s (total of values)
          }
        }
        // execute code below for all valid documents
        var docMonth = doc.report_month // month of document
        dataObj[sortEntry].n[docMonth]++ // add to count for this sorted group (ie. Kamis)
        dataObj[sortEntry].t[docMonth] += doc['value'] // add to value sum for this group
      }
    }
    // convert dataObj into Chart.js friendly object
    var lines = Object.keys(dataObj) // sorted group names (ie Kamis, etc.)
    var p = 0 // to increment colours
    for (line of lines) { // loop through groups, to create line for each
      var lineData = [] // data array for this line
      var lastKnownValue = 0 // to carry over last known value (if months are missing)
      for (m = 0; m < 12; m++) { // loop through month indexes
        if (dataObj[line].n[m] > 0) { // if any documents were found for this month
          lastKnownValue = this.state.showTotal
            ? dataObj[line].t[m]
            : dataObj[line].t[m] / dataObj[line].n[m] // calculate average value
        }
        lineData[m] = lastKnownValue // assign data point the last known avg value
      }
      p++ // increment to next colour
      datasets.push({ // add this line to the datasets array
        data: lineData,
        label: line,
        fill: false,
        borderColor: "#" + palette[p], // line colour
        //  steppedLine: true  step between values
      })
    }
    return { // return Chart.js friendly object
      labels: ref.months,
      datasets
    }
  }

  toggleTotal(){
    this.setState({
      showTotal: !this.state.showTotal
    })
  }
  toggleSettings(){
    this.setState({
      showSettings: !this.state.showSettings
    })
  }

  convertToMongoDBSyntax(obj){
    var newObj = {}
      for(key of Object.keys(obj)){
        newObj[key] = {$in: obj[key]}
      }


    console.log(newObj)
    return newObj
  }
  resetSettings(){
    this.refs.chartSettings.resetSettings()
  }

  render() {
    // retrieve and sort data
    var userSettings = (
      Meteor.user() &&
      Meteor.user().profile &&
      Meteor.user().profile.chartSettings &&
      Meteor.user().profile.chartSettings[this.props.id]
    )

    var data = this.props.dbName? this.processData(DB[this.props.dbName].find(
      this.convertToMongoDBSyntax(userSettings && userSettings.filter || this.props.settings.filter || {})
    ).fetch(),
      userSettings && userSettings.sort || this.props.settings.sort || {}
    ): {}

    var margin = '0.5em'
    return (<div style={{
        position: 'absolute',
        left: margin,
        right: margin,
        top: margin,
        bottom: margin,
        background: 'white',
        borderRadius: '0.3em',
        boxShadow: '0.2em 0.2em 0.2em rgba(0, 0, 0, 0.4)',
        padding: "0em 1em"

      }}>
      <Chart data={data} title={this.props.title}/>
      <div style={{
          position: "absolute",
          color: color.green,
          top: "0.5em",
          right: "1em",
          cursor: "pointer"
        }} onClick={this.toggleTotal.bind(this)}>
        {this.state.showTotal? "Show Averages": "Show Totals"}
      </div>

      {!this.state.showSettings &&
      <div style={style.optionLinks}>
          <div onClick={this.toggleSettings.bind(this, false)}>
            Settings
          </div>
      </div>
      }

      {this.state.showSettings &&
        <ChartSettings ref="chartSettings" userSettings={userSettings} origSettings={
          JSON.stringify(this.props.settings)
        } id={this.props.id} toggleSettings={this.toggleSettings.bind(this)}/>
      }
    </div>)
  }
}


class ChartSettings extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      settings: props.userSettings || this.props.origSettings && JSON.parse(this.props.origSettings) || {
        filter: {},
        sort: ''
      }
    }
  }
  saveSettings(){
    if(JSON.stringify(this.state.settings) == this.props.origSettings){
      var newSettings = Meteor.user().profile.chartSettings
      delete newSettings[this.props.id]
      Meteor.call("updateProfile", "chartSettings", newSettings)
    }
    else {
      Meteor.call("updateProfile", "chartSettings." + this.props.id, this.state.settings)
    }
    this.props.toggleSettings()

  }
  setFilter(key){
    var settings = this.state.settings
    settings.filter[key.value] = []
    this.setState({
      settings
    })
  }
  removeFilter(key){
    var settings = this.state.settings
    delete settings.filter[key]
    this.setState({
      settings
    })
  }
  changeChips(key, newArray){
    var settings = this.state.settings
    settings.filter[key] = newArray
    this.setState({
      settings
    })
    console.log(this.props.origSettings)
  }
  resetSettings(){
    var settings = this.props.origSettings
    this.setState({
      settings: JSON.parse(settings)
    })
    this.state.settings = settings
  }

  setSort(val){
    var settings = this.state.settings
    settings.sort = val.value
    this.setState({
      settings
    })
  }

  render(){
    var original = JSON.stringify(this.state.settings) == this.props.origSettings
    return (
      <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.9,
          backgroundColor: "white",
          zIndex: 2,
          padding: "3em",
          borderRadius: '0.3em'
        }}>


        <div style={{
              position: "absolute",
              top: "0.5em",
              left: "1em",
              cursor: "pointer",
              fontWeight: "bold",
              color: color.green,
              zIndex: 3,
              display: "flex"
              }}
            >
            <div onClick={this.props.toggleSettings}>
              Cancel
            </div>
            <div onClick={this.saveSettings.bind(this)} style={{marginLeft: "1.5em"}}>
                Save
              </div>
              {!original &&
              <div onClick={this.resetSettings.bind(this)} style={{marginLeft: "1.5em"}}>
                Reset
              </div>
            }
            </div>

        <div style={{
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            marginBottom: "1em",
            display: "flex",
            alignItems: "center"
          }}>


            <Ionicon icon="md-funnel" fontSize="20px" style={{
              margin: "0 .5em 0 .5em"
            }}/>
            <div style={{
                width: "10em"
            }}>
              <Dropdown options={[
                "brand",
                "city",
              "district"
              ]} onChange={this.setSort.bind(this)} value={this.state.settings.sort}/>
            </div>

            <Ionicon icon="md-add" fontSize="16px" style={{
              margin: "0 .4em 0 2em"
            }}/>
              <div style={{
                  width: "10em",
              }}>
                <Dropdown options={[
                  "brand",
                  "city",
                "district"
                ]} onChange={this.setFilter.bind(this)} placeholder="Filter by key..." />
              </div>

          </div>

          {
            Object.keys(this.state.settings.filter).map((field, k) => {
              return (
                  <FilterField
                    key={'filterfield_'+k}
                    field={field}
                    chips={this.state.settings.filter[field]}
                    removeFilter={this.removeFilter.bind(this)}
                    changeChips={this.changeChips.bind(this, field)}
                  />
              )
            })
          }

        </div>

      </div>
    )
  }
}
//

import Dropdown from 'react-dropdown'

class FilterField extends React.Component {

  render(){
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: ".6em"
      }}>
      <div style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: ".3em"
      }}>
        <div style={{width: "10em", display: "flex", alignItems: "center"}}>
          <div style={{marginLeft: "1em", fontWeight: "bold"}}>
            {this.props.field}
          </div>

        </div>


      </div>
      <div style={{position: "relative"}}>
        <Chips
          value={this.props.chips}
          onChange={this.props.changeChips}
          suggestions={[
            'Kamis',
            'Fuchs',
            'Kotanyi'
          ]}
          alwaysRenderSuggestions={true}
        />
        <Ionicon icon="md-close-circle" fontSize="20px"
          onClick={this.props.removeFilter.bind(null, this.props.field)}
          style={{
            cursor: "pointer", padding: ".1em", display: "inline-block",
            position: "absolute",
            right: -10,
            top: -10
          }}
        />
      </div>


    </div>
    )
  }
}
