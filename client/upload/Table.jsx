import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import {ClipLoader} from 'react-spinners';
import moment from 'moment'
import Ionicon from 'react-ionicons'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

export default class Table extends TrackerReact(React.Component) {
  removeEntry(report_type, upload_id) {
    if (confirm('Are you sure you want to delete this entry?')) {
      // remove all documents with the upload ID
      Meteor.call('removeEntry', report_type, upload_id)
    }
  }
  render() {
    if (Meteor.user().admin) {
      var data = DB.Uploads.find().fetch()
    } else {
      var data = DB.Uploads.find({user: Meteor.user().username}).fetch() // add uploads data
    }
    // define table column structure and data
    const columns = [
      {
        Header: rom
          ? 'Nume Cont'
          : 'Username',
        accessor: 'user',
        style: {
          textAlign: 'center'
        }
      }, {
        Header: rom
          ? 'Dată Încărcare'
          : 'Date Submitted',
        accessor: 'datetime',
        Cell: (function({row}) {
          // convert time into readable format
          return moment(row._original.datetime).format('DD/MM/YYYY HH:mm:ss')
        }),
        style: {
          textAlign: 'center'
        }
      }, {
        Header: rom
          ? 'Tip Raport'
          : 'Report Type',
        accessor: 'report_type',
        style: {
          textAlign: 'center'
        }
      }, {
        Header: rom
          ? 'Lună Raport'
          : 'Month of Report',
        accessor: 'report_month',
        id: 'report_month',
        Cell: (function({row}) {
          // convert numerical month to word
          return rom
            ? ref.rommonths[row._original.report_month]
            : ref.months[row._original.report_month]
        }.bind(this)),
        style: {
          textAlign: 'center'
        }
      }, {
        Header: rom
          ? 'Șterge'
          : 'Remove',
        id: 'remove',
        Cell: (function({row}) {
          // button to remove a submission. calls component method.
          return (<div onClick={this.removeEntry.bind(this, row._original.report_type, row._original.upload_id)} style={{
              cursor: 'pointer',
              fontSize: 0

            }}>
            <Ionicon icon="md-close" fontSize={iconSize + "px"}/>
          </div>)
        }.bind(this)),
        width: 100,
        style: {
          textAlign: 'center'
        }
      }
    ]
    return (<ReactTable pageSize={10} resizable={false} sortable={true} data={data} columns={columns} defaultSorted={[{
          id: 'report_month',
          desc: true
        }
      ]} style={{
        margin: '1em 0',
        width: '90%',
        background: 'white'
      }}/>)
  }
}
