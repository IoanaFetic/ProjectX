import { defaultChartSettings } from '../imports/defaultChartSettings.js'
var months = [
  'January',
  'Feburary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

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

Meteor.publish('data',function(dbName){
    console.log('published to ', (Meteor.user()? Meteor.user().username: 'guest'))
  if(Meteor.user()){

    var userChartSettings = Meteor.user().chartSettings? Meteor.user().chartSettings: {} // user chart settings, if they exist
    var defaultChartSettings = DB.Global.findOne({id: "defaultChartSettings"})
    defaultChartSettings = defaultChartSettings.value || {} // default chart settings, if found (should be)
    var chartsWithUserSettings = [] // keep track of charts with custom settings (to ignore default)
    var filters = [] // build an array of filters to query for
    /* ie.
      ( "product" : [ "Pepper", "White Pepper" ], "brand" : ["Kamis"] )
      or
      ( "product" : [ "White Pepper" ], "brand" : ["Fuchs"] )
    */
    for(key of Object.keys(userChartSettings)){ // loop through chart IDs with custom settings
      if(key.match(dbName.toLowerCase()) && userChartSettings[key].filter){ // check it has a filter field
        chartsWithUserSettings.push(key) // add chart ID to array
        if(Object.keys(userChartSettings[key].filter).length > 0){ // check if filter has inputs
          filters.push(userChartSettings[key].filter) // add this filter to the filter array
        }
      }
    }
    for(key of Object.keys(defaultChartSettings)){
      // if chart ID was found in custom settings, don't get the default settings
      if(key.match(dbName.toLowerCase()) && defaultChartSettings[key].filter && chartsWithUserSettings.indexOf(key) == -1){
        if(Object.keys(defaultChartSettings[key].filter).length > 0){
          filters.push(defaultChartSettings[key].filter) // same as before, add to filter array
        }
      }
    }

    for(filter of filters){ // loop through all gathered filters
        for(key of Object.keys(filter)){
          if (key == "report_month") {
            // filtering by months, so convert string to month index
            for (m in filter[key]) {
              filter[key][m] = months.indexOf(filter[key][m])
            }
          }
          filter[key] = {$in: filter[key]} // change field arrays to mongoDB query format
        }
    }

    if(Meteor.user().admin){
      return DB[dbName].find({...{
        report_year: Meteor.user().selectedYear
      }, ...{$or: filters}}, {sort: {datetime: -1}}) // query for any of the filters
    }
    else {
      return DB[dbName].find({...{
        user: Meteor.user().username, // add extra filter, for only uploads by this user
        report_year: Meteor.user().selectedYear
      }, ...{$or: filters}}, {sort: {datetime: -1}})
    }
  }
  else {
    this.ready() // Not logged in, so return nothing
  }
})



var initialise = function() {
  var indexes = {
    Price: [
      'brand',
      'client_name',
      'report_month',
      'user',
      'product'
    ],
    Shelf: [
      'brand',
      'client_name',
      'report_month',
      'user',
      'city',
      'district',
      'salesman',
      'merchandiser',
      'value_type',
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

  DB.Global.update({
    id: "defaultChartSettings"
  }, {
    id: "defaultChartSettings",
    value: defaultChartSettings
  }, {
    upsert: true
  }, function(err) {
    if (err) {
      console.log(err)
    }
    else {
      console.log("chart settings imported")
    }
  })


}


Meteor.startup(initialise);
//Meteor.setInterval(initialise, 1000*60*60)
