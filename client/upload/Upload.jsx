import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import DropzoneComponent from 'react-dropzone-component'
import XLSX from 'xlsx'
import moment from 'moment'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

export default class Upload extends TrackerReact(React.Component) {
  constructor() {
    super()
    Session.set('priceSubscribed', false)
    Session.set('shelfSubscribed', false)
    this.state = {
      datetime: false,
      lastUploadType: false,
      priceSubscription: Meteor.subscribe('price',function(){
        Session.set('priceSubscribed', true)
      }),
      shelfSubscription: Meteor.subscribe('price',function(){
        Session.set('shelfSubscribed', true)
      })
    }

    this.months = [
      'January',
      'Feburary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
  }

  fileDrop(file) {
    console.log("processing excel")
    // read the raw file as array buffer
    // on loadend, convert to uint8array
    // loop through elements, add each to a new string (in an XLSX friendly format)
    // read string using XLSX, to create a readable JS object of the excel file
    // run "processData" with this object as an argument
    var reader = new FileReader();
    reader.addEventListener("loadend", function(event) {
      var data = event.target.result
      // pre-process data
      var binary = "";
      var bytes = new Uint8Array(data);
      var length = bytes.byteLength;
      for (var i = 0; i < length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      var excel = XLSX.read(binary, {
        type: 'binary',
        cellDates: true,
        cellStyles: false
      });
      this.processData(excel)
    }.bind(this));
    reader.readAsArrayBuffer(file);
  }

  processData(excel) {

    var datetime = moment().format().toString()


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
      var sheet = excel.Sheets[sheetKey]

      if (sheet.A1 && sheet.A1.v == 'Report type') {

        var reportType = sheet.B1.v.split(' ')[0]
        var report_month = moment(sheet.B2.w, 'M/D/YY').month()
        console.log(report_month)

        var RE = new RegExp(/[A-Z]+[0-9]+:([A-Z]+)([0-9]+)/)

        var match = RE.exec(sheet['!ref'])

        var RowMax = parseInt(match[2])

        var keys = Object.keys(sheet)
        var columns = []
        for (key of keys) { //for(i=0; i<keys.length; i++){var key = keys[i]
          var colLetter = key.split(/[0-9]/)[0]
          // if letter not in columns, add it
          if (!colLetter.match("!") && columns.indexOf(colLetter) == -1) {
            columns.push(colLetter)
          }
        }

        // columns = array of unique columns
        var documents = []

        var read = false
        var keyRowIndex = 0


        for (i = 1; i <= RowMax; i++) { //

          if (read){
            var document = {
              datetime,
              report_type: reportType,
              report_month,
              user: Meteor.user().username
            }
            for (colLetter of columns) {
              // Before making object, check if key and value exists
              if (sheet[colLetter + keyRowIndex] && sheet[colLetter + i]) { // if column header & cell value exist
                document[sheet[colLetter + keyRowIndex].v] = sheet[colLetter + i].v
              }
            }

            if (Object.keys(document).length > 1) {
              documents.push(document)
            }

          }
          if (sheet['A'+i] && sheet['A'+i].v == parameters[reportType].firstKey){
            read = true
            keyRowIndex = i
            i++
          }


        }
        console.log(documents)
        Meteor.call('batchInsert', documents, parameters[reportType].dbName)

        this.setState({
          datetime,
          lastUploadType: parameters[reportType].dbName
        })
      }
    }

  }

  removeEntry(report_type, datetime){
    if(confirm('Are you sure you want to delete this entry?')){
      Meteor.call('removeEntry', report_type, datetime)
    }
  }

  render() {

    if(Session.get('priceSubscribed') && Session.get('shelfSubscribed')){
      var data = []

      data = data.concat(DB.Price.find().fetch())
      data = data.concat(DB.Shelf.find().fetch())

      var submissions = [] // to keep track of unique submissions
      var tableData = []

      for(doc of data){
        if(submissions.indexOf(doc.datetime) == -1){
          submissions.push(doc.datetime)
          tableData.push(doc)
        }
      }



     const columns = [{
       Header: 'Username',
       accessor: 'user',
       style: {textAlign: 'center'}
     }, {
       Header: 'Date Submitted',
       Cell: (function({row}){
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
         return this.months[row._original.report_month]
       }.bind(this)),
       style: {textAlign: 'center'}
     }, {
       Header: 'Remove',
       Cell: (function({row}){
         return (
           <div onClick={this.removeEntry.bind(this, row._original.report_type, row._original.datetime)} style={{
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

      return (<div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          flexGrow: 1,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}>



        <div style={{
            backgroundColor: '#d2e7d2',
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
        pageSize={5}
         data={tableData}
         columns={columns}
         style={{
           margin: '2em 0',
           width: '90%'
         }}
       />


      </div>)
    }
    else {
      return <div></div>
    }
  }
}
