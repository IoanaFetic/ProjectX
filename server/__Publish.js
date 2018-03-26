DB = {
  Price: new Mongo.Collection ('price'),
  Shelf: new Mongo.Collection ('shelf'),
  Global: new Mongo.Collection ('global')
}
Meteor.publish('global',function(){
  return DB.Global.find()
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

  for (dbName of Object.keys(indexes)) {
    uniqueValues[dbName] = {}
    var collection = DB[dbName].find().fetch().slice(0)
    for (i of indexes[dbName]) {
      DB[dbName]._ensureIndex({[i]: 1});
      uniqueValues[dbName][i] = [...new Set(collection.map(doc => doc[i]))]
    }
  }

  DB.Global.update({
    id: "keyValues"
  }, {
    id: "keyValues",
    value: uniqueValues
  }, {
    upsert: true
  }, function(err) {
    if (err) {
      console.log(err)
    }
    else {
      console.log("key values updated")
    }
  })


});
