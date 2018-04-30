export const huaanBodyCheck = (req, res, next) => {
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
    return { message: 'parameters is not completed, please check api document.' };
  }
  if (!user.id || !user.name || !user.car_id || !user.gender) {
    console.log(user.name)
    return { message: 'user payload is not completed.' };
  }
  if (!payment.date || !payment.TCI || !payment.VCI) {
    return { message: 'payment payload is not completed.' };
  }
  if (!accident.date || !accident.place || !accident.name) {
    return { message: 'accident payload is not completed.' };
  }

  return null;
}