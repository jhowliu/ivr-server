import Cors from 'cors';
import Path from 'path';
import Multer from 'multer';
import Express from 'express';
import BodyParser from 'body-parser';
import RequireDir from 'require-dir';

import { talk } from './model/dialogue';
import { verifyBody } from './model/middleware';

const app = Express();
const manifest = RequireDir(Path.resolve(process.argv[2]));

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use(Multer().any())

app.use(Cors());

app.post('/greeting', verifyBody, (req, res) => {
    const sid = req.sid;
    const appid = req.appid;
    const user = req.user;
    const robotId = req.bot_id;
    const reportDate = req.report_date;
    const condition = req.condition;

    talk({ appid, sid, user, condition, robotId, reportDate })
        .then( reply => {
            return res.json({ success: true, sid: sid, data: reply });
        }).catch( reply => {
            return res.json({ success: true, sid: sid, data: reply });
        });
})

// text in text out
app.post('/talk', (req, res) => {
    const sid  = req.body.sid || req.query.sid;
    const text = req.body.text || req.query.text;

    if (!text || !sid) {
        return res.json({ success: false, message: 'some parameters no given'});
    }

    // send the text to dialogue api
    talk({ text, sid })
        .then( reply => {
            return res.json({ success: true, sid: sid, data: reply });
        }).catch( reply => {
            return res.json({ success: true, sid: sid, data: reply });
        });
});

app.listen(manifest.config.app.port, () => {
    console.log(`Listening on port ${manifest.config.app.port}!`);
});
