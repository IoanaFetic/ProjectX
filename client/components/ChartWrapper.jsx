import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartLine from '../charts/ChartLine.jsx'
import ChartBar from '../charts/ChartBar.jsx'
import ChartPie from '../charts/ChartPie.jsx'
import ChartSettings from './ChartSettings.jsx'
import Ionicon from 'react-ionicons'
import moment from 'moment'
import {saveAs} from 'file-saver'
import 'react-tippy/dist/tippy.css' // style for tooltips (from API)
import {Tooltip} from 'react-tippy';

export default class ChartWrapper extends TrackerReact(React.Component) {
  // reactive, changes with database updates
  constructor(props) {
    super(props)
    this.state = {
      showSettings: false
    }
  }
  gatherData(data, sortKey) {
    var dataObj = {} // temporary object to collate documents from DB
    var firstMonth = 11 // to be updated with earliest month found
    var lastMonth = 0 // to be updated with latest month found
    for (doc of data) { // loop through filtered documents in DB
      var sortEntry = doc[sortKey] // the value this document will be sorted by (e.g. Kamis)
      var valueEntry = doc['value'] // e.g. shelf price
      if (sortEntry && !isNaN(parseFloat(valueEntry))) { // check value is numerical
        if (!dataObj[sortEntry]) { // if no document with the sort value has been found so far (e.g. Kamis)
          dataObj[sortEntry] = { // initiate field in dataObj with group as the key
            n: new Array(12).fill(0), // array of 0s (number of documents found)
            t: new Array(12).fill(0) // array of 0s (total of values)
          }
        }
        // execute code below for all valid documents
        var docMonth = doc.report_month // month of document
        dataObj[sortEntry].n[docMonth]++ // add to count for this sorted group (ie. Kamis)
        dataObj[sortEntry].t[docMonth] += valueEntry // add to value sum for this group
        firstMonth = Math.min(firstMonth, docMonth) // update earliest month
        lastMonth = Math.max(lastMonth, docMonth) // update latest month
        dataObj[sortEntry].firstMonth = parseInt(firstMonth)
        dataObj[sortEntry].lastMonth = parseInt(lastMonth)
      }
    }
    console.log("gathered data, assigned to: ", dataObj)
    return dataObj
  }
  toggleSettings() {
    this.setState({
      showSettings: !this.state.showSettings
    })
  }
  snapChart() {
    try { // may not be supported in very old browsers
      var i = this.refs.chart.refs.chartObj.chartInstance
      i.canvas.toBlob(function(blob) {
        saveAs(blob, "Chart_" + this.props.id + "_" + moment().format("YYYYMMDDHHmmss") + ".png");
      }.bind(this));
    } catch (e) {
      if (e) {
        console.log(e)
      }
    }
  }
  convertToQuery(obj) {
    // converts saved filter settings to a MongoDB query
    // wrap each array of values with {$in: ...}
    // $ can't be stored in MongoDB
    obj = JSON.parse(obj)
    var newObj = {}
    for (key of Object.keys(obj)) {
      if (key == "report_month") {
        // filtering by months, so convert string to month index
        for (m in obj[key]) {
          obj[key][m] = ref.months.indexOf(obj[key][m])
        }
      }
      newObj[key] = {
        $in: obj[key]
      } // convert [] to {$in: []}
    }
    return newObj
  }
  resetSettings() {
    this.refs.chartSettings.resetSettings()
  }
  render() {
    if (Meteor.user()) { // if logged in
      // retrieve and sort data
      var userSettings = (Meteor.user().chartSettings && Meteor.user().chartSettings[this.props.id]) // false if no settings found for this chart
      var settings = this.props.settings[this.props.id]
      var data = {}
      if (this.props.dbName) {
        var query = this.convertToQuery(JSON.stringify(userSettings && userSettings.filter || settings && settings.filter || {}))
        var sortValue = (userSettings && userSettings.sort || settings && settings.sort || '')
        if (Object.keys(query).length > 0) { // search filters were found
          var results = DB[this.props.dbName].find(query).fetch() // query the DB
          var data = this.gatherData(results, sortValue) // send results to be sorted by value
        } else {
          var data = {}
        }
      }
      var sum = userSettings && userSettings.sum || settings && settings.sum
      var margin = .5
      var style = {
        wrapper: {
          position: 'absolute',
          left: margin + "em",
          right: margin + "em",
          top: 0,
          bottom: margin * 2 + "em",
          padding: device < 2
            ? 0
            : "0 1em 0 .5em"
        }
      }
      var noPanel = false; //this.props.chart == "pie" || this.props.chart == "donut"
      if (!noPanel) {
        style.wrapper = {
          ...style.wrapper,
          ...{
            background: 'white',
            borderRadius: '0.3em',
            boxShadow: '0.2em 0.2em 0.2em rgba(0, 0, 0, 0.4)'
          }
        }
      }
      return (<div style={style.wrapper}>
        {this.props.chart == "line" && <ChartLine ref="chart" data={data} title={this.props.title} sum={sum} dbName={this.props.dbName}/>}
        {this.props.chart == "bar" && <ChartBar ref="chart" group={false} data={data} title={this.props.title} sum={sum}/>}
        {this.props.chart == "groupbar" && <ChartBar ref="chart" group={true} data={data} title={this.props.title} sum={sum}/>}
        {this.props.chart == "pie" && <ChartPie ref="chart" hollow={false} data={data} title={this.props.title} sum={sum}/>}
        {this.props.chart == "donut" && <ChartPie ref="chart" hollow={true} data={data} title={this.props.title} sum={sum}/>}
        {
          !this.state.showSettings && this.props.edit && <div style={{
                position: "absolute",
                top: 0,
                left: 0
              }}>
              <Ionicon onClick={this.toggleSettings.bind(this, false)} icon="md-settings" fontSize={iconSize + "px"} color={noPanel
                  ? "white"
                  : color.green} style={{
                  cursor: "pointer",
                  margin: ".2em .4em"
                }}/>
            </div>
        }
        <div style={{
            position: "absolute",
            top: 0,
            right: 0,
            display: "flex"
          }}>
          <Ionicon onClick={this.snapChart.bind(this, false)} icon="md-camera" fontSize={iconSize + "px"} color={noPanel
              ? "white"
              : color.green} style={{
              cursor: "pointer",
              margin: ".2em .4em"
            }}/> {
            this.props.tip && <Tooltip html={<div style = {{maxWidth: "200px"}} > {
                  this.props.tip
                }
                </div>} position="bottom" offset={-60} animation="scale" distance={5} maxWidth="150px">
                <Ionicon icon="md-information-circle" fontSize={iconSize + "px"} color={noPanel
                    ? "white"
                    : color.green} style={{
                    margin: ".25em .4em 0 0"
                  }}/>
              </Tooltip>
          }
        </div>
        {this.state.showSettings && <ChartSettings ref="chartSettings" userSettings={userSettings} dbName={this.props.dbName} origSettings={JSON.stringify(settings)} id={this.props.id} toggleSettings={this.toggleSettings.bind(this)} resubscribe={this.props.resubscribe}/>}
      </div>)
    } else {
      return false
    }
  }
}
