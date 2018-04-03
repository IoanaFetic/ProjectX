DB = {
  Price: new Mongo.Collection ('price'),
  Shelf: new Mongo.Collection ('shelf'),
  Global: new Mongo.Collection ('global'),
  Uploads: new Mongo.Collection ('uploads')
}

Meteor.publish('global',function(){
  return DB.Global.find()
})

Meteor.publish('uploads',function(){
  return DB.Uploads.find()
})

Meteor.publish('user', function(){
  return Meteor.users.find({_id: this.userId})
})

Meteor.publish('price',function(){
  if(Meteor.user()){
    if(Meteor.user().admin){
      return DB.Price.find()
    }
    else {
      return DB.Price.find({
        user: Meteor.user().username
      })
    }
  }
  else {
    this.ready()
  }
})

Meteor.publish('shelf',function(){
  if(Meteor.user()){
    if(Meteor.user().admin){
      return DB.Shelf.find()
    }
    else {
      return DB.Shelf.find({
        user: Meteor.user().username
      })
    }
  }
  else {
    this.ready()
  }
})



Meteor.startup(function() {
  var indexes = {
    Price: [
      'brand',
      'client_name',
      'report_month',
      'report_type',
      'upload_id',
      'user',
      'report_year',
      'package_type',
      'product'
    ],
    Shelf: [
      'brand',
      'client_name',
      'report_month',
      'report_type',
      'upload_id',
      'user',
      'report_year',
      'value_type',
      'city',
      'district',
      'salesman',
      'merchandiser',
      'regional_manager'
    ]
  }
  var uniqueValues = {}
  for (dbName of Object.keys(indexes)) { // iterate through collections
    uniqueValues[dbName] = {} // create object for collection
    var collection = DB[dbName].find().fetch().slice(0) // get all documents
    for (i of indexes[dbName]) { // iterate through specified fields
      DB[dbName]._ensureIndex({[i]: 1}); // ensure this field is indexed
      // create array of unique values under this field
      uniqueValues[dbName][i] = [...new Set(collection.map(doc => doc[i]))]
    }
  }
  DB.Global.update({ // update the global reference
    id: "keyValues"
  }, {
    id: "keyValues",
    value: uniqueValues // with the new unique value arrays
  }, {
    upsert: true // if document doesn't exist, create it
  }, function(err) { // callback function
    if (err) {
      console.log(err) // log error if needed
    }
    else {
      console.log("key values updated")
    }
  })
});
