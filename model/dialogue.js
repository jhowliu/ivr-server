const path = require('path');
const requireDir = require('require-dir');

const manifest = requireDir('../manifest');

const Net = require('./networks');

talk = (user, sid) => {
    let options = Net.buildOpt('GET', manifest.vendor.rueitai.host);
    let payload = Net.buildDiagObj();
    
    payload.appid = manifest.vendor.rueitai.appid;

    if (sid) {
        payload.session = sid;
    }

    options.qs = payload;

    return new Promise( (resolve, reject) => {
        Net.invokeApi(options, (res, body) => {
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

_buildReply = () => {
    return {
        state: undefined,
        text: '抱歉，請再說一遍'
    }
}


const Dialog = {
    talk
}

module.exports = Dialog;
