import React from 'react'
import Chips, { Chip } from 'react-chips'
import Ionicon from 'react-ionicons'
import Toggle from 'react-toggle'
export default class ChartSettings extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      settings: props.userSettings || this.props.origSettings && JSON.parse(this.props.origSettings) || {
        filter: {},
        sort: '',
        sum: false
      }
    }
  }
  saveSettings(){
    if(JSON.stringify(this.state.settings) == this.props.origSettings){
      var newSettings = Meteor.user().chartSettings
      delete newSettings[this.props.id]
      Meteor.call("updateUser", "chartSettings", newSettings)
    }
    else {
      Meteor.call("updateUser", "chartSettings." + this.props.id, this.state.settings)
    }
    this.props.toggleSettings()

  }
  setFilter(key){
    var settings = this.state.settings
    settings.filter[key.value] = []
    this.setState({
      settings
    })
  }
  removeFilter(key){
    var settings = this.state.settings
    delete settings.filter[key]
    this.setState({
      settings
    })
  }
  changeChips(key, newArray){
    var settings = this.state.settings
    settings.filter[key] = newArray
    this.setState({
      settings
    })
  }
  resetSettings(){
    var settings = this.props.origSettings
    this.setState({
      settings: JSON.parse(settings)
    })
    this.state.settings = settings
  }
  toggleSum(){
    var settings = this.state.settings
    settings.sum = !settings.sum
    this.setState({
      settings
    })
  }

  setSort(val){
    var settings = this.state.settings
    settings.sort = val.value
    this.setState({
      settings
    })
  }

  render(){
    var original = JSON.stringify(this.state.settings) == this.props.origSettings
    var keyValues = DB.Global.findOne({id: "keyValues"}).value
    keyValues = keyValues[this.props.dbName]? keyValues[this.props.dbName]: {}

    console.log(Meteor.user())
    return (
      <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.9,
          backgroundColor: "white",
          zIndex: 2,
          padding: "3em 1em 1em 1em",
          borderRadius: '0.3em',
          overflow: "auto"
        }}>


        <div style={{
                  position: "absolute",
                  top: "0.5em",
                  left: "1em",
                  cursor: "pointer",
                  color: color.green,
                  display: "flex"
          }}
            >
            <div onClick={this.props.toggleSettings}>
              Cancel
            </div>
            <div onClick={this.saveSettings.bind(this)} style={{marginLeft: "1.5em"}}>
                Save
              </div>
              {!original &&
              <div onClick={this.resetSettings.bind(this)} style={{marginLeft: "1.5em"}}>
                Reset
              </div>
            }
          </div>

          <div style={{
                position: "absolute",
                top: "0.5em",
                right: "1em",
                color: color.green
                }}
              >
              {this.props.dbName} Database
            </div>

        <div style={{
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            marginBottom: "1em",
            display: "flex",
            alignItems: "center"
          }}>


            <Ionicon icon="md-funnel" fontSize="20px" style={{
              margin: "0 .5em"
            }}/>
            <div style={{
              display: "flex",
              flexShrink: 0,
                width: "10em",
                marginRight: "2em"
            }}>
            <div style={{width: "100%"}}>
              <Dropdown options={Object.keys(keyValues)} onChange={this.setSort.bind(this)} value={this.state.settings.sort}/>
            </div>
            </div>
            <Toggle
              defaultChecked={this.state.settings.sum}
              onChange={this.toggleSum.bind(this)}
              style={{width: "500px"}}
              icons={{
                checked: <div>Sum</div>,
                unchecked: <div>Mean</div>,
              }}/>

            <Ionicon icon="md-add" fontSize="16px" style={{
              margin: "0 .5em 0 2em"
            }}/>
              <div style={{
                display: "flex",
                  width: "10em",
                  flexShrink: 0
              }}>
                <div style={{width: "100%"}}>
                <Dropdown options={Object.keys(keyValues)} onChange={this.setFilter.bind(this)} placeholder="Filter by key..." />
              </div>
              </div>


          </div>

          {!Meteor.user().admin && <FilterField
            field={"username"}
            chips={[Meteor.user().username]}
            disable={true}
          />}
          {
            Object.keys(this.state.settings.filter).map((field, k) => {

              return (
                  <FilterField
                    key={'filterfield_'+k}
                    field={field}
                    chips={this.state.settings.filter[field]}
                    removeFilter={this.removeFilter.bind(this)}
                    changeChips={this.changeChips.bind(this, field)}
                    suggestions={field == "report_month"? ref.months: keyValues[field]}
                  />
              )
            })
          }

        </div>

      </div>
    )
  }
}
//

import Dropdown from 'react-dropdown'

class FilterField extends React.Component {

  render(){
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: ".5em",
        position: "relative",
        opacity: this.props.disable? 0.5: 1
      }} className={this.props.disable? 'locked_filter': ''}>
      {this.props.disable &&
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 999,
        }}></div>
      }

      <div style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        marginBottom: ".3em"
      }}>
        <div style={{width: "10em", display: "flex", alignItems: "center"}}>
          <div style={{marginLeft: "1em", fontWeight: "bold"}}>
            {this.props.field}
          </div>
        </div>

      </div>
      <div style={{position: "relative"}}>
        <Chips
          value={this.props.chips}
          onChange={this.props.changeChips || function(){}}
          suggestions={this.props.suggestions || []}
          alwaysRenderSuggestions={true}
          //createChipKeys={[13]}
        />
        {!this.props.disable &&
          <Ionicon icon="md-close-circle" fontSize="20px"
          onClick={this.props.removeFilter.bind(null, this.props.field)}
          style={{
            cursor: "pointer", padding: ".1em", display: "inline-block",
            position: "absolute",
            right: -10,
            top: -10
          }}
        />
        }
      </div>


    </div>
    )
  }
}
