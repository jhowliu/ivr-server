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

    if (user === manifest.meta.user) {
        var token = jwt.sign({user: user}, manifest.meta.secret, {
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
    const robotId = req.body.bot_id;
    const reportDate = req.body.report_date;
    const condition = req.body.condition;

    // user payload
    const user = req.body.user;
    // payment payload
    const payment = user.payment;
    // accident payload
    const accident = user.accident;

    console.log(JSON.stringify(req.body, null, 2));

    if (!robotId || !reportDate || !condition) {
        return res.json({ success: false, message: 'parameters is not completed, please check api document.' });
    }

    if (!user) {
        return res.json({ success: false, message: 'user payload no given.' });
    }

    if (!sid) {
        return res.json({ success: false, message: 'session id no given.' });
    }

    if (!user.id || !user.name || !user.car_id) {
        return res.json({ success: false, message: 'user payload is not completed.' });
    }

    if (!payment || !payment.date || !payment.TCI || !payment.VCI) {
        return res.json({ success: false, message: 'payment payload is not completed.' });
    }

    if (!accident || !accident.date || !accident.place || !accident.name) {
        return res.json({ success: false, message: 'accident payload is not completed.' });
    }


    Dialog.greeting({
        sid: sid,
        robotId: robotId,
        reportDate: reportDate,
        condition: condition,
        user: user
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
    const token = req.body.token || req.query.token

    if (token) {
        jwt.verify(token, manifest.meta.secret, function (err, decode) {
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
