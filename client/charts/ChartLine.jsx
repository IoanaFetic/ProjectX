import React from 'react'
import {Line} from 'react-chartjs-2';



export default class Chart extends React.Component {
  constructor(props) {
    super()
  }

  formatData(dataObj) {
    // convert dataObj into Chart.js friendly object
    var datasets = [] // to be entered into Chart.js object
    var keys = Object.keys(dataObj) // sorted group names (ie Kamis, etc.)
    var p = 0 // to increment colours
    for (key of keys) { // loop through groups, to create key for each
      var keyData = [] // data array for this key
      var lastKnownValue = 0 // to carry over last known value (if months are missing)
      for (m = dataObj[key].firstMonth; m <= dataObj[key].lastMonth; m++) { // loop through month indexes
        if (dataObj[key].n[m] > 0) { // if any documents were found for this month
          lastKnownValue = this.props.sum
            ? dataObj[key].t[m]
            : dataObj[key].t[m] / dataObj[key].n[m] // calculate average value
        }
        keyData[m] = lastKnownValue // assign data point the last known avg value
      }

      datasets.push({
        // add this key to the datasets array
        data: keyData,
        label: key,
        fill: false,
        borderColor: refColor[key]
          ? refColor[key]
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
      <div style={{position: "relative", height: "100%", width: "100%"}}>
        <Line
          ref="chartObj"
          data={this.formatData(this.props.data)}
          options={{
          ...globalChartOptions,
          ...{
            legend: {
              labels: {
                boxWidth: 2,
                padding: 14,
              },
              position: device < 2? 'right': 'top'
            },
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: yLabel
                }
              }]
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
              text: this.props.title + (this.props.sum? " (sum)": " (mean)")
            },
        },
        ...this.props.options || {}
      }}/></div>

  )
  }
}
