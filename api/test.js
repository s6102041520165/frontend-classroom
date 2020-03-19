const express = require('express');
const { google } = require('googleapis');
const fs = require('fs')
const app = express();

const oauth2Client = new google.auth.OAuth2(
    '308789454611-isrob12j0f3l23meqnl8959lvdfgdg67.apps.googleusercontent.com',
    'v-_5N09bLsRf3nsNYje1b4PR',
    'http://localhost/redirect'
);

app.get('/', async(req, res) => {
    var tokens = 'ya29.a0Adw1xeX12XNfbSEnCHzfL11It3756HsO3mylvIbqAlNGnZQMLS64V99zioXH5raHWs6YwxlEaOxiWNZA9MxI9_WzcPDEtW457-dh4IUk5sxqXEhlbpSlDHltRiWz-fNTaTaIpSqBU4o9Prfh7BsXKHIgSgVpJp5pRzx4BIUdbM57IKLAosq_6VPgxdIGhcpg3SODjzLsxezB_nRG0m0R';

    oauth2Client.setCredentials(tokens);

    await google.options({
        auth: oauth2Client
    });


    oauth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
            // store the refresh_token in my database!
            console.log(tokens.refresh_token);
        }
        console.log(tokens.access_token);
    });

    /*const drive = google.drive({
        version: 'v3',
        auth: { access_token: 'ya29.a0Adw1xeVKl1Tp5gMOKVIH0nTh1DQ3pEMiO321iRj4OurNRpPf560ReQmw76UeVwgZdr_eLYzmGyqzd7UoY9SNv7G_5_Qw8eoBTrFY-qzQdlxeLy-Ux1dsVDjCXtM8A947OFItFC823syTNqT-ZE486sFynt5e9AfcrQLMA-xklqTMpH42Ld8E8FE_TjtrIkKrvSsMbK9jYUOoRYNmGQch' },
    });*/



    var fileMetadata = {
        'name': 'photo.png'
    };
    var media = {
        mimeType: 'image/png',
        body: fs.createReadStream('files/Picture1.png')
    };


    /* drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    }, function (err, file) {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.id);
        }
    }); */
});

module.exports = app;