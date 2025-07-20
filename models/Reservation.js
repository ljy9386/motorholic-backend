const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  bikeType: String,
  rentalTime: String,
  date: String,
  time: String,
  location: String,
}, {
  timestamps: true  // ✅ createdAt, updatedAt 자동 추가
});

module.exports = mongoose.model('Reservation', reservationSchema);