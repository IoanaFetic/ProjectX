import React from 'react'
import AccountsUI from './AccountsUI.jsx'

export default class MainLayout extends React.Component {

  render(){
    return (
      <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column'

        }}>
        <nav style={{
          display: 'flex',
          flexDirection: 'row',
          backgroundColor: 'forestgreen',
          color: 'white',
          height: '2em',
          alignItems: 'center'


          }}>
          <div style={{
              display: 'flex',
              flexGrow: 1
            }}>
          <NavIcon name='Home' link='/'/>
          <NavIcon name='Upload' link='upload'/>
          <NavIcon name='Prices' link='prices'/>
          <NavIcon name='Shelf' link='shelf'/>

          </div>

        <div style={{
            margin: '1em'
          }}>
          <AccountsUI/>
        </div>
      </nav>
      <header>

      </header>

        <div style={{
            display: 'flex',
            flexGrow: 1,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center'

          }}>
          {this.props.content}
        </div>

        <footer style={{
            display: 'flex',
            backgroundColor: 'forestgreen',
            color: 'white',
            height: '2em',
            alignItems: 'center'
          }}>

        </footer>
      </div>





    )
  }




}

class NavIcon extends React.Component{
  render(){
    return(
      <a href={this.props.link}>
        <div style={{
            margin: '1em'
          }}>
          {this.props.name}
        </div>
      </a>
    )



  }
}
