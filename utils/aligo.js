// utils/aligo.js
require('dotenv').config();
const axios = require('axios');
const qs = require('qs');

async function sendSMS({ receiver, msg }) {
  const url = 'https://apis.aligo.in/send/';
  const data = {
    key: process.env.ALIGO_API_KEY,
    user_id: process.env.ALIGO_USER_ID,
    sender: process.env.ALIGO_SENDER,
    receiver,
    msg,
    testmode_yn: 'Y'
  };

  try {
    const res = await axios.post(url, qs.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('📤 문자 전송 결과:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ 문자 전송 실패:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = sendSMS;