import React from 'react'
import Dropzone from 'dropzone'
import DropzoneComponent from 'react-dropzone-component'

import XLSX from 'xlsx'


export default class Splash extends React.Component {
  readExcelClient (){
    Meteor.call ('readExcelServer','bonjour',function (err, returnMessage){
      console.log ('readExcelServer executed succesfully')
      console.log (returnMessage)
    })
  }

  fileDrop (file){
    console.log(file)
    var reader = new FileReader();
    reader.addEventListener("loadend", function(event) {
          var data = event.target.result
          // pre-process data
          
          var binary = "";
          var bytes = new Uint8Array(data);
          var length = bytes.byteLength;
          console.log(length)
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          var oFile = XLSX.read(binary, {type: 'binary', cellDates:true, cellStyles:false});
          console.log(oFile)
    });
    reader.readAsArrayBuffer(file);

  }
  render (){
    var componentConfig = {
        iconFiletypes: ['.jpg', '.png', '.gif'],
        showFiletypeIcon: true,
        postUrl: '/uploadHandler'
    };
    var djsConfig = { autoProcessQueue: false }


    return (
      <div>
        <div onClick={this.readExcelClient}>
          Oh hai tom
        </div>


        <DropzoneComponent config={componentConfig}
                           eventHandlers={{ addedfile: (file) => this.fileDrop(file) }}
                           djsConfig={djsConfig} />

      </div>
    )
  }
}
