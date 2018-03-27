import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartPanel from '../components/ChartPanel.jsx'
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
  render() {
    if (Session.get('shelfSubscribed')) {

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
              edit={true}
              chart="line"
              title='Monthly Shelf Faces Evolution'
              tip='A fully customisable line chart based on historic monthly shelf faces data'
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
                sort: 'brand',
                sum: true
              }}
              showTotal={true}/>

        </div>
        <div style={style.lowerContainer} className="forceColumn">
          <div style={style.column}>
            <div style={style.cell} className="chartCell">
              <ChartPanel
                title="Monthly Total Shelf Faces"
                tip='A fully customisable pie chart showing the total normal shelf faces accross brands for a specific month'
                chart="pie"
                edit={true}
                dbName='Shelf'
                id='pie_shelf'
                settings={{
                  filter: {
                    value_type: [
                      'shelf'
                    ],
                    report_month: [
                      'August'
                    ]
                  },
                  sort: 'brand',
                  sum: true
                }}/>
            </div>
            <div style={style.cell} className="chartCell">
              <ChartPanel
                title="Monthly Total Extra Shelf Faces"
                tip='A fully customisable pie chart showing the total extra shelf faces accross brands for a specific month'
                chart="pie"
                edit={true}
                dbName='Shelf'
                id='pie_extra'
                settings={{
                  filter: {
                    value_type: [
                      'extra'
                    ],
                    report_month: [
                      'August'
                    ]
                  },
                  sort: 'brand',
                  sum: true
                }}/>
            </div>
          </div>
          <div style={style.column}>
            <div style={style.cell} className="chartCell">
              <ChartPanel
                title="Grouped Bar Chart"
                tip="A fixed grouped bar chart showing the evolution of Kamis + Galeo total shelf faces compared to Kamis + Galeo total extra shelf faces"
                edit={true}
                chart="bar"
                dbName='Shelf'
                id='grouped_bar'
                settings={{
                  filter: {
                    brand: [
                      'Kamis',
                      'Galeo'
                    ],
                    report_month: [
                      'August'
                    ]
                  },
                  sort: 'brand',
                  sum: true
                }}/>
            </div>
            <div style={style.cell} className="chartCell">
              <ChartPanel
                title='Monthly Total Shelf Faces Across Merchandisers'
                tip='A customisable donut chart showing the total shelf faces for each Merchandiser for a specific month'
                edit={true}
                chart='donut'
                dbName='Shelf'
                id='donut_chart'
                settings={{
                  filter: {
                    report_month: [
                      'August'
                    ]
                  },
                  sort: 'merchandiser',
                  sum: true
                }}
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
    <ChartPanel content={'Lower Column 3 cell 1'
    }/>
  </div>
  <div style={style.cell}>
    <ChartPanel content={'Lower Column 3 cell 2'
    }/>
  </div>
</div>

*/
