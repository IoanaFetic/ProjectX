

Meteor.call('batchInsert', // method name
documents, // document array to insert
parameters[meta.report_type].dbName, // DB to add to
 function(f, f2, desc) { // callback after insert
  Meteor.call('fileInsert', f2) // add file meta data to uploads DB
  this.filesToEmail.push(desc) // drafting the email
  this.dz.removeFile(f) // remove element from dropzone
}.bind(this, file, completeFile, ( // bind variables for use within callback
  meta.report_type + " report for " +
  ref.months[meta.report_month] + " " + meta.report_year
)))
