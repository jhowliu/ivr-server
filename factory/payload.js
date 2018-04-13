import {
  buildHuaanPayload
} from './huaan'
import {
  buildRuitaiPayload
} from './ruitai'

export default {
  createPayload: (type, msg) => {
    switch (msg.appid) {
      case 'huaan':
        return buildHuaanPayload(msg);
      case 'ruitai':
        return buildRuitaiPayload(msg);
      default:
        return {
          q: msg.text,
          appid: msg.appid,
          session: msg.sid
        };
    }
  }
}