import React, {Component} from 'react'
import ReactDOM from 'react-dom'

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});
export default class AccountsUI extends Component {
   componentDidMount(){
      this.view = Blaze.render(Template.loginButtons, ReactDOM.findDOMNode(this.refs.container))
   }
   componentWillUnmount(){
      Blaze.remove(this.view)
   }
   componentDidUpdate(){
     //   Accounts._loginButtonsSession.set('dropdownVisible', true)
   }
   render(){
      return <span ref="container" />
   }
}
