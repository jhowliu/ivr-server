import { huaanBodyCheck } from './huann';
import { commonBodyCheck } from './common';

export const VerifyBody = (req, res, next) => {
  let err = commonBodyCheck(req, res);

  if (!err) {
    switch (req.type) {
      case 'sunshine':
        err = huaanBodyCheck(req, res);
        break;
      default:
        break;
    }
  }
  
  if (err) {
    return res.json({
      success: false,
      message: err.message
    })
  }

  next();
}
