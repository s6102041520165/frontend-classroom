require("dotenv").config();
const { google } = require('googleapis');
const express = require('express')
const fs = require('fs')


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

app.post('/setCredential', function (req, res) {
    const accessToken = req.body;
    console.log(accessToken)

    if (oAuth2Client.setCredentials(accessToken)) {
        console.log('Set Success');
    } else console.log('Error')
    //console.log(oAuth2Client.getAccessToken())
    res.json({ status: 'Successfully', access_token: accessToken })

});

app.get('/redirect', function (req, res) {
    const code = req.query.code

    if (code) {

        oAuth2Client.getToken(code, async function (err, tokens) {
            if (err) {
                console.log('Error authenticating')
                console.log(err);
            } else {
                //console.log(tokens);
                await oAuth2Client.setCredentials(tokens);

            }
        });
        res.redirect('/logged')
    }

});

app.post('/getToken', async function (req, res) {

    /*const drive = google.drive({
        version: 'v3',
        auth: oAuth2Client
    });

    const response = await drive.files.create({
        requestBody: {
            name: 'Test',
            mimeType: 'text/plain'
        },
        media: {
            mimeType: 'text/plain',
            body: 'Hello World'
        }
    });*/
    try {

        const tokenInfo = await oAuth2Client.credentials
        console.log(tokenInfo)
        res.json(tokenInfo)
    } catch (err) {
        res.status(401).json({ message: 'Cannot Login With Google' })
    }

});


app.post('/upload', (req, res) => {
    if (req.files === null) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }


    try {
        const file = req.files.file;

        file.mv(`${__dirname}/../public/uploads/${file.name}`, err => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            } else {
                const drive = google.drive({
                    version: 'v3',
                    auth: oAuth2Client
                });


                var fileMetadata = {
                    'name': file.name,
                };

                var media = {
                    mimeType: file.mimetype,
                    body: fs.createReadStream(`${__dirname}/../public/uploads/${file.name}`)
                };

                drive.files.create({
                    resource: fileMetadata,
                    media: media,
                    fields: 'id'
                }, function (err, resFile) {
                    if (err) {
                        // Handle error
                        console.error(err);
                    } else {
                        console.log('File:', resFile.data);
                        res.json(resFile.data)
                    }
                });
            }
        });

    } catch (error) {
        res.json(401).status({message:'Permission Access Denined'})
    }

})


module.exports = app;