import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import DropzoneComponent from 'react-dropzone-component'
import XLSX from 'xlsx'
import moment from 'moment'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

function uniqueID () {
  // based on open source example on StackOverflow
   var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
   return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
   }).toLowerCase()
}

export default class Upload extends TrackerReact(React.Component) {
  constructor() {
    super()
    Session.set('priceSubscribed', false)
    Session.set('shelfSubscribed', false)
    this.state = {
      datetime: false,
      lastUploadType: false,
      // subscribe to mongoDB collections
      priceSubscription: Meteor.subscribe('price',function(){
        Session.set('priceSubscribed', true)
      }),
      shelfSubscription: Meteor.subscribe('price',function(){
        Session.set('shelfSubscribed', true)
      })
    }

    this.months = ref.months
  }

  fileDrop(file) {
    console.log("processing excel")

    // initiate file reader object
    var reader = new FileReader();

    // add "loadend" event listener function, to process once loading finished
    reader.addEventListener("loadend", function(event) {
      // once file is finished uploading, begin conversion
      // the process required is discussed on the XLSX github page

      var data = event.target.result // raw result of read
      var binary = "";
      var bytes = new Uint8Array(data); // convert to uint8array
      var length = bytes.byteLength;
      for (var i = 0; i < length; i++) {
        // loop through elements, add each to a new string (in an XLSX friendly format)
        binary += String.fromCharCode(bytes[i]);
      }
      // read string using XLSX, to create a readable JS object of the excel file
      var excel = XLSX.read(binary, {
        type: 'binary',
        cellDates: true,
        cellStyles: false
      });
      // run "processData" with this object as an argument
      this.processData(excel)
    }.bind(this));

    // read the raw file as an array buffer
    reader.readAsArrayBuffer(file);
  }

  processData(excel) {
    // give this uploaded file a unique datetime and ID
    var datetime = moment().format().toString()
    var upload_id = uniqueID()

    console.log('processing data')
    // key info to identify each Excel type
    var parameters = {
      Price:{
        firstKey: 'brand',
        dbName: 'Price'
      },
      Shelf:{
        firstKey: 'code',
        dbName: 'Shelf'
      }
    }
    console.log(excel)
    for (sheetKey of Object.keys(excel.Sheets)) {
      // iterate through sheets of excel
      var sheet = excel.Sheets[sheetKey]
      if (sheet.A1 && sheet.A1.v == 'Report type') { // check if sheet contains validated data
        var reportType = sheet.B1.v.split(' ')[0] // determine Price/Shelf

        var report_month = moment(sheet.B2.w, 'M/D/YY').month() // get meta data
        var report_year = moment(sheet.B2.w, 'M/D/YY').year()
        // check if report for this month and year is already uploaded
        var matchingDocument = DB[reportType].findOne({
          report_month,
          report_year
        })
        if (matchingDocument){
          if(confirm("Entries for this month already exist. Do you want to replace them?")){
            // remove existing entries for this month and year
              Meteor.call('removeEntry', reportType, matchingDocument.upload_id)
          }
          else {
            alert("Upload aborted")
            return false
          }

        }

        var RE = new RegExp(/[A-Z]+[0-9]+:([A-Z]+)([0-9]+)/) // regular expression to identify meta data
        var match = RE.exec(sheet['!ref']) // meta data field read from Excel
        var RowMax = parseInt(match[2]) // find last row containing data

        var keys = Object.keys(sheet) // get sheet titles
        var columns = [] // to become an array of unique columns containing data
        for (key of keys) { // equivalent to: for(i=0; i<keys.length; i++){var key = keys[i]
          var colLetter = key.split(/[0-9]/)[0]
          // if letter not already in columns array, add it
          if (!colLetter.match("!") && columns.indexOf(colLetter) == -1) {
            columns.push(colLetter)
          }
        }

        var documents = [] // initiate array of documents to insert to DB
        var read = false // don't start reading initially (skip title rows etc.)
        var keyRowIndex = 0

        for (i = 1; i <= RowMax; i++) { // loop down through rows with data
          if (read){
            var document = {
              upload_id,
              datetime,
              report_type: reportType,
              report_month,
              report_year,
              user: Meteor.user().username
            } // initiate document with meta data
            if(reportType == 'Price'){
              document.client_name = sheet.B3.v
            }
            for (colLetter of columns) { // loop through cells of row
              // Before making object, check if key and value exists for cell
              if (sheet[colLetter + keyRowIndex] && sheet[colLetter + i]) { // if column header & cell value exist
                document[sheet[colLetter + keyRowIndex].v] = sheet[colLetter + i].v // add to the document object
              }
            }
            if (Object.keys(document).length > 6) { // if data was found
              documents.push(document) // add object to array of documents
            }
          }
          if (sheet['A'+i] && sheet['A'+i].v == parameters[reportType].firstKey){
            // found where the data starts, begin reading on next iteration
            read = true
            keyRowIndex = i // the row where the DB key values are found
            i++ // skip over visible headings in Excel
          }
        }
        // insert all of the completed documents to the DB (server method)
        Meteor.call('batchInsert', documents, parameters[reportType].dbName)
        this.setState({
          // change the component state, to display last uploaded file confirmation and date
          datetime,
          lastUploadType: parameters[reportType].dbName
        })


      }
    }
  }

  removeEntry(report_type, upload_id){
    if(confirm('Are you sure you want to delete this entry?')){
      // remove all documents with the upload ID
      Meteor.call('removeEntry', report_type, upload_id)
    }
  }

  render() {
    if(Session.get('priceSubscribed') && Session.get('shelfSubscribed')){
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
       Cell: (function({row}){
         // convert numerical month to word
         return this.months[row._original.report_month]
       }.bind(this)),
       style: {textAlign: 'center'}
     }, {
       Header: 'Remove',
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

      var uploadMessage = ''
      if (this.state.lastUploadType){
        var recentData = DB[this.state.lastUploadType].find({datetime: this.state.datetime}).fetch()
        uploadMessage += this.state.lastUploadType + ' report submitted. '
        uploadMessage += recentData.length + ' rows successfully uploaded at ' + moment(this.state.datetime).format('HH:mm:ss')
      }

      // return page content
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          flexGrow: 1,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}>

        <div style={{
            backgroundColor: color.content,
            height: '15em',
            width: '90%',
            marginTop: '2em',
            color: 'DarkGreen',
            fontStyle: 'italic',
            borderRadius: '0.2em',
            position: 'relative',
            flexShrink: 0,
          }}>
          <DropzoneComponent config={{
              iconFiletypes: [
                '.jpg', '.png', '.gif'
              ],
              showFiletypeIcon: true,
              postUrl: '/uploadHandler'
            }} eventHandlers={{
              addedfile: (file) => this.fileDrop(file)
            }} djsConfig={{
              autoProcessQueue: false
            }}/>
        </div>

        <div style={{
            color: 'DarkGreen',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '3em'
          }}>
          {uploadMessage}
        </div>

        <ReactTable
        pageSize={10}
         data={tableData}
         columns={columns}
         style={{
           margin: '2em 0',
           width: '90%',
           background: 'white'
         }}
       />

      </div>
    )
    }
    else {
      // loading DB entries
      return <div></div>
    }
  }
}
