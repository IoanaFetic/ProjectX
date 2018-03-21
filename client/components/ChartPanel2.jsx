import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import Chart from './Chart2.jsx'

export default class ChartPanel extends TrackerReact(React.Component){


  getAvg(){
    for(i=0; i < 12; i++){
      months[i] = {
        sum: 0,
        n: 0
      }
      rows[i+1] = [i+1]
    };
  }

  processData(data, sortKey, valueKey){

    var dataObj = {}
    var datasets = []

    for (doc of data){
      var sortField = doc[sortKey]
      var valueField = doc[valueKey]
      if (sortField && !isNaN(parseFloat(valueField))){
        if(!dataObj[sortField]){
          dataObj[sortField] = {
            n: new Array(12).fill(0),
            t: new Array(12).fill(0)
          }
        }
        var docMonth = doc.report_month-1
        dataObj[sortField].n[docMonth] ++
        dataObj[sortField].t[docMonth] += doc[valueKey]
      }
    }
    var lines = Object.keys(dataObj)
    var p = 0
    for (line of lines){
      var lineData = []
      var lastKnownAvg = 0
      for(m=0; m<13; m++){
        if(dataObj[line].n[m] > 0){
          lastKnownAvg = dataObj[line].t[m] / dataObj[line].n[m]
        }
        lineData[m] = lastKnownAvg
      }
      p++
      datasets.push({
            data: lineData,
            label: line,
            fill: false,
            borderColor: "#"+palette[p],
            steppedLine: true
      })
    }
    var data = {
      labels: ref.months,
      datasets
    }
    console.log(data)

    return data
  }
  render(){
    var data = this.processData(DB.Price.find({product: 'Pepper'}).fetch(), 'client_name', 'shelf_price')

    var margin = '0.5em'
    return (
      <div style={{
          position: 'absolute',
          left: margin,
          right: margin,
          top: margin,
          bottom: margin,
          background: 'white',
          borderRadius: '0.3em',
          boxShadow: '0.2em 0.2em 0.2em rgba(0, 0, 0, 0.4)',
          padding: "1em"

        }}>
          <Chart data={data} />
      </div>
    )
  }
}
