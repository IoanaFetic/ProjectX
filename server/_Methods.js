Meteor.methods ({

  batchInsert(documents,dbName){

    /*
    _.each(documents, function(doc) {
    DB[dbName].insert(doc);
    });
    for(i=0; i<documents.length; i++){
      doc = documents[i]
      DB.Prices.insert(doc)
    }
    */

    DB[dbName].batchInsert(documents) // mikowals/batch-insert for performance boost. 1 sheet at a time instead of 1 document.

  },


  removeEntry(report_type, upload_id){
    DB[report_type].remove({upload_id: upload_id}, {multi:true})
  },

  removeMulti(report_type, query){
    console.log("removing from ", report_type, query)
    DB[report_type].remove(query, {multi:true})
  },
  updateProfile(path, value){
    Meteor.users.update(Meteor.userId(),
      {
        $set: {
          ["profile."+path]: value
        }
      },
      function(err){
        if(err){
          console.log(err)
        }
        else {
          console.log("profile updated")
        }
      }
    )
  }


})
