import RequireDir from 'require-dir';
import PayloadFactory from '../factory';

import {
  BuildOpt,
  InvokeApi
} from './networks';

const manifest = RequireDir('../manifest');

export const Talk = (msg) => {
  const payload = PayloadFactory.createPayload(msg);
  console.log(`Incoming Message:\n${JSON.stringify(payload, null, 4)}\n`);

  return new Promise((resolve, reject) => {
    if (!(msg.appid in manifest.vendor)) {
      return reject({ message: `The given appid: '${msg.appid}' has not found.`});
    }
    const options = BuildOpt('GET', manifest.services.dialogue.host);
    options.qs = payload;
    console.log(JSON.stringify(options))
    InvokeApi(options, (res, body) => {
      let reply = buildReply();
      console.log(`Incoming Reply:\n${JSON.stringify(body, null, 4)}\n`);

      if (res.statusCode === 404) {
        return reject({ message: `The given appid: '${msg.appid}' has not found.`});
      }
      if (res.statusCode === 500) {
        return reject({ message: '500 Interal error.' });
      }

      if (body) {
        reply.state = body.dialogue_state;
        reply.text = body.dialogueReply;
        resolve({ data: reply });
      } else {
        reject({ message: 'something went wrong from dialogue api.' });
      }
    });
  });
};

const buildReply = () => ({
  state: undefined,
  text: '抱歉，請再說一遍'
});
