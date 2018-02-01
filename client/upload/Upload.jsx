import React from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import DropzoneComponent from 'react-dropzone-component'
import XLSX from 'xlsx'
import moment from 'moment'

export default class Upload extends TrackerReact(React.Component) {
  constructor() {
    super()
    this.state = {
      datetime: false
    }
  }

  fileDrop(file) {
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
        firstKey: 'brand'
      },
      Shelf:{
        firstKey: 'code'
      }
    }

    console.log(excel)

    for (sheetKey of Object.keys(excel.Sheets)) {
      var sheet = excel.Sheets[sheetKey]

      if (sheet.A1 && sheet.A1.v == 'Report type') {

        var reportType = sheet.B1.v

        reportType = reportType.split(' ')[0]


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
        for (i = 5; i < 100; i++) { //rows 1-6 not needed
          var document = {
            datetime
          };
          for (colLetter of columns) {
            // Before making object, check if key and value exists
            if (sheet[colLetter + '5'] && sheet[colLetter + i]) { // if column header & cell value exist
              document[sheet[colLetter + '5'].v] = sheet[colLetter + i].v
            }
          }

          if (Object.keys(document).length > 1) {
            documents.push(document)
          }

        }
        console.log(documents)
        Meteor.call('batchInsert', documents)

        this.setState({datetime})
      }
    }

  }

  render() {

    var data = DB.Prices.find({datetime: this.state.datetime}).fetch()

    var uploadMessage = ''

    if (this.state.datetime) {
      uploadMessage = data.length + ' rows successfully uploaded at ' + moment(this.state.datetime).format('hh:mm:ss')
    }

    return (<div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center'
      }}>
      <div style={{
          backgroundColor: '#d2e7d2',
          height: '15em',
          width: '20em',
          marginTop: '-20em',
          color: 'DarkGreen',
          fontStyle: 'italic',
          borderRadius: '0.2em',
          position: 'relative'
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
    </div>)
  }
}
