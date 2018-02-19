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
