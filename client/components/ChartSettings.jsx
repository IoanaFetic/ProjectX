import React from 'react'
import Ionicon from 'react-ionicons'
import Toggle from 'react-toggle'
import Dropdown from 'react-dropdown'
import FilterField from './FilterField.jsx'

export default class ChartSettings extends React.Component {
  constructor(props) {
    super(props)
    this.origSettings = props.origSettings // save original settings to component
    this.state = { // make settings (user specific or default) a state of component
      settings: props.userSettings || props.origSettings && JSON.parse(props.origSettings) || {
        filter: {}, // null settings if nothing found
        sort: '',
        sum: false
      },
      selectedYear: false // updated if selected year is changed
    }
  }
  saveSettings() {
    if (JSON.stringify(this.state.settings) == this.origSettings) {
      // default settings set, so removing user specific settings
      var newSettings = Meteor.user().chartSettings || {}
      delete newSettings[this.props.id]
      Meteor.call("updateUser", "chartSettings", newSettings, function() {
        this.props.resubscribe()
      }.bind(this))
    } else {
      //saving user specific settings
      Meteor.call("updateUser", "chartSettings." + this.props.id, this.state.settings, function() {
        this.props.resubscribe()
      }.bind(this))
    }
    if (this.state.selectedYear) {
      Meteor.call('updateUser', 'selectedYear', this.state.selectedYear, function() {
        this.props.resubscribe()
        //year changed, resubscribe
      }.bind(this))
    }
    this.props.toggleSettings()
  }
  setFilter(key) {
    var settings = this.state.settings
    settings.filter[key.value] = []
    this.setState({settings})
  }
  removeFilter(key) {
    var settings = this.state.settings
    delete settings.filter[key]
    this.setState({settings})
  }
  changeChips(key, newArray) {
    var settings = this.state.settings
    settings.filter[key] = newArray
    this.setState({settings})
  }
  resetSettings() {
    this.setState({
      settings: JSON.parse(this.origSettings)
    })
  }
  toggleSum() {
    var settings = this.state.settings
    settings.sum = !settings.sum
    this.setState({settings})
  }
  setSort(val) {
    var settings = this.state.settings
    settings.sort = val.value
    this.setState({settings})
  }
  setYear(val) {
    this.setState({selectedYear: val.value})
  }
  render() {
    // check if current settings state are the default settings
    var isOriginal = JSON.stringify(this.state.settings) == this.origSettings
    // get dropdown values from mongoDB (unique field values)
    var keyValues = DB.Global.findOne({id: "keyValues"}).value
    // get unique values for this database
    keyValues = keyValues[this.props.dbName]
      ? keyValues[this.props.dbName]
      : {}
    return (<div style={{
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
        }}>
        <div onClick={this.props.toggleSettings}>
          {
            rom
              ? 'Anulare'
              : 'Cancel'
          }
        </div>
        <div onClick={this.saveSettings.bind(this)} style={{
            marginLeft: "1.5em"
          }}>
          {
            rom
              ? 'Salvare'
              : 'Save'
          }
        </div>
        {
          !isOriginal && <div onClick={this.resetSettings.bind(this)} style={{
                marginLeft: "1.5em"
              }}>
              {
                rom
                  ? 'Resetare'
                  : 'Reset'
              }
            </div>
        }
      </div>
      <div style={{
          position: "absolute",
          top: "0.5em",
          right: "1em"
        }}>
        {
          (
            rom
            ? 'Baza de Date: '
            : 'Database: ') + this.props.dbName
        }
      </div>
      <div style={{
          display: "flex",
          flexDirection: "column"
        }}>
        <div style={{
            marginBottom: "1em",
            display: "flex",
            justifyContent: "space-between"
          }}>
          <div style={{
              display: "flex",
              alignItems: "center"
            }}>
            <Ionicon icon="md-funnel" fontSize={iconSize + "px"} style={{
                margin: "0 .5em"
              }}/>
            <div style={{
                display: "flex",
                flexShrink: 0,
                width: "10em",
                marginRight: "2em"
              }}>
              <div style={{
                  width: "100%"
                }}>
                <Dropdown options={Object.keys(keyValues)} onChange={this.setSort.bind(this)} value={this.state.settings.sort}/>
              </div>
            </div>
            {
              this.props.dbName != 'Price' && <Toggle defaultChecked={this.state.settings.sum} onChange={this.toggleSum.bind(this)} style={{
                    width: "500px"
                  }} icons={{
                    checked: <div>{
                        rom
                          ? 'Sumă'
                          : 'Sum'
                      }
                    </div>,
                    unchecked: <div>{
                          rom
                            ? 'Medie'
                            : 'Mean'
                        }
                      </div>
                  }}/>
            }
            <Ionicon icon="md-add" fontSize={iconSize * 0.7 + "px"} style={{
                margin: "0 .5em 0 2em"
              }}/>
            <div style={{
                display: "flex",
                width: "10em",
                flexShrink: 0
              }}>
              <div style={{
                  width: "100%"
                }}>
                <Dropdown options={Object.keys(keyValues)} onChange={this.setFilter.bind(this)} placeholder={rom
                    ? "Adăugați date..."
                    : "Include data for..."}/>
              </div>
            </div>
          </div>
          <div style={{
              display: "flex",
              alignItems: "center"
            }}>
            <div style={{
                margin: "0 .5em"
              }}>
              Year:
            </div>
            <div style={{
                width: "7em"
              }}>
              <div style={{
                  width: "100%"
                }}>
                <Dropdown options={[2016, 2017]} onChange={this.setYear.bind(this)} value={Meteor.user().selectedYear && Meteor.user().selectedYear.toString() || this.state.selectedYear && this.state.selectedYear.toString()}/>
              </div>
            </div>
          </div>
        </div>
        {!Meteor.user().admin && <FilterField field={"username"} chips={[Meteor.user().username]} disable={true}/>}
        {
          Object.keys(this.state.settings.filter).map((field, k) => {
            return (<FilterField key={'filterfield_' + k} field={field} chips={this.state.settings.filter[field]} removeFilter={this.removeFilter.bind(this)} changeChips={this.changeChips.bind(this, field)} suggestions={field == "report_month"
                ? ref.months
                : keyValues[field]}/>)
          })
        }
      </div>
    </div>)
  }
}
