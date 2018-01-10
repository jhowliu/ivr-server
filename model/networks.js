const request = require('requestretry');
const requireDir = require('require-dir');

const utils = require('./utils');

let manifest = requireDir('../manifest');

// Invoke request
module.exports.invokeApi = function (requestOpts, callback) {
    request(requestOpts, function(err, res, body) {
        callback(res, body);
    });
}

// build options for requests
module.exports.buildOpt = function (method, host, json=true) {
    const options = {
        method: method,
        uri: host,
        headers: undefined,
        body: undefined,
        form: undefined,
        json: json,
        maxAttempts: 5,
        retryStrategy: request.RetryStrategies.HTTPOrNetworkError
    };

    return options
}

// session, appid are required
module.exports.buildDiagObj = function() {
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

