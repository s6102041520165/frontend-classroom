const express = require("express")
const app = express();
const User = require('../Schema/User')
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,POST,UPDATE,DELETE");
    next();
});

app.get('/', function (req, res) {
    User.find().exec((err, data) => {
        if (err) return res.status(400).json(err);
        res.status(200).json(data);
    })
})

app.post('/checkUser', urlencodedParser, function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    const insert_data = {
        google_id: req.body.google_id,
        line_id: (req.body.line_id) ? req.body.line_id : "",
        f_name: (req.body.f_name) ? req.body.f_name : "",
        l_name: (req.body.l_name) ? req.body.l_name : "",
    };

    //res.status(200).json(req.body)
    User.findOne({ google_id: req.body.google_id }).select('google_id line_id').exec(async function (err, data) {
        if (!err && data === null) {
            User.create(insert_data).then((response) => {
                console.log(`Created user data.`)
                //console.log(response)
                res.status(200).json(response)
            }).catch((err) => {
                console.log(err)
                res.status(200).json()
            })
        } else {
           User.findByIdAndUpdate(data._id,{line_id: req.body.line_id}).then((response) => {
               console.log(response)
               res.status(200).json(response)
           })
        }
        
    })

})


app.post('/updateUser', urlencodedParser, function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    
    try {
        console.log('Line Id : ' + req.body.line_id)
        const insert_data = {
            google_id: req.body.google_id,
            line_id: (req.body.line_id) ? req.body.line_id : "",
            f_name: (req.body.f_name) ? req.body.f_name : "",
            l_name: (req.body.l_name) ? req.body.l_name : "",
        };
        //res.status(200).json(req.body)
        User.findOne({ google_id: req.body.google_id }).select('google_id line_id').exec(async function (err, data) {
            console.log(data)
            if (data === null) {
                User.create(insert_data).then((response) => {
                    res.status(200).json(response)
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json(err)
                })
            }
            res.status(404).json(data)
        })
        res.status(200).json({ msg: 'updated' })
    } catch (error) {
        res.send(error)
    }


})

module.exports = app;