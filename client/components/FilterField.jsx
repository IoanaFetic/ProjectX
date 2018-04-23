import React from 'react'
import Chips, {Chip} from 'react-chips'
import Ionicon from 'react-ionicons'

export default class FilterField extends React.Component {

  render() {
    return (<div style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: ".5em",
        position: "relative",
        opacity: this.props.disable
          ? 0.5
          : 1
      }} className={this.props.disable
        ? 'locked_filter'
        : ''}>
      {
        this.props.disable && <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}></div>
      }

      <div style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginBottom: ".3em"
        }}>
        <div style={{
            width: "10em",
            display: "flex",
            alignItems: "center"
          }}>
          <div style={{
              marginLeft: "1em",
              fontWeight: "bold"
            }}>
            {this.props.field}
          </div>
        </div>

      </div>
      <div style={{
          position: "relative"
        }} className="chips">
        <Chips value={this.props.chips} onChange={this.props.changeChips || function() {}} suggestions={this.props.suggestions || []} alwaysRenderSuggestions={true}/> {
          !this.props.disable && <Ionicon icon="md-close-circle" fontSize={iconSize + "px"} onClick={this.props.removeFilter.bind(null, this.props.field)} style={{
                cursor: "pointer",
                padding: ".1em",
                display: "inline-block",
                position: "absolute",
                right: -10,
                top: -10
              }}/>
        }
      </div>

    </div>)
  }
}
