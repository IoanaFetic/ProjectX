import React from 'react'

export default class Chart extends React.Component{
	constructor(props) {
  super()
  this.chart = false // later defined as the chart object
}

buildChart(data){
	console.log(data)
  var table = new google.visualization.DataTable()
  table.addColumn('number', 'Month')
  table.addColumn('number', 'Price')

	var months = []
	for(i=0; i<12; i++){
		months[i] = {
			sum: 0,
			n: 0
		}
	}

	for (doc of data){
		if (doc.shelf_price){
			months[doc.report_month].sum += doc.shelf_price
			months[doc.report_month].n ++
		}
	}
	console.log(months)
	var rows = []
	for (m in months){
		if(months[m].n>0){
			rows.push([parseInt(m), months[m].sum/months[m].n])
		}
		else{
			rows.push([parseInt(m), null])
		}
	}
  table.addRows(rows)
  var options = google.charts.Line.convertOptions(
		{
	    chart: {
	      title: 'Prices (under construction)',
	      subtitle: 'Subtitle',

	    },
	    width: 600,
	    height: 500,
			vAxis: {
				viewWindow: {
					min: 0,
					max: 10
				},
			}

	  }
	)
  return {
    table,
    options
  }
}

GCInit(){
  google.charts.load('current', {'packages':['line']});
  google.charts.setOnLoadCallback(function(){
    var build = this.buildChart(this.props.data) // Chart data and options object
    this.chart = new google.charts.Line(document.getElementById('chart1'));
    this.chart.draw(build.table, build.options);
  }.bind(this))
}
GCUpdate(nextProps){
	var build = this.buildChart(nextProps.data)
	this.chart.draw(build.table, build.options)
}
componentDidMount(){
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');  // optional
  script.setAttribute('src', 'https://www.gstatic.com/charts/loader.js');
  script.onload = () => {
    this.GCInit()
  }
  document.getElementsByTagName('head')[0].appendChild(script);
}
shouldComponentUpdate(nextProps, nextState){
	this.GCUpdate(nextProps)
	return false
}
 render() {
	 console.log("Chart rendered!")
	return (
    <div id="chart1" style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "flex-start",
				margin: "1em"
    }}>
    </div>
	)
 }
}
