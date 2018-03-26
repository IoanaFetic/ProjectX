import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartPanel from '../components/ChartPanel.jsx'
import {PropagateLoader} from 'react-spinners';

export default class Shelf extends TrackerReact(React.Component) {
  constructor(props) {
    super()
    Session.set('priceSubscribed', false)
    this.state = {
      shelfSubscription: Meteor.subscribe('shelf', function() {
        Session.set('priceSubscribed', true)
      })
    }
  }
  componentWillUnmount() {
    this.state.shelfSubscription.stop()
  }
  render() {
    if (Session.get('priceSubscribed')) {
      var data = DB.Price.find().fetch()

      var style = {
        cell: {
          display: 'flex',
          flexGrow: 1,
          position: 'relative',
          flexShrink: 0
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

      return (<div style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: '100%',
          height: '100%'
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
              flexGrow: 1,
              position: 'relative'
            }}>
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

        </div>
        <div style={style.lowerContainer} className="forceColumn">
          <div style={style.lowerColumn}>
            <div style={style.cell}>
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
            <div style={style.cell}>
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
          <div style={style.lowerColumn}>
            <div style={style.cell}>
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
            <div style={style.cell}>
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
<div style={style.lowerColumn}>
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
