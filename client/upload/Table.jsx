import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import { ClipLoader } from 'react-spinners';
import moment from 'moment'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

export default class Table extends TrackerReact(React.Component) {
  removeEntry(report_type, upload_id){
    if(confirm('Are you sure you want to delete this entry?')){
      // remove all documents with the upload ID
      Meteor.call('removeEntry', report_type, upload_id)
    }
  }
  render(){

    var data = []
    data = data.concat(DB.Price.find().fetch()) // add price data
    data = data.concat(DB.Shelf.find().fetch()) // add shelf data
    var submissions = [] // to keep track of unique submissions
    var tableData = []
    // create an array of unique uploads from all documents
    for(doc of data){
      if(submissions.indexOf(doc.upload_id) == -1){
        submissions.push(doc.upload_id)
        // push the first document found for each upload to the table data
        tableData.push(doc)
      }
    }
    // define table column structure and data
   const columns = [{
     Header: 'Username',
     accessor: 'user',
     style: {textAlign: 'center'}
   }, {
     Header: 'Date Submitted',
     accessor: 'datetime',
     Cell: (function({row}){
       // convert time into readable format
       return moment(row._original.datetime).format('DD/MM/YYYY HH:mm:ss')
     }),
     style: {textAlign: 'center'}
   }, {
     Header: 'Report Type',
     accessor: 'report_type',
     style: {textAlign: 'center'}
   }, {
     Header: 'Month of Report',
     accessor: 'report_month',
     id: 'report_month',
     Cell: (function({row}){
       // convert numerical month to word
       return ref.months[row._original.report_month]
     }.bind(this)),
     style: {textAlign: 'center'}
   }, {
     Header: 'Remove',
     id: 'remove',
     Cell: (function({row}){
       // button to remove a submission. calls component method.
       return (
         <div onClick={this.removeEntry.bind(this, row._original.report_type, row._original.upload_id)} style={{
           cursor: 'pointer'
         }}>x</div>
       )
     }.bind(this)),
     width: 100,
     style: {textAlign: 'center'}
   }]
    return (
      <ReactTable
      pageSize={12}
      resizable={false}
      sortable={true}
       data={tableData}
       columns={columns}
       defaultSorted={[{
         id: 'report_month',
         desc: true
       }]}
       style={{
         margin: '1em 0',
         width: '90%',
         background: 'white'
       }}
     />
    )
  }
}
