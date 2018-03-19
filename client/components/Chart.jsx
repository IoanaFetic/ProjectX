import React from 'react'

export default class Chart extends React.Component{
	constructor(props) {
  super()
  this.chart = false // later defined as the chart object
}

buildChart(data){
	// using the Google Charts API
  var table = new google.visualization.DataTable()
  table.addColumn('number', 'Month')
  table.addColumn('number', 'Price')
	var months = []
	for(i=0; i < 12; i++){
		months[i] = {
			sum: 0,
			n: 0
		}
	};
	for (doc of data){
		if (doc.shelf_price){
			months[doc.report_month].sum += doc.shelf_price
			months[doc.report_month].n ++
		}
	}
	console.log(months);
	var rows = [];
	for(m in months){
		if(months[m].n>0){
			rows.push([parseInt(m), months[m].sum/months[m].n])
		}
		else{
			rows.push([parseInt(m), null])
		}
	}
  table.addRows(rows)
	// define chart options
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
	// from Google Charts API
  google.charts.load('current', {'packages':['line']});
  google.charts.setOnLoadCallback(function(){
    var build = this.buildChart(this.props.data) // format data and create options object
    this.chart = new google.charts.Line(document.getElementById('chart1'));
    this.chart.draw(build.table, build.options); // render to DIV id chart1
  }.bind(this))
}
GCUpdate(nextProps){
	// when component is updated with new data, rebuild the chart
	// (initialisation methods no longer needed)
	var build = this.buildChart(nextProps.data)
	// re-render chart with new build
	this.chart.draw(build.table, build.options)
}
componentDidMount(){
	// component initially mounted, so load the Google charts CDN
	// adapted to work with React, as header tag can't be accessed conventionally
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');  // optional
  script.setAttribute('src', 'https://www.gstatic.com/charts/loader.js');
	// once CDN is loaded, initiate Google Charts methods
  script.onload = () => {
    this.GCInit()
  }
	// add CDN call to document <head>
  document.getElementsByTagName('head')[0].appendChild(script);
}
shouldComponentUpdate(nextProps, nextState){
	// change of props/state detected
	// re-render google charts using new data from props
	this.GCUpdate(nextProps)
	// override React behaviour, not allowing re-render which would stop google charts working properly
	return false
}
 render() {
	 // create empty DIV for google chart to be appended to
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
