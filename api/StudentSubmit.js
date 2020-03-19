const express = require("express");
const app = express();

app.get('/studentSubmit', function (req, res) {
    console.log(res.body)
    //let userId = req.body.events[0].source.userId;
    // msg = req.body.events[0].message.text;
    return res.send("student submitsion");
})

module.exports = app;