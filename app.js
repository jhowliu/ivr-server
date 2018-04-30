import Cors from 'cors';
import Path from 'path';
import Multer from 'multer';
import Express from 'express';
import BodyParser from 'body-parser';
import RequireDir from 'require-dir';

import {
  Talk
} from './model/dialogue';
import {
  VerifyBody
} from './middleware';

const app = Express();
const manifest = RequireDir(Path.resolve(process.argv[2]));

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
  extended: false
}));
app.use(Multer().any())

app.use(Cors());

app.post('/talking', VerifyBody, (req, res) => {
  const { sid } = req.sid;

  Talk(req)
    .then(reply => {
      return res.json({
        success: true,
        sid: sid,
        data: reply.data
      });
    }).catch(err => {
      return res.json({
        success: false,
        message: err.message
      });
    });
})


app.listen(manifest.config.app.port, () => {
  console.log(`Listening on port ${manifest.config.app.port}!`);
});