var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
let responses = require('../helpers/responses');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

router.post('/', async function (req, res, next) {

  let toEmails = req.body.to;
  let emailSubject = req.body.subject;
  let emailBody = req.body.message;
  let fileName=req.body.fileName;
  let ContentBytes=req.body.ContentBytes

  let recipientData = [];

  //SPLIT FOR MULTIPLE EMAILS
  let multipleEmails = toEmails.split(',')
  if (multipleEmails && multipleEmails.length > 0) {
    multipleEmails.forEach((x) => {
      x = x.trim();
      if (x) {
        recipientData.push(
          {
            "EmailAddress": {
              "Address": x
            }
          }
        )
      }
    })
  }


  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  let parms = { title: 'Inbox', active: { inbox: true } };
  if (accessToken && userName) {
    parms.user = userName;

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });
    console.log('--------------------------',client);
    console.log('--------------------------',Client);

    try {
      let mailOptions = {
        "Message": {
          "Subject": emailSubject,
          "Body": {
            "ContentType": "HTML",
            "Content": emailBody
          },
          "ToRecipients": recipientData,
          // [
          //   {
          //     "EmailAddress": {
          //       "Address": toEmails
          //     }
          //   }
          // ],
          "Attachments": [
            {
              "@odata.type": "#Microsoft.OutlookServices.FileAttachment",
              "Name": fileName,
              "ContentBytes": ContentBytes.toString()
            }
          ]
        },
        "SaveToSentItems": "true"
      };
      try {
        let response = await client.api("/me/sendMail").post(mailOptions, (err, res) => {
          console.log("Message Sent -- ", err, res);
        });
      } catch (error) {
        throw error;
      }

    } catch (err) {
      console.log("Error Occured -- ", err)
      parms.message = 'Error retrieving messages';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }

    res.send(responses.sendResponse(responses.statusCodes.SUCCESS, responses.responseMessages.SUCCESS, {}))

  } else {
    // Redirect to home
    res.redirect('/');
  }

});

module.exports = router;