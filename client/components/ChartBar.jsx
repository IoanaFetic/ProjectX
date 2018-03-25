import React from 'react'
import {Bar} from 'react-chartjs-2';


export default class Chart extends React.Component{
	constructor(props) {
  super()
  this.chart = false // later defined as the chart object
}

formatData(dataObj){
	// convert dataObj into Chart.js friendly object
	var datasets = [] // to be entered into Chart.js object
	var bars = Object.keys(dataObj) // sorted group names (ie Kamis, etc.)
	var data = []
	var backgroundColor = []
	var p = 0
	for (bar of bars) { // loop through groups, to create line for each
		var n = 0
		var t = 0
		var lastKnownValue = 0 // to carry over last known value (if months are missing)
		for (m = 0; m < 12; m++) { // loop through month indexes
			if (dataObj[bar].n[m] > 0) { // if any documents were found for this month
					t += dataObj[bar].t[m]
					n += dataObj[bar].n[m] // calculate average value
			}
		}
		console.log(bar, " average: ", t/n)
		data.push(this.props.sum? t: t/n)
		backgroundColor.push(palette[p % (palette.length-1)])
		p++
	}

	return { // return Chart.js friendly object
		labels: bars,
		datasets: [
			{
				backgroundColor,
				data
			}
		]
	}
}

 render() {
	 // create empty DIV for google chart to be appended to

	return (
  <Bar data={this.formatData(this.props.data)}
	 options={
		 {
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
	      text: this.props.title,
	    	}
				,
				legend: {
					display: false
				}
			}
	}/>
	)
 }
}
