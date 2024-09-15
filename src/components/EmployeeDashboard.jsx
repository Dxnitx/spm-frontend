import React from 'react';
import Profile from './Profile';
import LeaveRequestForm from './LeaveRequestForm';

const EmployeeDashboard = () => {
  return (
    <div>
      <h1>Employee Dashboard</h1>
      <Profile />
      <LeaveRequestForm />
    </div>
  );
};

export default EmployeeDashboard;
