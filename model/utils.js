import fs from 'fs';
import path from 'path';

import ChildProcessPromise from 'child-process-es6-promise';

export const generateRandomString = () => {
    return (Math.random() * new Date().getTime()).toString(32).replace( /\./g , '');
}

// Use for voice recognize 
// Read audio from local
export const getFileInBuffer = (filename, folder='./audio') => {
    const file = path.resolve(folder, filename);
    const buf = fs.readFileSync(file);
    console.log(buf.length);

    return buf;
}


// Write audio into local
export const constwriteAudio = (buffer, filename, callback) => {
    const file = path.resolve('./audio', filename);

    fs.writeFile(file, buffer,function(err) {
        if (err) throw err; 
        callback()
    });
}

export const convertAudio = function (filename, rate, callback) {
    const cmd = '/usr/bin/ffmpeg'

    const args = [
        '-y',
        '-i', path.resolve('./audio', filename),
        '-acodec', 'pcm_s16le',
        //'-f', 's16le',
        '-ac', '1',
        '-ar', '8000',
        path.resolve('./audio', filename)
   ]

    ChildProcessPromise.spawn(cmd, args)
        .then( () => console.log('finished'))
        .catch( err => console.log(err.toString()));
}
