import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    deviceType: 'Máy chiếu',
    room: '',
    brand: '',
    model: '',
    quantity: 1,
    status: 'Đang sử dụng',
    purchaseDate: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchDevices = async (keyword = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/devices?search=${keyword}`);
      setDevices(res.data);
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDevices(search);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/devices/${editingId}`, formData);
        alert('Cập nhật thiết bị thành công!');
      } else {
        await axios.post(`${API_URL}/devices`, formData);
        alert('Thêm thiết bị mới thành công!');
      }
      resetForm();
      fetchDevices(search);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleEdit = (device) => {
    setEditingId(device._id);
    setFormData({
      deviceId: device.deviceId,
      name: device.name,
      deviceType: device.deviceType,
      room: device.room,
      brand: device.brand || '',
      model: device.model || '',
      quantity: device.quantity || 1,
      status: device.status || 'Đang sử dụng',
      purchaseDate: device.purchaseDate || '',
      description: device.description || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      try {
        await axios.delete(`${API_URL}/devices/${id}`);
        fetchDevices(search);
      } catch (err) {
        alert('Lỗi khi xóa thiết bị');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      deviceId: '',
      name: '',
      deviceType: 'Máy chiếu',
      room: '',
      brand: '',
      model: '',
      quantity: 1,
      status: 'Đang sử dụng',
      purchaseDate: '',
      description: ''
    });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Hệ Thống Quản Lý Thiết Bị Phòng Học (Huỳnh Phú Quí - 235323)</h2>
      
      {/* Tìm kiếm */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Tìm theo Mã, Tên, Loại, Phòng..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Tìm kiếm</button>
        <button type="button" onClick={() => { setSearch(''); fetchDevices(''); }} style={{ padding: '8px 16px' }}>Làm mới</button>
      </form>

      {/* Form nhập liệu */}
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Cập Nhật Thiết Bị' : 'Thêm Thiết Bị Mới'}</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input name="deviceId" placeholder="Mã thiết bị (*)" value={formData.deviceId} onChange={handleChange} required disabled={!!editingId} />
          <input name="name" placeholder="Tên thiết bị (*)" value={formData.name} onChange={handleChange} required />
          <input name="deviceType" placeholder="Loại thiết bị (*)" value={formData.deviceType} onChange={handleChange} required />
          <input name="room" placeholder="Phòng học (*)" value={formData.room} onChange={handleChange} required />
          <input name="brand" placeholder="Thương hiệu" value={formData.brand} onChange={handleChange} />
          <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} />
          <input name="quantity" type="number" placeholder="Số lượng" value={formData.quantity} onChange={handleChange} />
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Đang sử dụng">Đang sử dụng</option>
            <option value="Hư hỏng">Hư hỏng</option>
            <option value="Đang sửa chữa">Đang sửa chữa</option>
            <option value="Ngừng sử dụng">Ngừng sử dụng</option>
          </select>
          <input name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} />
          <input name="description" placeholder="Mô tả" value={formData.description} onChange={handleChange} />
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ padding: '8px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '3px' }}>
              {editingId ? 'Cập nhật' : 'Thêm mới'}
            </button>
            {editingId && <button type="button" onClick={resetForm} style={{ padding: '8px 20px' }}>Hủy</button>}
          </div>
        </form>
      </div>

      {/* Danh sách thiết bị */}
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>Mã TB</th>
              <th>Tên thiết bị</th>
              <th>Loại</th>
              <th>Phòng</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {devices.length > 0 ? devices.map(d => (
              <tr key={d._id}>
                <td>{d.deviceId}</td>
                <td>{d.name}</td>
                <td>{d.deviceType}</td>
                <td>{d.room}</td>
                <td>{d.quantity}</td>
                <td>{d.status}</td>
                <td>
                  <button onClick={() => handleEdit(d)} style={{ marginRight: '5px' }}>Sửa</button>
                  <button onClick={() => handleDelete(d._id)} style={{ color: 'red' }}>Xóa</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}>Không có dữ liệu thiết bị nào</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
