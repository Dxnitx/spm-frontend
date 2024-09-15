import React, { useState, useEffect } from 'react';
import { fetchEmployeeProfile, fetchCurrentSalary } from '../api';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [salary, setSalary] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchEmployeeProfile();
        setProfile(profileData.data.profile);
        setLeaves(profileData.data.leavesTaken);
        setMessage(profileData.data.message || '');

        const salaryData = await fetchCurrentSalary();
        setSalary(salaryData.data.salary);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {profile.firstName} {profile.lastName}</p>
      <p>Email: {profile.email}</p>
      <p>Position: {profile.position}</p>
      <p>Current Salary: LKR {salary}</p>
      <p>Total Leaves Taken: {profile.totalLeavesTaken}</p>
      <h2>Leaves</h2>
      {leaves.length > 0 ? (
        <ul>
          {leaves.map((leave) => (
            <li key={leave._id}>
              {leave.startDate} to {leave.endDate} - {leave.status} - {leave.reason}
            </li>
          ))}
        </ul>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default Profile;
