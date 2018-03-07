import React, {Component} from 'react'
import ReactDOM from 'react-dom'


Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

export default class AccountsUI extends Component {

   componentDidMount(){
      this.view = Blaze.render(Template.loginButtons, ReactDOM.findDOMNode(this.refs.container))
      console.log(Accounts)

      Accounts._loginButtonsSession.set('dropdownVisible', true)


        var style = document.createElement('style');
        style.innerHTML = '#login-buttons {position:absolute;left:50%;top:50%;}' +
        '.login-link-text,.login-close-text{display: none;}' +
        '.accounts-dialog{margin:0 !important; transform:translate(-50%, -50%);}'

        document.getElementsByTagName('head')[0].appendChild(style);

   }
   componentWillUnmount(){
      Blaze.remove(this.view)
   }
   componentDidUpdate(){
     Accounts._loginButtonsSession.set('dropdownVisible', true)
   }
   render(){


      return <span ref="container" />
   }

}
