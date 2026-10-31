const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Device = require('./models/Device');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend service is running fine' });
});

app.get('/api/devices', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { deviceId: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
          { deviceType: { $regex: search, $options: 'i' } },
          { room: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const devices = await Device.find(query);
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.get('/api/devices/:id', async (req, res) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.post('/api/devices', async (req, res) => {
  try {
    const { deviceId, name, deviceType, room } = req.body;
    if (!deviceId || !name || !deviceType || !room) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    const existing = await Device.findOne({ deviceId });
    if (existing) {
      return res.status(400).json({ message: 'Mã thiết bị (deviceId) đã tồn tại' });
    }

    const newDevice = new Device(req.body);
    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.put('/api/devices/:id', async (req, res) => {
  try {
    const updatedDevice = await Device.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDevice) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

app.delete('/api/devices/:id', async (req, res) => {
  try {
    const deleted = await Device.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
    res.json({ message: 'Xóa thiết bị thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
