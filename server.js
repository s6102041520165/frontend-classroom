const express = require("express");
const favicon = require("express-favicon");
const path = require("path");
const port = process.env.PORT || 80;
const app = express();
var bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
app.use(fileUpload());
/* const studentSubmit = require('./api/StudentSubmit');
const test = require('./api/test'); */


app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(favicon(__dirname + "/build/favicon.ico"));
// the __dirname is the current directory from where the script is running
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, "build")));

app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file Uploaded' });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err)
      return res.status(500).send(err)
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  })

})

/* app.use("/api/", studentSubmit)
app.use("/test/", test) */

app.get("/ping", function (req, res) {
  return res.send("pong");
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(port, () => console.log(`Application listen on port : ${port}`));
