import React from 'react'

export default class ChartPanel extends React.Component{


  getAvg(){
    for(i=0; i < 12; i++){
      months[i] = {
        sum: 0,
        n: 0
      }
      rows[i+1] = [i+1]
    };
  }

  processData(data, keys){


    var rows = [
      ['Month', 'Index'],
    ]

    for(i=1; i < 13; i++){
      rows[i] = [ref.months[i-1], i]
    };


    var months = []
    for (doc of data){
      if (doc.shelf_price){
        months[doc.report_month].sum += doc.shelf_price
        months[doc.report_month].n ++
      }
    }
    for(m=0; m < 12; m++){
      rows[m+1].push(months[m].sum/months[m].n)
    }

    return rows
  }
  render(){
  //  var data = this.processData(DB.Price.find().fetch())

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
          boxShadow: '0.2em 0.2em 0.2em rgba(0, 0, 0, 0.4)'
        }}>
      {this.props.content}

      </div>
    )
  }
}
