import XLSX from 'xlsx'
import fs from 'fs'


Meteor.methods ({


  readExcelServer (message){
    console.log (message)
/*
    var worksheet = xlsx.parse('C:\\Data\\test.xlsx')

    for(row of worksheet[0].data){
      console.log(row)
    }


    return 'Job done'*/
  },

  readExcel (data){

  }
})
