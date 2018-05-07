var nodemailer = require('nodemailer');

Meteor.methods({
  batchInsert(documents, dbName) {
    Meteor.setTimeout(function(documents, dbName){
      if (documents.length > 0) {
        DB[dbName].batchInsert(documents) // mikowals/batch-insert for performance boost. 1 sheet at a time instead of 1 document.
      }
    }.bind(this, documents, dbName), 2000)
  },
  fileInsert(file) {
    DB.Uploads.insert(file)
  },
  removeEntry(report_type, upload_id) {
    DB[report_type].remove({
      upload_id
    }, {
      multi: true
    })
    DB.Uploads.remove({
      upload_id: upload_id
    }, {
      multi: true
    })
  },
  removeMonthYear(report_type, query) {
    DB[report_type].remove(query, {
      multi: true
    })
    DB.Uploads.remove({
      ...query,
      ...{
        report_type
      }
    }, {
      multi: true
    })
  },
  updateUser(path, value) {
    Meteor.users.update(Meteor.userId(), {
        $set: {
          [path]: value
        }
      },
      function(err) {
        if (err) {
          console.log(err)
        } else {
          //console.log("user updated:", path, ":", value)
        }
      }
    )
  },
  sendEmail(subject, message) {
    // https://medium.com/@manojsinghnegi/sending-an-email-using-nodemailer-gmail-7cfa0712a799
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kamis.dashboard@gmail.com',
        pass: '=Condimente916'
      }
    });
    const mailOptions = {
      from: 'kamis.dashboard@gmail.com',
      to: 'ioanafetic@gmail.com',
      subject,
      html: (
        '<span style="font-family: Calibri; font-size: 12pt;">' +
        message +
        '<br/><br/><br/><hr/>' +
        '<div style="font-family: Consolas; font-size: 10pt; margin: 10px;">An automatic email from the <b>Kamis Dashboard</b></div></span>'
      )
    };
    transporter.sendMail(mailOptions, function(err, info) {
      if (err)
        console.log(err)
      else
        console.log(info);
    });
  }
})
