import RequireDir from 'require-dir';
import PayloadFactory from '../factory/payload';

import {
  BuildOpt,
  InvokeApi
} from './networks';

const manifest = RequireDir('../manifest');

export const Talk = (msg) => {
  const payload = PayloadFactory.createPayload(msg.appid, msg);
  console.log(`Incoming Message:\n${JSON.stringify(payload, null, 4)}\n`);

  return new Promise((resolve, reject) => {
    if (!(msg.appid in manifest.vendor)) {
      reject({ message: `The given appid: '${msg.appid}' has not found.`});
    }
    const options = BuildOpt('GET', manifest.vendor[msg.appid].host);
    options.qs = payload;

    InvokeApi(options, (res, body) => {
      let reply = buildReply();
      console.log(`Incoming Reply:\n${JSON.stringify(body, null, 4)}\n`);

      if (res.statusCode === 404) {
        reject({ message: `The given appid: '${msg.appid}' has not found.`});
      }

      if (body) {
        reply.state = body.dialogue_state;
        reply.text = body.dialogueReply;
        resolve({ data: reply });
      } else {
        reject({ message: '500 Interal error.' });
      }
    });
  });
};

const buildReply = () => ({
  state: undefined,
  text: '抱歉，請再說一遍'
});