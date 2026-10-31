const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  deviceType: { type: String, required: true },
  room: { type: String, required: true },
  brand: { type: String },
  model: { type: String },
  quantity: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ['Đang sử dụng', 'Hư hỏng', 'Đang sửa chữa', 'Ngừng sử dụng'], 
    default: 'Đang sử dụng' 
  },
  purchaseDate: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema, 'devices');
