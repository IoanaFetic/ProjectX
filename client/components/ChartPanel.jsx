import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartLine from '../charts/ChartLine.jsx'
import ChartBar from '../charts/ChartBar.jsx'
import ChartPie from '../charts/ChartPie.jsx'
import ChartSettings from './ChartSettings.jsx'
import Ionicon from 'react-ionicons'
import moment from 'moment'
import { saveAs } from 'file-saver'

import 'react-tippy/dist/tippy.css'
import {
  Tooltip,
} from 'react-tippy';



export default class ChartPanel extends TrackerReact(React.Component) {
  constructor(props){
    super(props)
    this.state = {
      showSettings: false
    }
  }

  gatherData(data, sortKey) {
    var dataObj = {} // temporary object to collate documents from DB

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
    return dataObj
  }


  toggleSettings(){
    this.setState({
      showSettings: !this.state.showSettings
    })
  }

  snapChart(){
    try { // may not be supported in very old browsers
      var i = this.refs.chart.refs.chartObj.chartInstance
      i.canvas.toBlob(function(blob) {
          saveAs(blob, "Chart_" + this.props.id + "_" + moment().format("YYYYMMDDHHmmss") +".png");
      }.bind(this));
    } catch(e){
      if(e){ console.log(e) }
    }
  }

  convertToQuery(obj){
    obj = JSON.parse(obj)
    var newObj = {}
      for(key of Object.keys(obj)){
        if(key == "report_month"){
          for(m in obj[key]){
            obj[key][m] = ref.months.indexOf(obj[key][m])
          }
        }
        newObj[key] = {$in: obj[key]}


      }
    return newObj
  }
  resetSettings(){
    this.refs.chartSettings.resetSettings()
  }


  render() {

    if(Meteor.user()){
    // retrieve and sort data
    var forcedFilter = {

    }
    var userSettings = (
      Meteor.user().profile &&
      Meteor.user().chartSettings &&
      Meteor.user().chartSettings[this.props.id]
    )
    var data = {}
    if(this.props.dbName){
      var query = this.convertToQuery(
        JSON.stringify(userSettings && userSettings.filter || this.props.settings && this.props.settings.filter || {})
      )
      var sortValue = (
        userSettings && userSettings.sort || this.props.settings && this.props.settings.sort || ''
      )
      var data = this.gatherData(
        DB[this.props.dbName].find(query).fetch(), sortValue)
    }


    var sum = userSettings && userSettings.sum || this.props.settings && this.props.settings.sum
    var margin = .5

    var style = {
      wrapper:  {
        position: 'absolute',
        left: margin + "em",
        right: margin + "em",
        top: 0,
        bottom: margin*2 + "em",
      },

    }

    var noPanel = this.props.chart == "pie" || this.props.chart == "donut"
    if(!noPanel){
      style.wrapper = {...style.wrapper, ...{
        background: 'white',
        borderRadius: '0.3em',
        boxShadow: '0.2em 0.2em 0.2em rgba(0, 0, 0, 0.4)',
      }}
    }


    return (
      <div style={style.wrapper}>

      {
        this.props.chart == "line" &&
        <ChartLine ref="chart" data={data} title={this.props.title} sum={sum} options={this.props.options}/>
      }
      {
        this.props.chart == "bar" &&
        <ChartBar ref="chart" data={data} title={this.props.title} sum={sum} options={this.props.options}/>
      }
      {
        this.props.chart == "pie" &&
        <ChartPie ref="chart" hollow={false} data={data} title={this.props.title} sum={sum} options={this.props.options}/>
      }
      {
        this.props.chart == "donut" &&
        <ChartPie ref="chart" hollow={true} data={data} title={this.props.title} sum={sum} options={this.props.options}/>
      }

      {!this.state.showSettings && this.props.edit &&
        <div style={{
          position: "absolute",
          top: 0,
          left: 0
        }}>

          <Ionicon
            onClick={this.toggleSettings.bind(this, false)}
            icon="md-settings"
            fontSize="20px"
            color={noPanel? "white": color.green}
            style={{
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
            <Ionicon
              onClick={this.snapChart.bind(this, false)}
              icon="md-camera"
              fontSize="20px"
              color={noPanel? "white": color.green}
              style={{
                cursor: "pointer",
                margin: ".2em .4em"
              }}/>

              {this.props.tip && <Tooltip
                html={<div style={{maxWidth: "200px"}}>
                  {this.props.tip}
                </div>}
                position="bottom"
                offset={-60}
                animation="scale"
                distance={5}
                maxWidth="150px"
                >
                <Ionicon
                  icon="md-information-circle"
                  fontSize="20px"
                  color={noPanel? "white": color.green}
                  style={{
                    margin: ".25em .4em 0 0"
                  }}/>
              </Tooltip>}


      </div>

      {this.state.showSettings &&
        <ChartSettings ref="chartSettings" userSettings={userSettings} dbName={this.props.dbName} origSettings={
          JSON.stringify(this.props.settings)
        } id={this.props.id} toggleSettings={this.toggleSettings.bind(this)} />
      }
    </div>
  )
}
else {
  return false
}
  }
}
