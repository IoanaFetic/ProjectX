import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import DropzoneComponent from 'react-dropzone-component'
import XLSX from 'xlsx'
import {ClipLoader, PropagateLoader} from 'react-spinners';
import moment from 'moment'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

import Table from './Table.jsx'

//redundant due to uuid
function uniqueID() {
  // based on open source example on StackOverflow
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase()
}

export default class Upload extends TrackerReact(React.Component) {
  constructor() {
    super()
    Session.set('uploadsSubscribed', false)
    this.state = {
      uploadsSubscription: Meteor.subscribe('uploads', function() {
        Session.set('uploadsSubscribed', true)
      }),
      droppedFiles: [],
      uploading: false
    }
    this.dz = false // becomes the dropzone object reference
    this.filesToEmail = []
  }
  componentWillUnmount() {
    this.state.uploadsSubscription.stop()
  }

  fileUpload() {
    if (this.dz.files.length > 0) {
      this.setState({uploading: true})
    }
    for (f in this.dz.files) {
      file = this.dz.files[f]
      this.fileRead(file)
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

  processData(excel, file) {
    console.log(excel)
    // f = index of file in dropzone component
    // give this uploaded file a unique datetime and ID
    var datetime = moment().format().toString()
    var upload_id = file.upload.uuid // assign unique ID from dropzone
    var parameters = { // lookup values specific to each report type
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
    var dbChecked = false //indicates whether DB has been checked for this month and year
    var meta = false //stores global information for this file
    for (sheetKey of Object.keys(excel.Sheets)) { // iterate through sheets of excel
      var sheet = excel.Sheets[sheetKey]
      // check if sheet contains validated data
      if (sheet.A1 && sheet.A1.v == 'Report type' && dbChecked != 'abort') {
        if (!meta) { // only defined for first valid sheet
          meta = { upload_id, datetime,
            report_type: sheet.B1.v.split(' ')[0], // determine Price/Shelf from cell
            report_month: moment(sheet.B2.w, 'M/D/YY').month(), // get meta data
            report_year: moment(sheet.B2.w, 'M/D/YY').year(),
            user: Meteor.user().username
          } // initiate document with meta data
        }

        // check if report for this month and year is already uploaded
        var matchingDocument = DB.Uploads.findOne({report_type: meta.report_type, report_month: meta.report_month, report_year: meta.report_year})

        if (matchingDocument && !dbChecked) {
          if (confirm("Entries for " + ref.months[meta.report_month] + " " + meta.report_year + " already exist. Do you want to replace them?")) {
            // remove existing entries for this month and year
            Meteor.call('removeMonthYear', parameters[meta.report_type].dbName, {
              report_month: meta.report_month,
              report_year: meta.report_year
            })
            dbChecked = true
          } else {
            dbChecked = 'abort'
            this.dz.removeFile(file)
            return false
          }
        }

        var RE = new RegExp(/[A-Z]+[0-9]+:([A-Z]+)([0-9]+)/) // regular expression to identify meta data
        var match = RE.exec(sheet['!ref']) // meta data field read from excel
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
        var keyRowIndex = 0 // to be reset to the key row index
        for (i = 1; i <= RowMax; i++) { // loop down through rows with data
          if (read) { // if we've reached the start of the data
            var baseDocument = Object.assign({}, meta) // assign meta data to base doc for this row
            if (meta.report_type == 'Price') { // exception for Price. Client name is in B3
              baseDocument.client_name = sheet.B3.v
            }
            var valueColumns = [] // to fill with column letters containing price/shelf values
            for (colLetter of columns) { // loop through unique column array. ie. A, B, D...
              // check if there is a key above the column & there is a cell value
              if (sheet[colLetter + keyRowIndex] && sheet[colLetter + i]) {
                // check if key contains indication that this column contains a value
                // "parameters" object contains settings for reading each report type
                if (sheet[colLetter + keyRowIndex].v.match(parameters[meta.report_type].valueType)) {
                  valueColumns.push(colLetter) // create a unique document for this column later
                } else { // treat as common information, add to the base document
                  baseDocument[sheet[colLetter + keyRowIndex].v] = sheet[colLetter + i].v }
              }
            }
            for (colLetter of valueColumns) { // loop through cells which require seperate documents
              if (sheet[colLetter + i].v > 0) { // check if the value is useful
                var document = Object.assign({}, baseDocument) // assign all info from the base doc
                if (meta.report_type == "Shelf") { // add brand for data point from key value row
                  document.value_type = sheet[colLetter + keyRowIndex].v.split("_")[1] // (shelf)
                  document.brand = sheet[colLetter + keyRowIndex].v.split("_")[2]
                }
                if (meta.report_type == "Price") { // describe value being stored in "value" key
                  document.value_type = parameters[meta.report_type].valueType // (price)
                }
                document.value = sheet[colLetter + i].v // add the numerical value to document
                documents.push(document) // add document object to array of documents
              }
            }
          }
          if (!read && sheet['A' + i] && sheet['A' + i].v == parameters[meta.report_type].firstKey) {
            read = true; // found where the data starts, begin reading on next iteration
            keyRowIndex = i // the row where the DB key values are found
            i++ // skip over visible headings in Excel
          }

        }
      }
    }
    // insert all of the completed documents to the DB (server method)
    if (meta.report_type && parameters[meta.report_type]) {

      var completeFile = JSON.parse(JSON.stringify({
        ...file,
        ...meta
      }))

      Meteor.call('batchInsert', // method name
      documents, // document array to insert
      parameters[meta.report_type].dbName, // DB to add to
      function(f, f2, desc) { // callback after insert
        Meteor.call('fileInsert', f2) // add file meta data to uploads DB
        this.filesToEmail.push(desc) // drafting the email
        this.dz.removeFile(f) // remove element from dropzone
      }.bind(this, file, completeFile, ( // bind variables for use within callback
        meta.report_type + " report for " + ref.months[meta.report_month] + " " + meta.report_year
      )))
    }
  }

  sendEmail() {
    if (this.filesToEmail.length > 0) {
      Meteor.call("sendEmail", "Kamis Report Upload", ("The following reports have just been uploaded by <b>" + Meteor.user().username + "</b>:<br/><br/>" + this.filesToEmail.join("<br/>")))
      this.filesToEmail = []
    }
  }

  render() {
    if (Session.get('uploadsSubscribed')) {

      // return page content
      return (<div style={{
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
            flexShrink: 0
          }}>

          <DropzoneComponent
            eventHandlers={{
              init: (dz) => {
                this.dz = dz
              },
              removedfile: (file) => {
                if (file) {
                  var droppedFiles = this.state.droppedFiles.slice(0)
                  droppedFiles.splice(droppedFiles.indexOf(file.upload.uuid), 1)
                  if (this.state.uploading && droppedFiles.length < 1) {
                    this.sendEmail()
                  }
                  this.setState({
                    droppedFiles,
                    uploading: droppedFiles.length < 1
                      ? false
                      : this.state.uploading
                  })
                }
              },
              addedfile: (file) => {
                var droppedFiles = this.state.droppedFiles.slice(0)
                droppedFiles.push(file.upload.uuid)
                this.setState({droppedFiles})
              }
            }}

            config={{
                iconFiletypes: [
                  '.jpg', '.png', '.gif'
                ],
                showFiletypeIcon: true,
                postUrl: '/uploadHandler'
              }}
             djsConfig={{
              autoProcessQueue: false,
              addRemoveLinks: true,
              dictDefaultMessage: "Drop valid Price or Shelf report files here"
            }}/>
        </div>
        <div style={{
            backgroundColor: color.content,
            borderRadius: '.3em',
            padding: '.5em 1.5em',
            fontWeight: 'bold',
            marginTop: '1em',
            cursor: this.state.droppedFiles.length < 1 || this.state.uploading
              ? ''
              : 'pointer',
            opacity: this.state.droppedFiles.length < 1 || this.state.uploading
              ? 0.5
              : 1,
            boxShadow: '0.1em 0.1em 0.2em rgba(0, 0, 0, 0.4)'
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
          {this.state.uploading && <ClipLoader color="white"/>}
        </div>

        <Table/>

      </div>)
    } else {
      return <PropagateLoader color="white"/>
    }
  }
}
