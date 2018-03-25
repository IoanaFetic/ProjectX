import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import Chart from '../components/Chart.jsx'
import ChartPanel from '../components/ChartPanel.jsx'
import { PropagateLoader } from 'react-spinners';

export default class Shelf extends TrackerReact(React.Component){
  constructor(props){
    super()
    Session.set('priceSubscribed', false)
    this.state={
      shelfSubscription:
      Meteor.subscribe('shelf', function(){
        console.log('subscription complete')
        Session.set('priceSubscribed', true)
      })
  }
}
componentWillUnmount(){
	this.state.shelfSubscription.stop()
}
render() {
  if (Session.get('priceSubscribed')){
    var data=DB.Price.find().fetch()

    var style = {
			cell: {
				display: 'flex',
				flexGrow: 1,
				position: 'relative'
			},
      lowerColumn: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
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
          <div style={{ //upperContainer
            display: 'flex',
            flexGrow: 1,
            flexBasis: 1,
            position: 'relative'
            }}>
            <div style={{ //upperColumn
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 2,
                position: 'relative'
              }}>
              <ChartPanel
                title='Premium Brands - Main Shelf Chart'
                dbName='Shelf'
                id='shelf_main'
                settings={{
                  filter: {
                    brand: [
                      'Kamis',
                      'Fuchs',
                      'Kotanyi'
                    ]
                  },
                  sort: 'brand'
                }}
              showTotal={true}/>
            </div>
            <div style={{ //upperColumn
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                position: 'relative'
              }}>
              <ChartPanel dbName='Shelf' id='test' settings={{
                  filter: {},
                  sort: ''
              }}/>
            </div>
          </div>
          <div style={style.lowerContainer}>
            <div style={style.lowerColumn}>
              <div style={style.cell}>
                <ChartPanel content={
                    ''
                  }/>
              </div>
              <div style={style.cell}>
                <ChartPanel content={
                    'Lower Column 1 cell 2'
                  }/>
              </div>
            </div>
            <div style={style.lowerColumn}>
              <div style={style.cell}>
                <ChartPanel content={
                    'Lower Column 2 cell 1'
                  }/>
              </div>
              <div style={style.cell}>
                <ChartPanel content={
                    'Lower Column 2 cell 2'
                  }/>
              </div>
            </div>
            <div style={style.lowerColumn}>
              <div style={style.cell}>
                <ChartPanel content={
                    'Lower Column 3 cell 1'
                  }/>
              </div>
              <div style={style.cell}>
                <ChartPanel content={
                    'Lower Column 3 cell 2'
                  }/>
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
