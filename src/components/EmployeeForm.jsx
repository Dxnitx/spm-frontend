import React, { useState, useEffect } from 'react';
import { addEmployee, updateEmployee } from '../api';

const EmployeeForm = ({ employeeId, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    salary: '',
    dateOfJoining: '',
  });

  useEffect(() => {
    if (employeeId) {
      // Fetch employee data if editing
      // Populate form data with employee data (assuming you have a getEmployeeById function)
    }
  }, [employeeId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (employeeId) {
        await updateEmployee(employeeId, formData);
      } else {
        await addEmployee(formData);
      }
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
      <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
      <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
      <input name="position" value={formData.position} onChange={handleChange} placeholder="Position" required />
      <input name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="Salary" required />
      <input name="dateOfJoining" type="date" value={formData.dateOfJoining} onChange={handleChange} required />
      <button type="submit">Save</button>
    </form>
  );
};

export default EmployeeForm;
