const express = require("express");
const favicon = require("express-favicon");
const cors = require('cors')
const path = require("path");
const port = process.env.PORT || 80;
const app = express();
const user = require("./route/user")
var bodyParser = require('body-parser')
/**Import Connection to mongodb */
require("./config/db")
const fileUpload = require('express-fileupload')
const googleAuth = require('./auth/index')
app.use(fileUpload());
/* const studentSubmit = require('./api/StudentSubmit');
const test = require('./api/test'); */


app.use(bodyParser.urlencoded({ extended: false }))


// parse application/json
app.use(cors());
app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));

app.use('/user', user)
app.use('/auth', googleAuth)


/* app.use("/api/", studentSubmit)
app.use("/test/", test) */

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(port, () => console.log(`Application listen on port : ${port}`));
