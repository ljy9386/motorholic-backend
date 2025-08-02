// utils/aligo.js
const axios = require('axios');
require('dotenv').config();

async function sendSMS({ receiver, msg }) {
  try {
    const res = await axios.post('https://apis.aligo.in/send/', null, {
      params: {
        key: process.env.ALIGO_API_KEY,
        user_id: process.env.ALIGO_USER_ID,
        sender: process.env.ALIGO_SENDER,
        receiver, // 받는사람 번호
        msg,      // 문자 내용
        testmode_yn: 'N' // 실제 전송: N, 테스트: Y
      }
    });

    console.log('📤 문자 전송 결과:', res.data);
    return res.data;
  } catch (err) {
    console.error('❌ 문자 전송 실패:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = sendSMS;
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
    receiver, // 받는사람 번호
    msg,      // 문자 내용
    testmode_yn: 'N' // 실제 전송: N, 테스트: Y
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