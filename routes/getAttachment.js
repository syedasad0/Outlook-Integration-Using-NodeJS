var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
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
      console.log(result);
      res.json({ data: result.value[0].contentId, name: result.value[0].name });
      attachmentId = result.value[0].contentId;
      console.log('*************************************',attachmentId);
      console.log('________-----------___________', attachmentId);
      const result1 = await client
        .api('/me/messages/' + messageId + '/attachments/' + attachmentId)
        .get();
        //console.log('=========>>>>>>>>',result1);
        
    }

    catch (err) {
      console.log(err)
      parms.message = 'Error retrieving attachment';
      parms.error = { status: `${err.code}: ${err.message}` };
      parms.debug = JSON.stringify(err.body, null, 2);
      res.render('error', parms);
    }

    /*finally {
      const result = await client
        .api('/me/messages/' + messageId + '/attachments'+attachmentId)
        .get();
      console.log(result);
    }*/

  }


  else {
    // Redirect to home
    res.redirect('/');
  }
});



module.exports = router;