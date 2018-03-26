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
      for (m = 0; m < 12; m++) { // loop through month indexes
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

    return (
        <Line
          ref="chartObj"
          data={this.formatData(this.props.data)}
          options={{
        ...{
          elements: {
            line: {
              tension: 0
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          bezierCurve: false,
          title: {
            display: true,
            fontSize: 14,
            text: this.props.title
          },
          legend: {
            labels: {
              boxWidth: 1,
              padding: 20
            },
            position: 'right'
          }
        },
        ...this.props.options || {}
      }}/>
  )
  }
}
