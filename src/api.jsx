import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const fetchEmployeeProfile = () => api.get('/employees/profile');
export const fetchCurrentSalary = () => api.get('/employees/salary');
export const requestLeave = (leaveData) => api.post('/leaves/request', leaveData);
export const applyLeave = (leaveId, status) => api.put(`/leaves/${leaveId}`, { status });
export const fetchLeaveDetails = (leaveId) => api.get(`/leaves/${leaveId}`);
export const fetchAllLeaveRequests = () => api.get('/leaves/admin');
export const addEmployee = (employeeData) => api.post('/admin/employees', employeeData);
export const updateEmployee = (employeeId, employeeData) => api.put(`/admin/employees/${employeeId}`, employeeData);
export const calculateAndUpdateSalaries = () => api.post('/admin/calculate-salaries');
export const updateSalaryPaymentStatus = (employeeId, status) => api.put(`/admin/salaries/${employeeId}`, { salaryPaid: status });
