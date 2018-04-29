import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import ChartWrapper from '../components/ChartWrapper.jsx'
import {PropagateLoader} from 'react-spinners';

export default class Shelf extends TrackerReact(React.Component) {
  constructor(props) {
    super()
    Session.set('shelfSubscribed', false)
    this.state = {
      shelfSubscription: Meteor.subscribe('data', 'Shelf', function() {
        Session.set('shelfSubscribed', true)
      }),
      userSubscription: Meteor.subscribe('user')
    }
  }
  componentWillUnmount() {
    this.state.shelfSubscription.stop()
  }
  resubscribe() {
    this.state.shelfSubscription.stop()
    this.setState({
      shelfSubscription: Meteor.subscribe('data', 'Shelf')
    })
  }
  render() {
    if (Session.get('shelfSubscribed') && Session.get('globalSubscribed') && !Session.get('reload')) {
      var settings = DB.Global.findOne({id: "defaultChartSettings"}).value
      var style = Style.dashStyle
      return (<div style={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          width: '100%'
        }}>
        <div style={style.upperContainer}>
          <ChartWrapper edit={true} chart="line" title={rom
              ? 'Evoluția Lunară a Numărului de Fețe'
              : 'Monthly Shelf Faces Evolution'} tip={rom
              ? 'Un grafic tip linie ce poate fi schimbat și arată evoluția lunară a numărului de fețe'
              : 'A fully customisable line chart based on historic monthly shelf faces data'} dbName='Shelf' id='shelf_main' settings={settings} resubscribe={this.resubscribe.bind(this)}/>

        </div>
        <div style={style.lowerContainer} className="forceColumn">
          <div style={style.column}>
            <div style={style.cell} className="chartCell">
              <ChartWrapper title={rom
                  ? 'Numărul Total de Fețe la Raft pe Lună'
                  : "Monthly Total Shelf Faces"} tip={rom
                  ? 'Un grafic circular ce poate fi schimbat și arată numărul de fețe la raft pe lună'
                  : 'A fully customisable pie chart showing the total normal shelf faces accross brands for a specific month'} chart="pie" edit={true} dbName='Shelf' id='shelf_pie_chart' settings={settings} resubscribe={this.resubscribe.bind(this)}/>
            </div>
            <div style={style.cell} className="chartCell">
              <ChartWrapper title={rom
                  ? 'Numărul Total de Fețe în Plasări Secundare pe Lună'
                  : "Monthly Total Extra Shelf Faces"} tip={rom
                  ? 'Un grafic circular ce poate fi schimbat și arată numărului de fețe în plasări secundare pe lună'
                  : 'A fully customisable pie chart showing the total extra shelf faces accross brands for a specific month'} chart="pie" edit={true} dbName='Shelf' id='shelf_pie_chart_extra' settings={settings} resubscribe={this.resubscribe.bind(this)}/>
            </div>
          </div>
          <div style={style.column}>
            <div style={style.cell} className="chartCell">
              <ChartWrapper title={rom
                  ? 'Grafic Tip Bară Grupat'
                  : "Grouped Bar Chart"} tip={rom
                  ? "Un grafic tip bară grupat ce arată comparația lunară a numărului de fețe între Kamis și Galeo"
                  : "A fixed grouped bar chart showing the evolution of Kamis total shelf faces compared to Galeo total shelf faces"} edit={true} chart="groupbar" dbName='Shelf' id='shelf_grouped_bar' settings={settings} resubscribe={this.resubscribe.bind(this)}/>
            </div>
            <div style={style.cell} className="chartCell">
              <ChartWrapper title={rom
                  ? 'Numărul Total de Fețe pentru Fiecare Merchandiser'
                  : 'Monthly Total Shelf Faces Across Merchandisers'} tip={rom
                  ? 'Un grafic circular ce arată numărul total de fețe pentru fiecare merchandiser'
                  : 'A customisable donut chart showing the total shelf faces for each Merchandiser for a specific month'} edit={true} chart='donut' dbName='Shelf' id='shelf_donut_chart' settings={settings} resubscribe={this.resubscribe.bind(this)}/>
            </div>
          </div>
        </div>
      </div>)
    } else {
      return <PropagateLoader color="white"/>
    }
  }
}
