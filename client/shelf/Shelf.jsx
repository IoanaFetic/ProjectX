import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartWrapper from '../components/ChartWrapper.jsx'
import { PropagateLoader } from 'react-spinners';

export default class Shelf extends TrackerReact(React.Component) {
  constructor(props) {
    super()
    Session.set('shelfSubscribed', false)
    this.state = {
      shelfSubscription: Meteor.subscribe('shelf', function() {
        Session.set('shelfSubscribed', true)
      })
    }
  }
  componentWillUnmount() {
    this.state.shelfSubscription.stop()
  }
  resubscribe(){
  	this.state.priceSubscription.stop()
  	this.setState({
  		priceSubscription: Meteor.subscribe('data', 'Price')
  	})
  }
  render() {
    if (Session.get('shelfSubscribed')) {
      var settings = DB.Global.findOne({id: "defaultChartSettings"}).value
      var style = Style.dashStyle

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: '100%'
        }}>
        <div style={style.upperContainer}>
            <ChartWrapper
              edit={true}
              chart="line"
              title='Monthly Shelf Faces Evolution'
              tip='A fully customisable line chart based on historic monthly shelf faces data'
              dbName='Shelf'
              id='shelf_main'
              settings={settings}
              resubscribe={this.resubscribe.bind(this)}
              />

        </div>
        <div style={style.lowerContainer} className="forceColumn">
          <div style={style.column}>
            <div style={style.cell} className="chartCell">
              <ChartWrapper
                title="Monthly Total Shelf Faces"
                tip='A fully customisable pie chart showing the total normal shelf faces accross brands for a specific month'
                chart="pie"
                edit={true}
                dbName='Shelf'
                id='pie_shelf'
                settings={settings}
                resubscribe={this.resubscribe.bind(this)}
              />
            </div>
            <div style={style.cell} className="chartCell">
              <ChartWrapper
                title="Monthly Total Extra Shelf Faces"
                tip='A fully customisable pie chart showing the total extra shelf faces accross brands for a specific month'
                chart="pie"
                edit={true}
                dbName='Shelf'
                id='pie_extra'
                settings={settings}
                resubscribe={this.resubscribe.bind(this)}
              />
            </div>
          </div>
          <div style={style.column}>
            <div style={style.cell} className="chartCell">
              <ChartWrapper
                title="Grouped Bar Chart"
                tip="A fixed grouped bar chart showing the evolution of Kamis + Galeo total shelf faces compared to Kamis + Galeo total extra shelf faces"
                edit={true}
                chart="groupbar"
                dbName='Shelf'
                id='grouped_bar'
                settings={settings}
                resubscribe={this.resubscribe.bind(this)}
              />
            </div>
            <div style={style.cell} className="chartCell">
              <ChartWrapper
                title='Monthly Total Shelf Faces Across Merchandisers'
                tip='A customisable donut chart showing the total shelf faces for each Merchandiser for a specific month'
                edit={true}
                chart='donut'
                dbName='Shelf'
                id='donut_chart'
                settings={settings}
                resubscribe={this.resubscribe.bind(this)}
              />
            </div>
          </div>

        </div>

      </div>)

    } else {
      return <PropagateLoader color="white"/>
    }
  }
}

/*
<div style={style.column}>
  <div style={style.cell}>
    <ChartWrapper content={'Lower Column 3 cell 1'
    }/>
  </div>
  <div style={style.cell}>
    <ChartWrapper content={'Lower Column 3 cell 2'
    }/>
  </div>
</div>

*/
