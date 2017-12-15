const path = require('path');
const requireDir = require('require-dir');

const manifest = requireDir('../manifest');

const Net = require('./networks');

greeting = (user, sid) => {
    let options = Net.buildOpt('GET', manifest.services.apis.sunshine.host);
    let payload = Net.buildDiagObj();
    
    payload.appid = manifest.vendor.huaan.appid;
    payload.session = sid;
    payload.PersonName = user.name;
    payload.IDNo = user.id;
    payload.ServiceType = user.service;
    payload.Date = user.date;

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

talk = (text, sid) => {
    let options = Net.buildOpt('GET', manifest.services.apis.sunshine.host);
    let payload = Net.buildDiagObj();

    payload.appid = manifest.vendor.huaan.appid;
    payload.session = sid;

    payload.q = text;

    console.log('INCOMING REQUEST: \n'+ JSON.stringify(payload, null, 4));

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
}


_buildReply = () => {
    return {
        state: undefined,
        text: '抱歉，請再說一遍'
    }
}


const Dialog = {
    greeting,
    talk
}

module.exports = Dialog;
