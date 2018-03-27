import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartPanel from '../components/ChartPanel.jsx'
import { PropagateLoader } from 'react-spinners';

export default class Price extends TrackerReact(React.Component){
	constructor(props) {
	  super()
		Session.set('priceSubscribed', false)
		this.state={
			priceSubscription: Meteor.subscribe('price',function(){
				Session.set('priceSubscribed', true)
		})
	}
}
componentWillUnmount(){
	this.state.priceSubscription.stop()
}
 render() {
	 if (Session.get('priceSubscribed')){

		var style = Style.dashStyle

			return (
				<div style={{
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
						width: '100%'
					}}>
						<div style={style.upperContainer}>
							<ChartPanel
								title='Monthly product price evolution'
								tip='A fully customisable line chart based on historic monthly price data'
                dbName='Price'
                id='price_main'
								chart='line'
								edit={true}
                settings={{
                  filter: {
                    product: ['Pepper']
                  },
                  sort: 'brand'
                }}
              showTotal={true}
							/>
						</div>
						<div style={style.lowerContainer} className="forceColumn">
							<div style={style.column}>
								<div style={style.cell} className="chartCell">
									<ChartPanel
										title='Average Pepper Prices'
										tip='A fixed line chart showing the monthly evolution of pepper average price across brands'
										dbName='Price'
										id='avg_pepper_price'
										chart='line'
										settings={{
											filter: {
												product: [
													'Pepper',
													'White Pepper'
												],
												brand: [
													'Kamis',
													'Fuchs',
													'Kotanyi',
													'Galeo',
													'Cosmin'
												]
											},
											sort: 'brand'
										}}/>
								</div>
								<div style={style.cell} className="chartCell">
									<ChartPanel
										title='Average Herbs Prices'
										tip='A fixed line chart showing the monthly evolution of herbs average price across brand'
										dbName='Price'
										id='avg_herbs_price'
										chart='line'
										settings={{
											filter:{
												product: ['General'],
												brand: [
													'Kamis',
													'Fuchs',
													'Kotanyi',
													'Galeo',
													'Cosmin'
												]
											},
											sort: 'brand'
										}}/>
								</div>
							</div>
							<div style={style.column}>
								<div style={style.cell} className="chartCell">
									<ChartPanel
										title='Monthly Product Price Comparison'
										tip="A fully customisable bar chart showing any product price comparison for a specific month"
										dbName='Price'
										id='bar_chart'
										chart='bar'
										edit={true}
										settings={{
											filter:{
												product: [
													'Pepper',
													'White Pepper'
												],
												report_month:
												[
													'March'
												]
											},
											sort: 'brand'
										}}/>
								</div>
								<div style={style.cell} className="chartCell">
									<ChartPanel
										title='Average Grinders Prices'
										tip='A fixed line chart showing the monthly evolution of the average price for grinders across brands'
										dbName='Price'
										id='avg_grinders_price'
										chart='line'
										settings={{
											filter:{
												brand: [
													'Kamis',
													'Fuchs',
													'Kotanyi'
												],
												package_type: ['Grinders']
											},
											sort: 'brand'
										}}
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

<ChartPanel content={
		<div>
			'Line Chart of Pepper evolution on Premium brands historically. Potentially choose between type of pepper (whole, grinded, white etc) and pepper average'
		</div>
	}/>
<ChartPanel content={
		<div>
			'Line Chart of Herbs evolution on Premium brands historically. Potentially choose between type of herbs and herbs average'
		</div>
	}/>
<ChartPanel content={
		<div>
			'Line Chart of grinder evolution on Premium brands historically. Potentially choose between type of grinder and grinder average'
		</div>
	}/>
<ChartPanel content={
		<div>
			'Line Chart of Herbs evolution on Mainstream brands historically. Potentially choose between type of Herbs and Herbs average'
		</div>
	}/>
<ChartPanel content={
		<div>
			'Line Chart of Grinder evolution on Mainstream brands historically. Potentially choose between type of Grinder (whole, grinded, white etc) and Grinder average'
		</div>
	}/>


<div style={style.cell}>
		<ChartPanel
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
