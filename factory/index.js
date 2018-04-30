import { buildHuaanPayload } from './huaan';
import { buildRuitaiPayload } from './ruitai';
import { buildCommonPayload } from './common';

export default {
  createPayload: (msg) => {
    switch (msg.type) {
      case 'sunshine':
        return buildHuaanPayload(msg);
      case 'ruitai':
        return buildRuitaiPayload(msg);
      default:
        return buildCommonPayload(msg);
    }
  }
}