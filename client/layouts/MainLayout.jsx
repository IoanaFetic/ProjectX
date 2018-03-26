// this file is heavily commented to explain the basic structure of Meteor.js with React.js

// import basic packages
import React from 'react'
import AccountsUI from './AccountsUI.jsx'
import TrackerReact from 'meteor/ultimatejs:tracker-react'


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

  render(){

    // render(){} always required for react component
    // excecutes code for every lifecycle of component
    // content of return() is converted to HTML then appended to DOM
    // 'under the hood', document.createElement() is used when compiling
    return (
        <div style={{ // in React.js, inline styles are encouraged
          height: '100%', // conventional CSS syntax is replaced by object notation
          display: 'flex', // as CSS is written in JS, strings must be quoted
          flexDirection: 'column' // a CSS dash is replaced by upper case character
        }}>
          <nav style={{
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'white',
            height: '3em',
            alignItems: 'center',
            flexShrink: 0,
            borderBottom: color.border + ' 1px solid'
          }}>
            <div style={{
                display: 'flex',
                flexGrow: 1,
                height: '100%',
                alignItems: 'center'
            }}>
              <div className="tip" style={{
                  backgroundImage: 'url("/images/logo.png")',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  display: 'flex',
                  height: '80%',
                  margin: '0 1em',
                  width: "5em"
                }}>
              </div>

              <NavIcon name='Home' link='/' highlight={this.props.page=='splash'}/>
              {Meteor.userId() && <NavIcon name='Upload' link='upload' highlight={this.props.page=='upload'}/>}
              {Meteor.userId() && <NavIcon name='Price' link='price' highlight={this.props.page=='price'}/>}
              {Meteor.userId() && <NavIcon name='Shelf' link='shelf' highlight={this.props.page=='shelf'}/>}
            </div>
            <div style={{
                margin: '1em',
            }} >
            {Meteor.userId() && <span>Logged in as </span> }
            <AccountsUI/>
            </div>
          </nav>
          <header></header>
        <div style={{
            display: 'flex',
            flexGrow: 1,
						backgroundColor: color.green,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '100%',
            padding: '1em .5em 0 .5em',
            overflowY: "auto",
          }}>
          {this.props.content}
        </div>
        <footer id="footer" style={{
            display: 'flex',
            backgroundColor: 'white',
            color: 'white',
            height: '2em',
            alignItems: 'center',
            flexShrink: 0,
            borderTop: color.border + ' 1px solid'
          }}>
        </footer>
      </div>
    )
  }
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
