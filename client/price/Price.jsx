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
				console.log('subsciption complete')
				Session.set('priceSubscribed', true)
		})
	}
}

 render() {
	 if (Session.get('priceSubscribed')){

		var style = {
			cell: {
				display: 'flex',
				flexGrow: 1,
				position: 'relative'
			},
			column: {
				display: 'flex',
				flexDirection: 'column',
				flexGrow: 1
			},
			upperContainer: {
				display: 'flex',
				flexGrow: 1,
				flexBasis: 1,
				position: 'relative'
			},
			lowerContainer: {
				display: 'flex',
				flexGrow: 1.5,
				flexBasis: 1,
				position: 'relative'
			}
		}

			return (
				<div style={{
						display: 'flex',
						flexDirection: 'column',
						flexGrow: 1,
						width: '100%',
						height: '100%',
					}}>
						<div style={style.upperContainer}>
							<ChartPanel
								title='Main Price Chart'
								dbName='Price'
								sort='brand'
								filter={{product: 'Pepper'}}
								showTotal={true}
							/>
						</div>
						<div style={style.lowerContainer}>
							<div style={style.column}>
								<div style={style.cell}>
									<ChartPanel
										title='Premium Brands - Pepper Prices'
										dbName='Price'
										sort='brand'
										filter={{
											product: {$in: [
												'Pepper',
												'White Pepper'
											]},
											brand: {$in: [
												'Kamis',
												'Fuchs',
												'Kotanyi'
											]}
										}}/>
								</div>
								<div style={style.cell}>
									<ChartPanel
										title='Premium Brands - Grinders Prices'
										dbName='Price'
										sort='brand'
										filter={{
											package_type: 'Grinders',
											brand: {$in: [
												'Kamis',
												'Fuchs',
												'Kotanyi'
											]}
										}}/>
								</div>
								<div style={style.cell}>
									<ChartPanel
										title='Premium Brands - Herbs Prices'
										dbName='Price'
										sort='brand'
										filter={{
											product: 'General',
											brand: {$in: [
												'Kamis',
												'Fuchs',
												'Kotanyi'
											]}
										}}/>
								</div>
							</div>
							<div style={style.column}>
								<div style={style.cell}>
									<ChartPanel
										title='Mainstream Brands - Pepper Prices'
										dbName='Price'
										sort='brand'
										filter={{
											product: {$in: [
												'Pepper',
												'White Pepper'
											]},
											brand: {$in: [
												'Galeo',
												'Cosmin'
											]}
										}}/>
								</div>
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
	*/
