const path = require('path');
const fs = require('fs');

let spawn = require('child_process').spawn;

module.exports.generateRandomString = function () {
    return (Math.random() * new Date().getTime()).toString(32).replace( /\./g , '');
}

