import React, { useState, useEffect } from 'react';
import EmployeeForm from './EmployeeForm';
import LeaveRequestForm from './LeaveRequestForm';
import SalaryUpdateForm from './SalaryUpdateForm';
import { fetchAllLeaveRequests, calculateAndUpdateSalaries } from '../api';

const AdminDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [showSalaryForm, setShowSalaryForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leaveRequestsData = await fetchAllLeaveRequests();
        setLeaveRequests(leaveRequestsData.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleCalculateSalaries = async () => {
    try {
      await calculateAndUpdateSalaries();
      alert('Salaries calculated and updated!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <button onClick={() => setShowEmployeeForm(!showEmployeeForm)}>Add/Update Employee</button>
      <button onClick={() => setShowLeaveForm(!showLeaveForm)}>Request Leave</button>
      <button onClick={() => setShowSalaryForm(!showSalaryForm)}>Update Salary Status</button>
      <button onClick={handleCalculateSalaries}>Calculate Salaries</button>

      {showEmployeeForm && <EmployeeForm onSuccess={() => setShowEmployeeForm(false)} />}
      {showLeaveForm && <LeaveRequestForm />}
      {showSalaryForm && <SalaryUpdateForm />}

      <h2>Leave Requests</h2>
      <ul>
        {leaveRequests.map((leave) => (
          <li key={leave._id}>
            {leave.startDate} to {leave.endDate} - {leave.status} - {leave.reason}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
