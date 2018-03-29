// this file is heavily commented to explain the basic structure of Meteor.js with React.js

// import basic packages
import React from 'react'
import AccountsUI from './AccountsUI.jsx'
import TrackerReact from 'meteor/ultimatejs:tracker-react'

device = screen.width < 850? 2: (screen.width < 1000? 1: 0)
iconSize = device < 2? 20: 40
// initiate client side copy of MongoDB (miniMongo)
// Meteor handles synchronisation between this copy and the server master copy
// subscribing to the server database determines which documents to send to the client
DB = {
  Price: new Mongo.Collection ('price'),
  Shelf: new Mongo.Collection ('shelf'),
  Global: new Mongo.Collection ('global')
}

// export default - to be assigned by default when imported
// eg. import ComponentName from './file.jsx'
// class ComponentName extends React.Component -
// define ComponentName as a new React.js Component
export default class MainLayout extends TrackerReact(React.Component) {
  // a simple React.js component only needs render() method to be declared
  // other predefined methods are included here for explanation

  // MOUNTING METHODS
  constructor(props){
    // constructor(){} runs once before the component is first constructed
    // fundamental properties of any component are "state" and "props"
    // referenced with this.props and this.state once constructed
    // props are inherited from the parent
    // state describes components own state, defined by component itself
    // changing either triggers a new component lifecycle

    super() // allows reference to "this" component within the constructor
    Session.set('globalSubscribed', false)
    this.state = { // initiate any number of state values
      componentMounted: false,
      globalSubscription: Meteor.subscribe('global', function(){
        Session.set('globalSubscribed', true)
      }),
      userSubscription: Meteor.subscribe('user', function(){
        Session.set('userSubscribed', true)
      })

    }
  }
  componentWillMount(){
    // runs after initial construction, but before mounting to DOM
  }
  componentDidMount(){
    // called after component is mounted to the DOM
    this.setState({componentMounted: true}) // example of changing state
  }

  componentWillUpdate(){
    if(!Meteor.userId() && FlowRouter.getRouteName() !== '/'){
      FlowRouter.go("/")
    }
  }

  // UPDATING METHODS


export default class MainLayout extends React.Component {
  render(){ return (
    <div>
      // Header code
      <div> {this.props.content} </div>
      // Footer code
    </div>
  )}
}





// a React component to render the navigation icons
// not exported directly from file. Instead called within MainLayout, which is then exported
class NavIcon extends React.Component{
  render(){
    // Meteor.user()
      return(
        <a href={this.props.link}>
          <div style={{
              margin: '1em',
              fontSize: '1.2em',
              fontWeight: 'bold',
              color: this.props.highlight? color.green : ''
            }}>
            {this.props.name}
          </div>
        </a>
      )

  }
}
