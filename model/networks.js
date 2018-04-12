import Request from 'requestretry'
import RequireDir from 'require-dir';

import { getFileInBuffer } from './utils';

const manifest = RequireDir('../manifest');

// Invoke request
export const invokeApi = (requestOpts, callback) => {
    Request(requestOpts, function(err, res, body) {
        callback(res, body);
    });
}

// build options for requests
export const buildOpt = (method, host, json=true) => {
    const options = {
        method: method,
        uri: host,
        headers: undefined,
        body: undefined,
        form: undefined,
        json: json,
        maxAttempts: 5,
        retryStrategy: Request.RetryStrategies.HTTPOrNetworkError
    };

    return options
}

export const buildAuthObj = function () {
    return {
        grant_type: 'client_credentials',
        client_id: manifest.vendor.id,
        client_secret: manifest.vendor.secret
    }
}

export const buildTextObj = (text, token) => {
    return {
        tex  : text.toString('utf8'),
        lan  : 'zh',
        ctp  : 1,
        spd  : 4,
        cuid : manifest.vendor.app.id,
        tok  : token
    }
}

// session, appid are required
export const buildDiagObj = () => {
    return {
        q: undefined,
        session: undefined,
        appid: undefined,
        PersonName: undefined,
        IDNo: undefined,
        ServiceType: undefined,
        Date: undefined,
    }
}

export const buildVoiceObj = (filename, format, rate, token) => {
    const buffer = getFileInBuffer(filename); // return buffer in bytes

    return {
        channel: 1,
        format : format,
        rate   : rate,
        token  : token,
        cuid   : manifest.vendor.app.id,
        len    : buffer.length,
        speech : buffer.toString('base64'),
    }
}


export const sendCallback = (sid, binary, callbackURL, callback) => {
    let options = buildOpt('POST', callbackURL)  

    // Avoiding some package parse to utf-8
    options.body = { 
        'sid' : sid,
        'data': binary.toString('base64') 
    };
    
    this.invokeApi(options, function(res, body) {
        callback(res, body);
    });
}
