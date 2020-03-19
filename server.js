const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const port = process.env.PORT || 80;
const app = express();
var bodyParser = require('body-parser')
/* const studentSubmit = require('./api/StudentSubmit');
const test = require('./api/test'); */


app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));

/* app.use("/api/", studentSubmit)
app.use("/test/", test) */

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(port, () => console.log(`Application listen on port : ${port}`));
