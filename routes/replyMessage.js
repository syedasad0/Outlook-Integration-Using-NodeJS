var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth');
var graph = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

router.post('/', async function (req, res, next) {

    let toEmails = req.body.to;
    let emailSubject = req.body.subject;
    let emailBody = req.body.message;
    let messageId = req.body.messageId;
    let toAddress=req.body.toAddress;
    console.log(">>>>>>>>>>>>Reply Mail API")

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
        console.log('<<<<<<<<<<<<<<<CLIENT>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

        try {
            let reply = {
                message: {
                    toRecipients: [
                        {
                            emailAddress: {
                                address: toAddress
                            }
                        }
                    ]
                },
                comment: emailBody
            };
            console.log(reply);
            try {
                let response = await client.api('me/messages/' + messageId + '/reply').post(reply, (err, res) => {
                    console.log("Message Sent -- ", err, res);
                    console.log("*********************");
                    console.log(messageId);
            
                });
            } catch (error) {
                throw error;
            }

        } catch (err) {
            console.log("Error Occured -- ", err)
            parms.message = 'Error Sending Messages';
            parms.error = { status: `${err.code}: ${err.message}` };
            parms.debug = JSON.stringify(err.body, null, 2);
            res.render('error', parms);
        }

        res.send("Done")

    } else {
        // Redirect to home
        res.redirect('/');
    }

});

module.exports = router;