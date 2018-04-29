"username" : "admin",
    "admin" : true,
    "chartSettings" : {
        "bar_chart" : {
            "filter" : {
                "product" : [
                    "Sea Salt"
                ],
                "report_month" : [
                    "March"
                ]
            },
            "sort" : "brand"
        },
        "price_main" : {
            "filter" : {
                "product" : [
                    "Pepper",
                    "White pepper"
                ],
                "client_name" : [
                    "Auchan"
                ],
                "brand" : [
                    "Kamis"
                ]
            },
            "sort" : "brand"
        },
    },
    "selectedYear" : 2016


var query = this.convertToQuery(
  JSON.stringify(userSettings && userSettings.filter || settings && settings.filter || {})
)
var sortValue = (userSettings && userSettings.sort || settings && settings.sort || '')
if (Object.keys(query).length > 0) { // search filters were found
  var results = DB[this.props.dbName].find(query).fetch() // query the DB
  var data = this.gatherData(results, sortValue) // send results to be sorted by value
} else {
  var data = {}
}




gatherData(data, sortKey) {
  var dataObj = {} // temporary object to collate documents from DB
  var firstMonth = 11 // to be updated with earliest month found
  var lastMonth = 0 // to be updated with latest month found
  for (doc of data) { // loop through filtered documents in DB
    var sortEntry = doc[sortKey] // the value this document will be sorted by
    var valueEntry = doc['value'] // e.g. shelf price
    if (sortEntry && !isNaN(parseFloat(valueEntry))) { // check value is numerical
      if (!dataObj[sortEntry]) { // if no document with the sort value has been found yet
        dataObj[sortEntry] = { // initiate field in dataObj with group as the key
          n: new Array(12).fill(0), // array of 0s (number of documents found)
          t: new Array(12).fill(0) // array of 0s (total of values)
        }
      }
      // execute code below for all valid documents
      var docMonth = doc.report_month // month of document
      dataObj[sortEntry].n[docMonth]++ // add to count for this sorted group (ie. Kamis)
      dataObj[sortEntry].t[docMonth] += valueEntry // add to value sum for this group
      firstMonth = Math.min(firstMonth, docMonth) // update earliest month
      lastMonth = Math.max(lastMonth, docMonth) // update latest month
      dataObj[sortEntry].firstMonth = parseInt(firstMonth)
      dataObj[sortEntry].lastMonth = parseInt(lastMonth)
    }
  }
  return dataObj
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











saveSettings() {
  if (JSON.stringify(this.state.settings) == this.origSettings) {
    //default settings set, so removing user specific settings
    var newSettings = Meteor.user().chartSettings || {}
    delete newSettings[this.props.id]
    Meteor.call("updateUser", "chartSettings", newSettings, function(){
      this.props.resubscribe()
    }.bind(this))
  }
  else {
    //saving user specific settings
    Meteor.call("updateUser", "chartSettings." + this.props.id, this.state.settings, function(){
      this.props.resubscribe()
    }.bind(this))
  }
  if (this.state.selectedYear) {
    Meteor.call('updateUser', 'selectedYear', this.state.selectedYear, function(){
      this.props.resubscribe()
      //year changed, resubscribe
    }.bind(this))
  }
  this.props.toggleSettings()
}
