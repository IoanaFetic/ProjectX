import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import Chart from './Chart_Google.jsx'
export default class ChartWrapper extends TrackerReact(React.Component){


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

    var rows = [
      ['Month']
    ]
    for(i=1; i < 13; i++){
      rows[i] = [ref.months[i-1]]
    };

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

    var sortFields = Object.keys(dataObj)
    for (entry of sortFields){
      var idx = parseInt(rows[0].length)
      rows[0][idx] = entry
      var lastKnownAvg = 0
      for(m=1; m<13; m++){
        if(dataObj[entry].n[m] > 0){
          lastKnownAvg = dataObj[entry].t[m] / dataObj[entry].n[m]
        }
        rows[m][idx] = lastKnownAvg
      }
    }

    console.log(dataObj)
    console.log(rows)
    return rows
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

        }}>
          <Chart data={data} />
      </div>
    )
  }
}
