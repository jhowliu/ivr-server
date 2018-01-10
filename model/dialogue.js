const path = require('path');
const requireDir = require('require-dir');

const manifest = requireDir('../manifest');

const Net = require('./networks');

greeting = (meta, sid) => {
    let options = Net.buildOpt('GET', manifest.services.apis.sunshine.host);
    let payload = Net.buildDiagObj();
   
    payload.appid = manifest.vendor.huaan.appid;
    payload.session = sid;
    payload.Q3Condition = meta.condition;
    payload.OpNo = meta.robotId;
    payload.ReportDate = meta.reportDate;
    // user
    payload.IDNo = meta.user.id;
    payload.CarNo = meta.user.car_id;
    payload.PersonName = meta.user.name;
    // accident
    payload.AccExp = meta.user.accident.name;
    payload.Date = meta.user.accident.date;
    payload.Place = meta.user.accident.place;
    // payment
    payload.PayDate = meta.user.payment.date;
    payload.JQPayment = meta.user.payment.TCI;
    payload.CIPayment = meta.user.payment.VCI;

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

            if (res && res.statusCode == 200 && body) {
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
