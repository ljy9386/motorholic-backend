require('dotenv').config();
const sendSMS = require('./utils/aligo');
const axios = require('axios');

const express = require('express');
const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
const app = express();
const path = require('path');
const cors = require('cors');

const rateLimiter = new Map(); // 중복 요청 방지용 메모리 저장소

app.use(cors({
  origin: ['http://motorholic.co.kr', 'https://motorholic.co.kr'],
  credentials: true
}));

app.use(express.json());
mongoose.connect(process.env.MONGO_URI);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(path.join(__dirname)));
// 이미지 폴더
app.use('/img', express.static(path.join(__dirname, 'img')));


// 외부 IP 확인용 엔드포인트
app.get('/myip', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.ipify.org?format=json');
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


// ✅ 이걸로 통일 (console.log 확인용 포함)
app.post('/api/reserve', async (req, res) => {
  try {
    console.log('📥 요청 데이터:', req.body);

    const key = `${req.body.name}-${req.body.phone}`;
    const now = Date.now();

    if (rateLimiter.has(key)) {
      const lastTime = rateLimiter.get(key);
      if (now - lastTime < 60000) { // 1분 이내면 거절
        return res.status(429).send('중복 신청이 감지되었습니다. 잠시 후 다시 시도해주세요.');
      }
    }
    rateLimiter.set(key, now);

    const newReservation = new Reservation(req.body);
    await newReservation.save();

    // 알리고 문자 발송
    try {
      await sendSMS({
        receiver: '01048408986',
        msg: `[모토홀릭] 고객의 예약문의가 접수되었습니다. 이름: ${req.body.name}, 연락처: ${req.body.phone}, 바이크: ${req.body.bikeType}, 지점: ${req.body.location}, 코스: ${req.body.rentalTime}, 날짜: ${req.body.date}, 시간: ${req.body.time}`
      });
      console.log('📤 SMS 전송 성공');
    } catch (smsErr) {
      console.error('❌ SMS 전송 실패', smsErr);
    }

    res.status(201).send('예약 완료');
  } catch (err) {
    console.error('❌ 저장 실패:', err);
    res.status(500).send('서버 오류');
  }
});


// 예약 전체 조회 (관리자페이지용)
app.get('/api/reserve', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).send('서버 오류');
  }
});

// 회원 삭제기능
app.delete('/api/reserve/:id', async (req, res) => {
  try {
    const result = await Reservation.findByIdAndDelete(req.params.id);
    if (result) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
});
