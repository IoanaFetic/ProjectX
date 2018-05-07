Accounts.onCreateUser(function(options, user) {
  var keyValues = DB.Global.findOne({
    id: "keyValues"
  })
  var years = keyValues.value.Price.report_year
  user.selectedYear = 2016 //years.sort()[years.length - 1]
  user.chartSettings = {}
  return user
})
