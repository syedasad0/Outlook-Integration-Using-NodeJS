var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
let responses = require('../helpers/responses');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');


router.post('/', async function (req, res, next) {
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

    try {
      const result = await client
        .api('/me/messages/' + messageId + '/attachments')
        .get();
      //logger.log(result);
      res.send(responses.sendResponse(responses.statusCodes.SUCCESS, responses.responseMessages.SUCCESS, 
      {
        data: result.value[0].id, 
        name: result.value[0].name
      }));
  
      attachmentId = result.value[0].id;
      //logger.log('*************************************',attachmentId);
      //logger.log('=======================>>>>>>>>>>>>>>>>', messageId);
      //logger.log(result);
      if (req.body.message || !req.body.message) {
        const result1 = await client
          .api('/me/messages/' + messageId + '/attachments/' + attachmentId + '/?$expand=microsoft.graph.itemattachment/item')
          .get();
        //logger.log(result1);

        if (result1.contentType === 'text/plain') {
          logger.log('=========>>>>>>>>', result1.contentBytes);
          let buff = new Buffer(result1.contentBytes, 'base64');
          logger.log(buff.toString('ascii'));

        } else {
          logger.log(JSON.stringify(result1));

        }
      }
    }

    catch (err) {
      logger.log(err)
      parms.message = 'Error retrieving attachment';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }

  }


  else {
    res.redirect('/');
  }
});



module.exports = router;
