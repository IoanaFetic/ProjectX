DB = {
  Price: new Mongo.Collection ('price'),
  Shelf: new Mongo.Collection ('shelf')
}

Meteor.publish('price',function(){
  return DB.Price.find()
})

Meteor.publish('shelf',function(){
  return DB.Shelf.find()
})


Meteor.startup(function () {
  var indexes = {
    Price: ['client_name','report_month', 'report_type', 'upload_id', 'user', 'report_year', 'package_type'],
    Shelf: ['client_name','report_month', 'report_type', 'upload_id', 'user', 'report_year', 'value_type']
  }
  for(db of Object.keys(indexes)){
    for(i of indexes[db]){
      DB[db]._ensureIndex({ [i]: 1});
    }
  }
});
