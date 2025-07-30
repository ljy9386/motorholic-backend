const express = require('express');
const mongoose = require('mongoose');
const Reservation = require('./models/Reservation');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors({
  origin: ['http://motorholic.co.kr', 'https://motorholic.co.kr'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}));


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
app.post('/api/reserve', async (req, res) => {
  try {
    const newReservation = new Reservation(req.body);
    await newReservation.save();
    res.status(201).send('예약 완료');
  } catch (err) {
    res.status(500).send('서버 오류');
  }
});
app.post('/api/reserve', async (req, res) => {
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

app.listen(3000, () => {
  console.log('✅ 서버 실행 중: http://localhost:3000');
});
