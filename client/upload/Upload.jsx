import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import DropzoneComponent from 'react-dropzone-component'
import XLSX from 'xlsx'
import { ClipLoader, PropagateLoader } from 'react-spinners';
import moment from 'moment'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import Table from './Table.jsx'

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
      }),
      droppedFiles: [],
      uploading: false
    }
  }

  fileRead(file) {

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
      this.processData(excel, file)
    }.bind(this));

    // read the raw file as an array buffer
    reader.readAsArrayBuffer(file);
  }

  fileUpload(){
    if(this.dz.files.length > 0){
      this.setState({uploading: true})
    }
    for(f in this.dz.files){
      file = this.dz.files[f]
      this.fileRead(file)
    }
  }
  processData(excel, file) {
    // f = index of file in dropzone component
    // give this uploaded file a unique datetime and ID
    var datetime = moment().format().toString()
    var upload_id = uniqueID()

    console.log('processing data')
    // key info to identify each Excel type
    var parameters = {
      Price: {
        firstKey: 'brand',
        dbName: 'Price',
        valueType: 'price'
      },
      Shelf: {
        firstKey: 'code',
        dbName: 'Shelf',
        valueType: 'faces'
      }
    }

    var documents = [] // initiate array of documents to insert to DB

    var reportType = false
    var dbChecked = false
    for (sheetKey of Object.keys(excel.Sheets)) {
      // iterate through sheets of excel
      var sheet = excel.Sheets[sheetKey]

      if (sheet.A1 && sheet.A1.v == 'Report type' && dbChecked != 'abort') { // check if sheet contains validated data
        var reportType = sheet.B1.v.split(' ')[0] // determine Price/Shelf

        var report_month = moment(sheet.B2.w, 'M/D/YY').month() // get meta data
        var report_year = moment(sheet.B2.w, 'M/D/YY').year()
        // check if report for this month and year is already uploaded
        var matchingDocument = DB[reportType].findOne({report_month, report_year})
        if (matchingDocument && !dbChecked) {
          if (confirm("Entries for " + ref.months[report_month] + " " + report_year + " already exist. Do you want to replace them?")) {
            // remove existing entries for this month and year
            Meteor.call('removeMulti', parameters[reportType].dbName, {report_month, report_year})

            dbChecked = true
          } else {
            dbChecked = 'abort'
            this.dz.removeFile(file)
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

        var read = false // don't start reading initially (skip title rows etc.)
        var keyRowIndex = 0

        for (i = 1; i <= RowMax; i++) { // loop down through rows with data
          if (read) {
            var baseDocument = {
              upload_id,
              datetime,
              report_type: reportType,
              report_month,
              report_year,
              user: Meteor.user().username
            } // initiate document with meta data
            if (reportType == 'Price') {
              baseDocument.client_name = sheet.B3.v
            }
            var valueColumns = []
            for (colLetter of columns) { // loop through cells of row
              // Check if key and value exists for cell
              if (sheet[colLetter + keyRowIndex] && sheet[colLetter + i]) { // if column header & cell value exist
                if(sheet[colLetter + keyRowIndex].v.match(parameters[reportType].valueType)){
                  valueColumns.push(colLetter)
                }
                else {
                  baseDocument[sheet[colLetter + keyRowIndex].v] = sheet[colLetter + i].v // add to the document object
                }
              }
            }

            for (colLetter of valueColumns) { // loop through cells of row
              var document = Object.assign({}, baseDocument)
              document.value_type = parameters[reportType].valueType
              document.value = sheet[colLetter + i].v
              documents.push(document) // add object to array of documents
            }




          }
          if (sheet['A' + i] && sheet['A' + i].v == parameters[reportType].firstKey) {
            // found where the data starts, begin reading on next iteration
            read = true
            keyRowIndex = i // the row where the DB key values are found
            i++ // skip over visible headings in Excel
          }
        }
      }

    }
    // insert all of the completed documents to the DB (server method)
    if (reportType && parameters[reportType]) {
      Meteor.call('batchInsert', documents, parameters[reportType].dbName, function(f) {
        // callback after successful insert
        this.dz.removeFile(f)
      }.bind(this, file))
      this.setState({
        // change the component state, to display last uploaded file confirmation and date
        datetime,
        lastUploadType: parameters[reportType].dbName
      })
    }
  }


  render() {
    if(Session.get('priceSubscribed') && Session.get('shelfSubscribed')){

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
              init: (dz) => this.dz = dz,
              removedfile: (file) => {
                if(file){
                  var droppedFiles = this.state.droppedFiles.slice(0)
                  droppedFiles.splice(droppedFiles.indexOf(file.upload.uuid), 1)
                  this.setState({
                    droppedFiles,
                    uploading: droppedFiles.length < 1? false: this.state.uploading
                  })
                }
              },
              addedfile: (file) => {
                  var droppedFiles = this.state.droppedFiles.slice(0)
                  droppedFiles.push(file.upload.uuid)
                  this.setState({droppedFiles})
              },
            }} djsConfig={{
              autoProcessQueue: false,
              addRemoveLinks: true,
              dictDefaultMessage: "Drop valid Price or Shelf report files here",
            }}/>
        </div>
        <div style={{
          backgroundColor: color.content,
          borderRadius: '.3em',
          padding: '.5em 1.5em',
          fontWeight: 'bold',
          marginTop: '1em',
          cursor: this.state.droppedFiles.length < 1 || this.state.uploading? '': 'pointer',
          opacity: this.state.droppedFiles.length < 1 || this.state.uploading? 0.5: 1,
          boxShadow: '0.1em 0.1em 0.2em rgba(0, 0, 0, 0.4)',
        }} onClick={this.fileUpload.bind(this)}>
          Upload
        </div>
          <div style={{
            height: '5em',
            width: '20em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: '10px'
          }}>
          {this.state.uploading &&
            <ClipLoader color="white"/>
          }
        </div>

        <Table />

      </div>
    )
    }
    else {
      return <PropagateLoader color="white"/>
    }
  }
}
