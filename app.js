const express = require('express'),
      bodyParser = require('body-parser'),
      requireDir = require('require-dir'),
      multer = require('multer'),
      jwt = require('jsonwebtoken'),
      cors = require('cors');

const app = express();

const path = require('path');
const manifest = requireDir(path.resolve(process.argv[2]));

const Dialog = require('./model/dialogue');

let SESSIONS = []; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer().any())

app.use(cors());

app.post('/token', (req, res) => {
    const user = req.body.user || req.query.user

    if (user === manifest.partner.user) {
        var token = jwt.sign({user: user}, manifest.partner.secret, {
            expiresIn: 60*60*24*60
        })

        res.json({
            success: true,
            message: 'Enjoy your token',
            token: token
        })
    } else {
        res.json({ success: false, message: 'Authenticate failed. User not found.' }) 
    }
});

app.post('/greeting', verifyToken, (req, res) => {
    const sid = req.body.sid || req.query.sid;
    const user = req.body.user;

    const id = user.id;
    const name = user.name;
    const service = user.service;
    const date = user.date;

    if (!user) {
        return res.json({ success: false, message: 'user no given.' });
    }

    if (!id || !name || 
        !service || !date) {
        return res.json({ success: false, message: 'user payload is not completed.' });
    }

    if (!sid) {
        return res.json({ success: false, message: 'session id no given.' });
    }

    Dialog.greeting({
        id: id,
        name: name,
        date: date,
        service: service
    }, sid).then( (reply) => {
        return res.json({ success: true, sid: sid, data: reply });
    }).catch( (reply) => {
        return res.json({ success: true, sid: sid, data: reply });
    });
})

// text in text out
app.post('/talk', verifyToken, (req, res) => {
    const text = req.body.text || req.query.text;
    const sid  = req.body.sid || req.query.sid;

    if (!text || !sid) {
        return res.json({ success: false, message: 'some parameters no given'});
    }

    // send the text to dialogue api
    Dialog.talk(text, sid).then( (reply) => {
        return res.json({ success: true, sid: sid, data: reply });
    }).catch( (reply) => {
        return res.json({ success: true, sid: sid, data: reply });
    });
});


// middleware to verify incoming token
function verifyToken(req, res, next) {
    console.log(req.body)
    const token = req.body.token || req.query.token

    if (token) {
        jwt.verify(token, manifest.partner.secret, function (err, decode) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'})
            } else {
                return next()
            }
        });
    } else {
        return res.json({success: false, message: 'No token provided.'})
    }
}
app.listen(manifest.config.app.port, () => {
    console.log(`Listening on port ${manifest.config.app.port}!`);
});
