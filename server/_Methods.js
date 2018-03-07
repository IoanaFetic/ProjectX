Meteor.methods ({

  batchInsert(documents,dbName){
    _.each(documents, function(doc) {
    DB[dbName].insert(doc);
    });
    /*
    for(i=0; i<documents.length; i++){
      doc = documents[i]
      DB.Prices.insert(doc)
    }
    */
  },


  removeEntry(report_type, upload_id){
    DB[report_type].remove({upload_id: upload_id}, {}, {multi:true})
  }

})
