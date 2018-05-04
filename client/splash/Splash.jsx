import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'

export default class Splash extends TrackerReact(React.Component) {
  signInDropdown() {
    Accounts._loginButtonsSession.set('dropdownVisible', !Accounts._loginButtonsSession.get('dropdownVisible'))
  }
  render() {
    if (Meteor.userId() && !Session.get('reload')) {
      return (<div className="forceColumn reduceFont" style={{
          display: 'flex',
          marginTop: "-5em"
        }}>
        <IconColumn image='upload' link='upload' title={rom
            ? 'Încarcăre Raport'
            : 'Upload Reports'} subtitle={rom
            ? 'Încarcăre raport pentru luna curentă'
            : 'Upload reports for current or past months'}/>
        <IconColumn image='price' link='price' title={rom
            ? 'Preț Produse'
            : 'Product Prices'} subtitle={rom
            ? 'Vizualizeaza date de la graficele de Preț'
            : 'View metrics dashboard from the Price reports'}/>
        <IconColumn image='shelf' link='shelf' title={rom
            ? 'Fețe Raft'
            : 'Shelf Statistics'} subtitle={rom
            ? 'Vizualizeaza date de la graficele de Raft'
            : 'View metrics dashboard from the Shelf reports'}/>
      </div>)
    } else {
        if (!Session.get('reload')){
          return (<div style={{
              fontSize: "1.6em",
              color: "white",
              marginTop: "-10em",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }} onClick={this.signInDropdown}>
            <div style={{
                marginBottom: "1em"
              }}> {rom? "Bine ați venit pe pagina Kamis" : "Welcome to the Kamis dashboard"}</div>
            <div> {rom? "Apăsați" : "Click"}
              <span onClick={this.signIn} style={{
                  fontWeight: "bold",
                  cursor: "pointer"
                }}>{rom? " aici " : " here "}</span>
              {rom? "pentru a vă loga" : "to sign in"}</div>
          </div>)
      }
    }
  }
}

class IconColumn extends React.Component {
  render() {
    var style = {
      columnDiv: {
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        margin: '1em 0em',
        alignItems: 'center'
      },
      iconDiv: {
        display: 'flex',
        width: '20em',
        height: '20em',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        margin: '3em 5em',
        cursor: 'pointer'
      },
      titleDiv: {
        display: 'flex',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2em',
        fontWeight: 'bold'
      },
      subtitleDiv: {
        display: 'flex',
        alignSelf: 'center',
        textAlign: 'center',
        width: '15em',
        marginTop: '1em',
        color: color.content,
        fontSize: '1.4em'
      }
    }
    return (<div style={style.columnDiv}>
      <div className='reduceIcon' onClick={function() {
          FlowRouter.go('/' + this.props.link)
        }.bind(this)} style={{
          ...style.iconDiv,
          ...{
            backgroundImage: 'url(images/' + this.props.image + '.png)'
          }
        }}></div>
      <div style={style.titleDiv}>
        {this.props.title}
      </div>
      <div style={style.subtitleDiv}>
        {this.props.subtitle}
      </div>
    </div>)
  }
}
