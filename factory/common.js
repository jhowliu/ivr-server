export const buildCommonPayload = (msg) => ({
  q: msg.text,
  session: msg.sid,
  appid: msg.appid,
});