import React from 'react'
import {Bar} from 'react-chartjs-2';

export default class Chart extends React.Component {
  constructor(props) {
    super()
    this.chart = false // later defined as the chart object
  }
  formatData(dataObj) {
    // convert dataObj into Chart.js friendly object
    var yearData = []
    var datasets = [] // to be entered into Chart.js object
    var keys = Object.keys(dataObj) // sorted group names (ie Kamis, etc.)
    var colors = []
    var p = 0
    for (key of keys) { // loop through groups, to create line for each
      var keyData = [] // data array for this key (for grouped only)
      var year_n = 0 // store number of entries across months
      var year_t = 0 // store sum of entries across months
      for (m = 0; m < 12; m++) { // loop through month indexes
        if (dataObj[key].n[m] > 0) { // if any documents were found for this month
          year_t += dataObj[key].t[m]
          year_n += dataObj[key].n[m] // calculate average value
          keyData[m] = this.props.sum
            ? dataObj[key].t[m]
            : dataObj[key].t[m] / dataObj[key].n[m] // calculate average value
        }
      }
      yearData.push(
        this.props.sum
        ? year_t
        : year_t / year_n)
      var thisColor = refColor[key]
        ? refColor[key]
        : palette[p % (palette.length - 1)]
      colors.push(thisColor)
      datasets.push({
        // add this key to the datasets array
        data: keyData,
        label: key,
        fill: false,
        backgroundColor: thisColor, // line colour
        //  steppedLine: true  step between values
      })
      p++ // increment to next colour
    }
    if (!this.props.group) {
      return { // return Chart.js friendly object
        labels: keys,
        datasets: [
          {
            backgroundColor: colors,
            data: yearData // just one dataset if not grouped (array of keys)
          }
        ]
      }
    } else {
      return { // return Chart.js friendly object
        labels: ref.months,
        datasets
      }
    }
  }
  render() {
    // create empty DIV for google chart to be appended to
    return (<Bar ref="chartObj" data={this.formatData(this.props.data)} options={{
        ...globalChartOptions,
        ...{
          legend: {
            display: false
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var label = data.datasets[tooltipItem.datasetIndex].label || '';

                if (label) {
                  label += ': ';
                }
                label += Math.round(tooltipItem.yLabel * 100) / 100;
                return label;
              }
            }
          },
          title: {
            display: true,
            text: this.props.title
          }
        },
        ...this.props.options || {}
      }}/>)
  }
}
