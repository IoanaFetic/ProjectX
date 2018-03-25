import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartLine from './Charts/ChartLine.jsx'
import ChartBar from './Charts/ChartBar.jsx'
import ChartPie from './Charts/ChartPie.jsx'
import ChartSettings from './ChartSettings.jsx'
import Ionicon from 'react-ionicons'



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
        userSettings && userSettings.sort || this.props.settings && this.props.settings.sort || ''
      )
    }


    var sum = userSettings && userSettings.sum || this.props.settings && this.props.settings.sum
    var margin = '0.5em'

    var style = {
      wrapper:  {
        position: 'absolute',
        left: margin,
        right: margin,
        top: margin,
        bottom: margin,
        padding: "0em 1em .5em 0em",
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
        this.props.chart == "line" && <ChartLine data={data} title={this.props.title} sum={sum} options={this.props.options}/>
      }
      {
        this.props.chart == "bar" && <ChartBar data={data} title={this.props.title} sum={sum} options={this.props.options}/>
      }
      {
        this.props.chart == "pie" && <ChartPie hollow={false} data={data} title={this.props.title} sum={sum} options={this.props.options}/>
      }
      {
        this.props.chart == "donut" && <ChartPie hollow={true} data={data} title={this.props.title} sum={sum} options={this.props.options}/>
      }

      {!this.state.showSettings && this.props.edit &&
      <div style={{
        position: "absolute",
        top: 0,
        left: ".3em",
        cursor: "pointer",
        padding: ".3em"
      }}>
          <div onClick={this.toggleSettings.bind(this, false)}>
            <Ionicon icon="md-settings" fontSize="16px" color={noPanel? "white": color.green} style={{
                marginRight: ".5em"
              }}/>
          </div>
      </div>
      }

      {this.state.showSettings &&
        <ChartSettings ref="chartSettings" userSettings={userSettings} dbName={this.props.dbName} origSettings={
          JSON.stringify(this.props.settings)
        } id={this.props.id} toggleSettings={this.toggleSettings.bind(this)} />
      }
    </div>
  )
  }
}
