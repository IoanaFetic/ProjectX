import React from 'react'
import {Line} from 'react-chartjs-2';


export default class Chart extends React.Component {
  constructor(props) {
    super()
  }

  formatData(dataObj) {
    // convert dataObj into Chart.js friendly object
    var datasets = [] // to be entered into Chart.js object
    var lines = Object.keys(dataObj) // sorted group names (ie Kamis, etc.)
    var p = 0 // to increment colours
    for (line of lines) { // loop through groups, to create line for each
      var lineData = [] // data array for this line
      var lastKnownValue = 0 // to carry over last known value (if months are missing)
      for (m = dataObj[line].firstMonth; m <= dataObj[line].lastMonth; m++) { // loop through month indexes
        if (dataObj[line].n[m] > 0) { // if any documents were found for this month
          lastKnownValue = this.props.sum
            ? dataObj[line].t[m]
            : dataObj[line].t[m] / dataObj[line].n[m] // calculate average value
        }
        lineData[m] = lastKnownValue // assign data point the last known avg value
      }

      datasets.push({
        // add this line to the datasets array
        data: lineData,
        label: line,
        fill: false,
        borderColor: refColor[line]
          ? refColor[line]
          : palette[p % (palette.length - 1)], // line colour
        //  steppedLine: true  step between values
      })
      p++ // increment to next colour
    }
    return { // return Chart.js friendly object
      labels: ref.months,
      datasets
    }
  }


  render() {
    // create empty DIV for google chart to be appended to
    var yLabel = ""
    if(this.props.dbName == "Price"){
      yLabel = "Product Price (RON)"
    }
    if(this.props.dbName == "Shelf"){
      yLabel = "Number of Faces"
    }
    return (
        <Line
          ref="chartObj"
          data={this.formatData(this.props.data)}
          options={{
          ...globalChartOptions,
          ...{
            legend: {
              labels: {
                boxWidth: 2,
                padding: 20
              },
              position: 'right'
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: yLabel
                }
              }]
            },
            title: {
              display: true,
              fontSize: 14,
              text: this.props.title + (this.props.sum? " (sum)": " (mean)")
            },
        },
        ...this.props.options || {}
      }}/>
  )
  }
}
