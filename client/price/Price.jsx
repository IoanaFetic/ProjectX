import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartWrapper from '../components/ChartWrapper.jsx'
import { PropagateLoader } from 'react-spinners';

export default class Price extends TrackerReact(React.Component){
	constructor(props) {
	  super()
		Session.set('priceSubscribed', false)
		this.state={
			priceSubscription: Meteor.subscribe('data', 'Price', function(){
				Session.set('priceSubscribed', true)
		})
	}
}
componentWillUnmount(){
	this.state.priceSubscription.stop()
}
resubscribe(){
	this.state.priceSubscription.stop()
	this.setState({
		priceSubscription: Meteor.subscribe('data', 'Price')
	})
}
 render() {
	 if (Session.get('priceSubscribed') && Session.get('globalSubscribed')){
		var settings = DB.Global.findOne({id: "defaultChartSettings"}).value
		var style = Style.dashStyle

			return (
				<div style={{
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
						width: '100%'
					}}>
						<div style={style.upperContainer} className="chartCell">
							<ChartWrapper
								title='Monthly product price evolution'
								tip='A fully customisable line chart based on historic monthly price data'
                dbName='Price'
                id='price_main'
								chart='line'
								edit={true}
                settings={settings}
              	showTotal={true}
								resubscribe={this.resubscribe.bind(this)}
							/>
						</div>

						<div style={style.lowerContainer} className="forceColumn">
							<div style={style.column}>
								<div style={style.cell} className="chartCell">
									<ChartWrapper
										title='Average Pepper Prices'
										tip='A fixed line chart showing the monthly evolution of pepper average price across brands'
										dbName='Price'
										id='price_avg_pepper'
										chart='line'
										settings={settings}
										resubscribe={this.resubscribe.bind(this)}
								/>
								</div>
								<div style={style.cell} className="chartCell">
									<ChartWrapper
										title='Average Herbs Prices'
										tip='A fixed line chart showing the monthly evolution of herbs average price across brand'
										dbName='Price'
										id='price_avg_herbs'
										chart='line'
										settings={settings}
									resubscribe={this.resubscribe.bind(this)}
								/>
								</div>
							</div>
							<div style={style.column}>
								<div style={style.cell} className="chartCell">
									<ChartWrapper
										title='Monthly Product Price Comparison'
										tip="A fully customisable bar chart showing any product price comparison for a specific month"
										dbName='Price'
										id='price_product_bar_chart'
										chart='bar'
										edit={true}
										settings={settings}
									resubscribe={this.resubscribe.bind(this)}
								/>
								</div>
								<div style={style.cell} className="chartCell">
									<ChartWrapper
										title='Average Grinders Prices'
										tip='A fixed line chart showing the monthly evolution of the average price for grinders across brands'
										dbName='Price'
										id='price_avg_grinders'
										chart='line'
										settings={settings}
										resubscribe={this.resubscribe.bind(this)}
										/>
								</div>

							</div>
							</div>



				</div>
			)
	 }
	 else{
		 return <PropagateLoader color="white"/>
	 }
 }
}
//<Chart data={data}/>

/*
content={
		<div>
			'Line chart of the prices, over 12 months, each line showing Kamis and its competitors, should be fully customisable (e.g. which product to show, or average of category of products, which store etc). Potentially have a toggle button between Premium brands and Mainstream brands, and then a full set of settings.'
		</div>
	}

<ChartWrapper content={
		<div>
			'Line Chart of Pepper evolution on Premium brands historically. Potentially choose between type of pepper (whole, grinded, white etc) and pepper average'
		</div>
	}/>
<ChartWrapper content={
		<div>
			'Line Chart of Herbs evolution on Premium brands historically. Potentially choose between type of herbs and herbs average'
		</div>
	}/>
<ChartWrapper content={
		<div>
			'Line Chart of grinder evolution on Premium brands historically. Potentially choose between type of grinder and grinder average'
		</div>
	}/>
<ChartWrapper content={
		<div>
			'Line Chart of Herbs evolution on Mainstream brands historically. Potentially choose between type of Herbs and Herbs average'
		</div>
	}/>
<ChartWrapper content={
		<div>
			'Line Chart of Grinder evolution on Mainstream brands historically. Potentially choose between type of Grinder (whole, grinded, white etc) and Grinder average'
		</div>
	}/>


<div style={style.cell}>
		<ChartWrapper
			title='Mainstream Brands - Herbs Prices'
			dbName='Price'
			sort='brand'
			filter={{
				product: 'General',
				brand: {$in: [
					'Galeo',
					'Cosmin'
				]}
			}}/>
		</div>


	*/




/*

	*/
