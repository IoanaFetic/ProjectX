import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import Chart from './Chart.jsx'

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
			var data=DB.Price.find().fetch()

			return(
			<Chart data={data}/>
		)
	 }
	 else{
		 return(<div>loading wait</div>)
	 }
 }
}
