require("dotenv").config();
const { google } = require('googleapis');
const express = require('express')


const app = express()


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.GOOGLE_DIRECT_URI;
//const REDIRECT_URL = "http://localhost:5000/webhook/auth/google/redirect";

var oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
var authed = false;

google.options({
    auth: oAuth2Client
});


app.get('/', (req, res) => {
    if (!authed) {
        // Generate an OAuth URL and redirect there
        const url = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.topics https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata']
        });
        //console.log(url + "&lineUserId=" +req.params.lineUserId);
        res.redirect(url);
    } else {
        
        //echoBot.reply(reply_token, "Authenticated successful.", userId);
        res.sendStatus(200);
    }
})

app.get('/redirect', function (req, res) {
    const code = req.query.code

    if (code) {
        // Get an access token based on our OAuth code

        oAuth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                //console.log(tokens);
                oAuth2Client.setCredentials(tokens);
                authed = true;
                res.redirect('/auth/')
            }
        });
    }
});

module.exports = app;