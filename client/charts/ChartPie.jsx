import React from 'react'
import {Pie} from 'react-chartjs-2';
import {Doughnut} from 'react-chartjs-2';

export default class Chart extends React.Component {
  constructor(props) {
		super()
		this.PieNut = props.hollow? Doughnut: Pie
    this.chart = false // later defined as the chart object
  }
  formatData(dataObj) {
    // convert dataObj into Chart.js friendly object
    var keys = Object.keys(dataObj) // sorted group names (ie Kamis, etc.)
    var data = []
    var backgroundColor = []
    var p = 0
    for (key of keys) { // loop through groups, to create line for each
      var n = 0
      var t = 0
      var lastKnownValue = 0 // to carry over last known value (if months are missing)
      for (m = 0; m < 12; m++) { // loop through month indexes
        if (dataObj[key].n[m] > 0) { // if any documents were found for this month
          t += dataObj[key].t[m]
          n += dataObj[key].n[m] // calculate average value
        }
      }
      data.push(
        this.props.sum
        ? t
        : t / n)
      backgroundColor.push(
        refColor[key]
        ? refColor[key]
        : palette[p % (palette.length - 1)])
      p++
    }
    return { // return Chart.js friendly object
      labels: keys,
      datasets: [
        {
          backgroundColor,
          data
        }
      ]
    }
  }
  render() {
    return (
      <this.PieNut
        ref="chartObj"
        data={this.formatData(this.props.data)}
        options={{
        ...globalChartOptions,
        ...{
          legend: {
            labels: {
              boxWidth: 5,
              padding: 14
            },
            position: 'right'
          },
          title: {
            display: true,
            text: this.props.title + (this.props.sum? " (sum)": " (mean)")
            //fontColor: "white"
          },
        },
        ...(this.props.options || {})
      }}/>
    )
  }
}
