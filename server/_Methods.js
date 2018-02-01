Meteor.methods ({

  batchInsert(documents){
    _.each(documents, function(doc) {
    DB.Prices.insert(doc);
    });
    /*
    for(i=0; i<documents.length; i++){
      doc = documents[i]
      DB.Prices.insert(doc)
    }
    */
  }

})
