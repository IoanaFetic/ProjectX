import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartLine from './ChartLine.jsx'
import ChartBar from './ChartBar.jsx'
import ChartPie from './ChartPie.jsx'
import ChartSettings from './ChartSettings.jsx'

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

  convertToMongoDBSyntax(obj){
    var newObj = {}
      for(key of Object.keys(obj)){
        if(Array.isArray(obj[key])){
          newObj[key] = {$in: obj[key]}
        }
        else {
          newObj[key] = obj[key]
        }

      }
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
    var data = {}
    if(this.props.dbName){
      var data = this.gatherData(
        DB[this.props.dbName].find(
          this.convertToMongoDBSyntax(userSettings && userSettings.filter || this.props.settings && this.props.settings.filter || {})
      ).fetch(),
        userSettings && userSettings.sort || this.props.settings && this.props.settings.sort || {}
      )
    }


    var sum = userSettings && userSettings.sum || this.props.settings && this.props.settings.sum
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

      {
        this.props.chart == "line" && <ChartLine data={data} title={this.props.title} sum={sum}/>
      }
      {
        this.props.chart == "bar" && <ChartBar data={data} title={this.props.title} sum={sum}/>
      }
      {
        this.props.chart == "pie" && <ChartPie data={data} title={this.props.title} sum={sum}/>
      }



      {!this.state.showSettings && this.props.edit &&
      <div style={style.optionLinks}>
          <div onClick={this.toggleSettings.bind(this, false)}>
            Settings
          </div>
      </div>
      }

      {this.state.showSettings &&
        <ChartSettings ref="chartSettings" userSettings={userSettings} dbName={this.props.dbName} origSettings={
          JSON.stringify(this.props.settings)
        } id={this.props.id} toggleSettings={this.toggleSettings.bind(this)}/>
      }
    </div>)
  }
}
