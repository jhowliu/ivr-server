import { buildCommonPayload } from './common';

export const buildHuaanPayload = (msg) => {
  const payload = buildCommonPayload(msg);

  payload.OpNo = msg.robotId;
  payload.Q3Condition = msg.condition;
  payload.ReportDate = msg.reportDate;
  // user
  payload.IDNo = msg.user.id;
  payload.CarNo = msg.user.car_id;
  payload.Gender = msg.user.gender;
  payload.PersonName = msg.user.name;
  // accident
  payload.AccExp = msg.user.accident.name;
  payload.Date = msg.user.accident.date;
  payload.Place = msg.user.accident.place;
  // payment
  payload.PayDate = msg.user.payment.date;
  payload.JQPayment = msg.user.payment.TCI;
  payload.CIPayment = msg.user.payment.VCI;

  return payload;
}