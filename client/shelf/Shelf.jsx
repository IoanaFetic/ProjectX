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
                    'Kotanyi']
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
                title="Pie Demo"
                chart="pie"
                edit={true}
                dbName='Shelf'
                id='pie_shelf_1'
                settings={{
                  filter: {},
                  sort: 'brand',
                  sum: true
                }}/>
            </div>
            <div style={style.cell}>
              <ChartPanel
                title="Pie Demo"
                chart="donut"
                edit={true}
                dbName='Shelf'
                id='bar'
                settings={{
                  filter: {},
                  sort: '',
                  sum: true
                }}/>
            </div>
          </div>
          <div style={style.lowerColumn}>
            <div style={style.cell}>
              <ChartPanel
                title="Bar Demo"
                edit={true}
                chart="bar"
                dbName='Shelf'
                id='test'
                settings={{
                  filter: {},
                  sort: '',
                  sum: true
                }}/>
            </div>
            <div style={style.cell}>
              <ChartPanel content={'Lower Column 2 cell 2'
}/>
            </div>
          </div>
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
        </div>

      </div>)

    } else {
      return <PropagateLoader color="white"/>
    }
  }
}
