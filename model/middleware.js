export const VerifyBody = (req, res, next) => {
  let err = {};

  req, err = commonBodyCheck(req, res);

  if (Object.keys(err).length) {
    return res.json({
      success: false,
      message: err.message
    })
  }

  switch (req.type) {
    case 'huaan':
      req, err = huaanBodyCheck(req, res);
      break;
    default:
      break;
  }

  if (Object.keys(err).length) {
    return res.json({
      success: false,
      message: err.message
    })
  }

  next();
}

const commonBodyCheck = (req, res) => {
  const error = {};
  req.sid = req.body.sid || req.query.sid;
  req.appid = req.body.appid || req.query.appid;
  req.text = req.body.text;

  const {
    sid,
    text,
    appid
  } = req;

  if (!sid) {
    error.message = 'session id no given.'
  }
  if (!appid) {
    error.message = 'appid no given.'
  }

  req.type = (!text) ? appid : 'text';

  return req, error;
}

const huaanBodyCheck = (req, res, next) => {
  const error = {};
  req.user = req.body.user || {};
  req.robotId = req.body.botid;
  req.reportDate = req.body.reportDate;
  req.condition = req.body.condition;
  // payment payload
  req.payment = req.user.payment || {};
  // accident payload
  req.accident = req.user.accident || {};

  const {
    robotId,
    reportDate,
    condition,
    user,
    payment,
    accident
  } = req;

  if (!robotId || !reportDate || !condition) {
    error.message = 'parameters is not completed, please check api document.'
  }
  if (!user.id || !user.name || !user.carid) {
    error.message = 'user payload is not completed.'
  }
  if (!payment.date || !payment.TCI || !payment.VCI) {
    error.message = 'payment payload is not completed.'
  }
  if (!accident.date || !accident.place || !accident.name) {
    error.message = 'accident payload is not completed.'
  }

  return req, error;
}