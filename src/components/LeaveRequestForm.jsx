import React, { useState } from 'react';
import { requestLeave } from '../api';

const LeaveRequestForm = () => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestLeave(formData);
      alert('Leave request submitted!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
      <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
      <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="Reason" required />
      <button type="submit">Request Leave</button>
    </form>
  );
};

export default LeaveRequestForm;
