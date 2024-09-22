import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';

const EmployeePage = () => {
  const userId = '66f012e812e7aada2f86c23c'; // User ID
  const [employee, setEmployee] = useState(null);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeData = await fetch(`http://localhost:3000/api/employees/profile/${userId}`).then(res => res.json());
        setEmployee(employeeData);

        const leaveData = await fetch(`http://localhost:3000/api/employees/request/${userId}`).then(res => res.json());
        if (Array.isArray(leaveData)) {
          setLeaveRequests(leaveData);
        } else {
          setLeaveRequests([]);
          toast.info("No leaves requested");
        }
      } catch (error) {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const requestLeave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/leaves/request/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData }),
      });

      if (response.ok) {
        Swal.fire('Success!', 'Leave request submitted!', 'success');
        setFormData({ startDate: '', endDate: '', reason: '' });
        const updatedLeaveData = await fetch(`http://localhost:3000/api/employees/request/${userId}`).then(res => res.json());
        if (Array.isArray(updatedLeaveData)) {
          setLeaveRequests(updatedLeaveData);
        }
      } else {
        Swal.fire('Error!', 'Failed to submit leave request.', 'error');
      }
    } catch (error) {
      toast.error("Error submitting leave request");
    }
  };

  if (!employee) return <div className="p-5">Loading...</div>;
//from-blue-200 to-blue-700
  return (
    <div className='flex justify-center w-full bg-[#ececec] py-10'>
        <div className="p-5 bg-gradient-to-r rounded-3xl bg-[#6d6262] min-h-screen max-w-[800px]">
      <h1 className="text-4xl font-bold text-center text-white mb-6">Employee Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 transition transform hover:scale-105">
        <h2 className="text-2xl font-semibold text-gray-800">{`${employee.firstName} ${employee.lastName}`}</h2>
        <p className="text-lg text-gray-600">Current Salary: <span className="font-bold">{employee.salaryPerDay * (365 - employee.remainingLeaves)}</span></p>
        <p className="text-lg text-gray-600">Leaves Taken: <span className="font-bold">{employee.totalLeavesTaken}</span></p>
        <p className="text-lg text-gray-600">Remaining Leaves: <span className="font-bold">{employee.remainingLeaves}</span></p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-2xl font-semibold mb-4">Request Leave</h2>
        <form onSubmit={requestLeave} className="flex flex-col space-y-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Reason for leave"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200">Submit</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Leave Requests</h2>
        <ul>
          {Array.isArray(leaveRequests) && leaveRequests.length > 0 ? (
            leaveRequests.map((leave) => (
              <li key={leave._id} className="flex justify-between mb-3 p-2 border-b border-gray-200">
                <span className="text-gray-800">{leave.reason} ({new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()})</span>
                <span className={`font-bold ${leave.status === 'Approved' ? 'text-green-600' : 'text-red-600'}`}>
                  {leave.status}
                </span>
              </li>
            ))
          ) : (
            <li className="text-gray-600">No leave requests found.</li>
          )}
        </ul>
      </div>

      <ToastContainer />
    </div>
    </div>
  );
};

export default EmployeePage;
