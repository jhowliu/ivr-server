export const commonBodyCheck = (req, res) => {
  req.sid = req.body.sid || req.query.sid;
  req.appid = req.body.appid || req.query.appid;
  req.text = req.body.text;

  const {
    sid,
    text,
    appid
  } = req;

  if (!sid) {
    return { message: 'session id no given.' };
  }
  if (!appid) {
    return { message: 'appid no given.' };
  }

  req.type = (!text) ? appid : 'text';

  return null;
}
