import React from 'react'
import {Line} from 'react-chartjs-2';


export default class Chart extends React.Component{
	constructor(props) {
  super()
  this.chart = false // later defined as the chart object
}

 render() {
	 // create empty DIV for google chart to be appended to

	return (
  <Line data={this.props.data}
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
	      text: this.props.title,

	    }
			,
			legend: {
				labels: {
					boxWidth: 1,
					padding: 20
				//	usePointStyle: true
				}
			}
		}
	}/>
	)
 }
}
