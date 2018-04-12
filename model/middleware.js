export const verifyBody = (req, res, next) => {
    req.sid = req.body.sid || req.query.sid;
    req.appid = req.body.appid || req.query.appid;
    req.user = req.body.user || {};

    req.robotId = req.body.bot_id;
    req.reportDate = req.body.report_date;
    req.condition = req.body.condition;

    // payment payload
    req.payment = req.user.payment || {};
    // accident payload
    req.accident = req.user.accident || {};

    if (!req.sid) {
        return res.json({ success: false, message: 'session id no given.' });
    }

    if (!req.appid) {
        return res.json({ success: false, message: 'appid no given.' });
    }

    switch (req.appid) {
        case 'huaan':
            const { robotId, reportDate, condition, user, payment, accident } = req;

            if (!robotId || !reportDate || !condition) {
                return res.json({ success: false, message: 'parameters is not completed, please check api document.' });
            }
            if (!user.id || !user.name || !user.car_id) {
                return res.json({ success: false, message: 'user payload is not completed.' });
            }
            if (!payment.date || !payment.TCI || !payment.VCI) {
                return res.json({ success: false, message: 'payment payload is not completed.' });
            }
            if (!accident.date || !accident.place || !accident.name) {
                return res.json({ success: false, message: 'accident payload is not completed.' });
            }
            break;
        default:
            break;
    }

    next();
}