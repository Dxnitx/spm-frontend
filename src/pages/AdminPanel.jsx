import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chart, registerables } from 'chart.js';

// Register all components
Chart.register(...registerables);

const AdminPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('employees');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    salaryPerDay: '',
  });
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [analyticsData, setAnalyticsData] = useState({ labels: [], data: [] });

  useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
    fetchAnalyticsData();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      toast.error("Failed to load employees");
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/leaves');
      const data = await response.json();
      setLeaveRequests(data);
    } catch (error) {
      toast.error("Failed to load leave requests");
    }
  };

  const fetchAnalyticsData = async () => {
    // Example logic to fetch analytics data
    try {
      const response = await fetch('http://localhost:3000/api/admin/analytics');
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      toast.error("Failed to load analytics data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/admin/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Employee added successfully");
        fetchEmployees();
        setFormData({ firstName: '', lastName: '', email: '', position: '', salaryPerDay: '' });
      } else {
        toast.error("Failed to add employee");
      }
    } catch (error) {
      toast.error("Error adding employee");
    }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await fetch(`http://localhost:3000/api/admin/employees/${id}`, {
          method: 'DELETE',
        });
        toast.success("Employee deleted successfully");
        fetchEmployees();
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const handleLeaveAction = async (id, action) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/leaves/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'approve' ? 'Approved' : 'Rejected' }),
      });

      if (response.ok) {
        toast.success(`Leave request ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
        fetchLeaveRequests();
      } else {
        toast.error("Failed to update leave request");
      }
    } catch (error) {
      toast.error("Error updating leave request");
    }
  };

  const downloadPDF = () => {
    const input = document.getElementById('analytics');
    html2canvas(input).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('analytics.pdf');
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-5">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <button onClick={() => setActiveTab('employees')} className="block w-full text-left p-2 hover:bg-gray-200">Employees</button>
          <button onClick={() => setActiveTab('leaveRequests')} className="block w-full text-left p-2 hover:bg-gray-200">Leave Requests</button>
          <button onClick={() => setActiveTab('analytics')} className="block w-full text-left p-2 hover:bg-gray-200">Analytics</button>
        </div>
      </aside>

      <main className="flex-1 p-5">
        {activeTab === 'employees' && (
          <>
            <h1 className="text-2xl text-left font-bold mb-4">Employees</h1>
            <div className="mb-4">
              <form onSubmit={addEmployee} className="flex flex-col">
                <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleInputChange} className="mb-2 p-2 border rounded" required />
                <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleInputChange} className="mb-2 p-2 border rounded" required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="mb-2 p-2 border rounded" required />
                <input type="text" name="position" placeholder="Position" value={formData.position} onChange={handleInputChange} className="mb-2 p-2 border rounded" required />
                <input type="number" name="salaryPerDay" placeholder="Salary per Day" value={formData.salaryPerDay} onChange={handleInputChange} className="mb-2 p-2 border rounded" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded"><FaPlus /> Add Employee</button>
              </form>
            </div>

            <table className="min-w-full bg-white shadow-md rounded mb-4">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">First Name</th>
                  <th className="py-2 px-4 border-b">Last Name</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Position</th>
                  <th className="py-2 px-4 border-b">Salary/Day</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(employee => (
                  <tr key={employee._id}>
                    <td className="py-2 px-4 border-b">{employee.firstName}</td>
                    <td className="py-2 px-4 border-b">{employee.lastName}</td>
                    <td className="py-2 px-4 border-b">{employee.email}</td>
                    <td className="py-2 px-4 border-b">{employee.position}</td>
                    <td className="py-2 px-4 border-b">{employee.salaryPerDay}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <button onClick={() => { /* Handle Edit Logic */ }} className="text-blue-500"><FaEdit /></button>
                      <button onClick={() => deleteEmployee(employee._id)} className="text-red-500"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'leaveRequests' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Leave Requests</h1>
            <table className="min-w-full bg-white shadow-md rounded mb-4">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Employee</th>
                  <th className="py-2 px-4 border-b">Reason</th>
                  <th className="py-2 px-4 border-b">Dates</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map(leave => (
                  <tr key={leave._id}>
                    <td className="py-2 px-4 border-b">{leave.employeeId}</td>
                    <td className="py-2 px-4 border-b">{leave.reason}</td>
                    <td className="py-2 px-4 border-b">{`${leave.startDate} - ${leave.endDate}`}</td>
                    <td className="py-2 px-4 border-b">{leave.status}</td>
                    <td className="py-2 px-4 border-b flex space-x-2">
                      <button onClick={() => handleLeaveAction(leave._id, 'approve')} className="text-green-500"><FaCheck /></button>
                      <button onClick={() => handleLeaveAction(leave._id, 'reject')} className="text-red-500"><FaTimes /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <h1 className="text-2xl font-bold mb-4">Analytics</h1>
            <div id="analytics" className="bg-white p-4 rounded shadow-md mb-4">
              <Bar
                key={JSON.stringify(analyticsData)} // Ensure a unique key
                data={{
                  labels: analyticsData.labels,
                  datasets: [{
                    label: 'Total Leaves Taken',
                    data: analyticsData.data,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  }],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
            <button onClick={downloadPDF} className="bg-blue-500 text-white p-2 rounded">
              Download PDF
            </button>
          </>
        )}

        <ToastContainer />
      </main>
    </div>
  );
};

export default AdminPanel;
