export const buildRuitaiPayload = (msg) => ({
  q: msg.text,
  session: msg.sid,
  appid: msg.appid,
})