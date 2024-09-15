import React, { useState, useEffect } from 'react';
import { updateSalaryPaymentStatus, fetchAllLeaveRequests } from '../api';

const SalaryUpdateForm = () => {
  const [employees, setEmployees] = useState([]);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaveRequestsData = await fetchAllLeaveRequests();
        const uniqueEmployeeIds = [...new Set(leaveRequestsData.data.map((leave) => leave.employeeId._id))];
        setEmployees(uniqueEmployeeIds);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setStatus(e.target.value === 'true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(employees.map((id) => updateSalaryPaymentStatus(id, status)));
      alert('Salary payment status updated!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Status:
        <select onChange={handleChange} required>
          <option value="false">Unpaid</option>
          <option value="true">Paid</option>
        </select>
      </label>
      <button type="submit">Update Salary Payment Status</button>
    </form>
  );
};

export default SalaryUpdateForm;
