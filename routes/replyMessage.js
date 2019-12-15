var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
let responses = require('../helpers/responses');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

//ADD Attachment API TESTING 

/*router.post('/addAttachment', async function(req, res, next) {
    let parms = { title: 'Inbox', active: { inbox: true } };
  
    const accessToken = await authHelper.getAccessToken(req.cookies, res);
    const userName = req.cookies.graph_user_name;
  
    let messageId = req.body.messageId;
  
    if (accessToken && userName) {
      parms.user = userName;
  
      // Initialize Graph client
      const client = graph.Client.init({
        authProvider: (done) => {
          done(null, accessToken);//ADD Attachment API TESTING 

router.post('/addAttachment', async function(req, res, next) {
  let parms = { title: 'Inbox', active: { inbox: true } };

  const accessToken = await authHelper.getAccessToken(req.cookies, res);
  const userName = req.cookies.graph_user_name;

  let messageId = req.body.messageId;

  if (accessToken && userName) {
    parms.user = userName;

    // Initialize Graph client
    const client = graph.Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      }
    });

    const attachment = {
      //@odata.type: "#microsoft.graph.fileAttachment",
      name: "smile",
      contentBytes: "R0lGODdhEAYEAA7"
    };

    try {
      const result = await client
      .api('/me/messages/'+messageId+'/attachments')
      .post(attachment);
      logger.log(result);
      
      //res.json({ data: result.body.content, senderData: result.sender.emailAddress});
    } catch (err) {
      logger.log(err)
      parms.message = 'Error retrieving messages';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }
    
  } else {
    // Redirect to home
    res.redirect('/');
  }
});

        }
      });
  
      const attachment = {
        //@odata.type: "#microsoft.graph.fileAttachment",
        name: "smile",
        contentBytes: "R0lGODdhEAYEAA7"
      };
  
      try {
        const result = await client
        .api('/me/messages/'+messageId+'/attachments')
        .post(attachment);
        logger.log(result);
        
        //res.json({ data: result.body.content, senderData: result.sender.emailAddress});
      } catch (err) {
        logger.log(err)
        parms.message = 'Error retrieving messages';
        parms.error = { status: `${err.code}: ${err.message}` };
        parms.debug = JSON.stringify(err.body, null, 2);
        res.render('error', parms);
      }
      
    } else {
      // Redirect to home
      res.redirect('/');
    }
  });*/
  

router.post('/', async function (req, res, next) {

    let toEmails = req.body.toRecepient;
    let emailBody = req.body.message;
    let messageId = req.body.messageId;

    let recipientData = [];

  //SPLIT FOR MULTIPLE REPLY
  let multipleReply = toEmails.split(',')
  if (multipleReply && multipleReply.length > 0) {
    multipleReply.forEach((x) => {
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

    let parms = { title: 'Reply', active: { reply: true } };
    if (accessToken && userName) {
        parms.user = userName;

        // Initialize Graph client
        const client = graph.Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            }
        });
        logger.log('<<<<<<<<<<<<<<<CLIENT>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

        try {
            let reply = {
                message: {
                    toRecipients: recipientData /*[
                        {
                            emailAddress: {
                                address: toAddress
                            }
                        }
                    ]*/
                },
                comment: emailBody
            };
            logger.log(reply);
            try {
                let response = await client.api('me/messages/' + messageId + '/reply').post(reply, (err, res) => {
                    logger.log("Message Sent -- ", err, res);
                    logger.log("*********************");
                    logger.log(messageId);
            
                });
            } catch (error) {
                throw error;
            }

        } catch (err) {
            logger.log("Error Occured -- ", err)
            parms.message = 'Error Sending Messages';
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
