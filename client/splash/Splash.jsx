import React from 'react'

export default class Splash extends React.Component {

  render (){

    return (
      <div style={{
          //border: '1px red solid',
          display: 'flex',
        }}>
        <IconColumn image='upload' link='upload' title='Upload Reports' subtitle='Upload reports for current or past months'/>
        <IconColumn image='price' link='price'  title='Product Prices' subtitle='View metrics dashboard from the Price reports'/>
        <IconColumn image='shelf' link='shelf' title='Shelf Statistics' subtitle='View metrics dashboard from the Shelf reports' />
      </div>
    )
  }
}

class IconColumn extends React.Component{
  render() {
    var style = {
      columnDiv: {
        display: 'flex',
        flexDirection: 'column'
      },
      iconDiv: {
        display: 'flex',
        //border: '1px solid black',
        width: '20em',
        height: '20em',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        margin: '3em 5em'
      },
      titleDiv: {
        display: 'flex',
        //border:'1px solid blue',
        justifyContent: 'center',
        color: 'white',
        fontSize: '2em',
        fontWeight: 'bold'
      },
      subtitleDiv: {
        display: 'flex',
        //border:'1px solid yellow',
        alignSelf: 'center',
        textAlign: 'center',
        width: '15em',
        marginTop: '1em',
        color: color.content,
        fontSize: '1.4em'
      }
    }
    return(
        <div style={style.columnDiv}>
          <a href={this.props.link}>
            <div style={
                {...style.iconDiv, ...{
                  backgroundImage: 'url(images/'+this.props.image+'.png)'
                }}
              }>
            </div>
          </a>
          <div style={style.titleDiv}>
            {this.props.title}
          </div>
          <div style={style.subtitleDiv}>
            {this.props.subtitle}
          </div>
        </div>

    )
  }
}
