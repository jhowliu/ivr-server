import RequireDir from 'require-dir';

import { buildOpt, invokeApi } from './networks';
import { buildHuaanPayload } from './huaan';
import { buildRuitaiPayload } from './ruitai';

const manifest = RequireDir('../manifest');

export const talk = (msg) => {
    let payload = undefined;
    const options = buildOpt('GET', manifest.vendor[msg.appid].host);

    switch (msg.appid) {
        case 'huaan':
            payload = buildHuaanPayload(msg);
        case 'ruitai':
            payload = buildRuitaiPayload(msg);
        default:
            break;
    }

    payload.appid = manifest.vendor[msg.appid].appid;
    payload.session = msg.sid;

    payload.q = msg.text;

    options.qs = payload;

    return new Promise( (resolve, reject) => {
        invokeApi(options, (res, body) => {
            console.log("INCOMING REPLY: \n" + JSON.stringify(body, null, 4));

            let reply = _buildReply();

            if (body) {
                reply.state = body.dialogue_state;
                reply.text = body.dialogueReply;
                resolve(reply);
            } else {
                reject(reply);
            }
        });
    });
};

const _buildReply = () => {
    return {
        state: undefined,
        text: '抱歉，請再說一遍'
    }
}

