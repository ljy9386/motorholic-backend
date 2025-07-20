const express = require('express');
const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
const app = express();
const path = require('path');

app.use(require('cors')());
require('dotenv').config();

app.use(express.json());
mongoose.connect(process.env.MONGO_URI);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(path.join(__dirname))); 
// 이미지 폴더
app.use('/img', express.static(path.join(__dirname, 'img')));

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 예약 저장
app.post('https://motorholic-backend.onrender.com/api/reserve', async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).send('예약 완료');
  } catch (err) {
    res.status(500).send('서버 오류');
  }
});
app.post('https://motorholic-backend.onrender.com/api/reserve', async (req, res) => {
  try {
    console.log('📥 요청 데이터:', req.body); // 확인용

    const newReservation = new Reservation(req.body);
    await newReservation.save();

    res.status(201).send('예약 완료');
  } catch (err) {
    console.error('❌ 저장 실패:', err); // 에러 로그 출력
    res.status(500).send('서버 오류');
  }
});


// 예약 전체 조회 (관리자페이지용)
app.get('https://motorholic-backend.onrender.com/api/reserve', async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).send('서버 오류');
  }
});

app.listen(3000, () => {
  console.log('✅ 서버 실행 중: http://localhost:3000');
});
