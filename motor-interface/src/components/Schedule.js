import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiURL from "../api/api";
import '../styles/Schedule.css'; // Ensure you have the CSS file

const Schedule = () => {
  const [data, setData] = useState(null);
  const [parts, setParts] = useState([]); // New state to store parts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      axios.get(`${apiURL}/account/current-user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.data.role === 'user') {
            setIsLoggedIn(true);
            fetchSchedule(token);
            fetchParts(); // Fetch parts data
          } else if (response.data.role === 'e') {
            navigate('/employee');
          } else {
            navigate('/login');
          }
        })
        .catch((error) => {
          console.error('Error fetching user', error);
          setIsLoggedIn(false);
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchSchedule = async (token) => {
    try {
      const response = await axios.get(`${apiURL}/part_mm/schedule/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  // New function to fetch parts
  const fetchParts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/part/');
      setParts(response.data); // Assuming response.data is an array of parts
    } catch (err) {
      console.error('Error fetching parts:', err);
    }
  };

  // Helper function to get part name by part_mm.id
  const getPartNameById = (id) => {
    const part = parts.find(part => part.id === id);
    return part ? part.name : 'Unknown Part'; // Adjust to access the correct property if needed
  };

  // Helper function to get part color based on created date and duration
  const getPartColor = (part) => {
    if (!part || !part.part_mm) return 'green'; // Default to green if part is not defined

    const duration = getPartDurationById(part.part_mm.part); // Access part_mm.part.id
    const endDate = new Date(new Date(part.created_date).getTime() + duration * 24 * 60 * 60 * 1000); // Convert duration to milliseconds
    return endDate < new Date() ? 'red' : 'green'; // Compare with current date
  };

  // Example placeholder function for getting duration based on part ID
  const getPartDurationById = (id) => {
    const part = parts.find(part => part.id === id);
    return part ? part.duration : 30; // Assuming 30 days as default if not found
  };

  // Helper function to get maintenance color
  const getMaintenanceColor = (maintenance) => {
    const partId = maintenance.part_mm;
    const duration = getPartDurationById(partId);
    const endDate = new Date(new Date(maintenance.day).getTime() + duration * 24 * 60 * 60 * 1000); // Convert duration to milliseconds
    return endDate < new Date() ? 'red' : 'green'; // Compare with current date
  };

  // Utility function to get the remaining time until the part's due date
  const getTimeRemainingById = (id) => {
    const part = parts.find(part => part.id === id);
    if (!part) return 'Unknown'; // Return 'Unknown' if part is not found

    const duration = getPartDurationById(part.id); // Get duration based on part ID
    const dueDate = new Date(new Date(part.created_date).getTime() + duration * 24 * 60 * 60 * 1000); // Calculate due date
    const now = new Date();

    // Calculate remaining time in milliseconds
    const remainingTime = dueDate - now;

    // If the remaining time is negative, return 'Due'
    if (remainingTime < 0) {
        return 'Due';
    }

    // Convert remaining time to days, hours, and minutes
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));

    // Format the time remaining
    return { days, hours, minutes };
  };

  // Function to calculate the future date
  const calculateFutureDate = (days, hours, minutes) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000));
    return futureDate.toLocaleDateString(); // Format date as needed
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching schedule: {error.message}</p>;

  return (
    <div className="schedule-container">
      <div className="schedule-content">
        {/* PartMM Section */}
        <div className="partmm-section">
          <h3>Don't Maintenance Yet</h3>
          {data?.partmm && data.partmm.length > 0 ? (
            data.partmm.map((part, index) => {
              const { days, hours, minutes } = getTimeRemainingById(part?.part);
              const partColor = getPartColor(part);
              const futureDate = calculateFutureDate(days, hours, minutes);

              return (
                  <div
                      key={index}
                      className="partmm-card"
                      style={{
                        backgroundColor: partColor === 'red' ? '#ffe6e6' : '#e6ffe6',
                        borderColor: partColor === 'red' ? 'red' : 'green'
                      }}
                  >
                    <h4 style={{color: partColor}}>Part Name: {getPartNameById(part?.part)}</h4>
                    <p>Date: {new Date(part.created_date).toLocaleString()}</p>
                    <p>{`${days}d ${hours}h ${minutes}m remaining`}</p> {/* Display time remaining */}
                    <p>{`Next time is ${futureDate}`}</p> {/* Display future date */}
                  </div>
              );
            })
          ) : (
              <p>No partmm data available.</p>
          )}
        </div>

        {/* Maintenance Section */}
        <div className="maintenance-section">
          <h3>Maintenance</h3>
          {data?.maintenance && data.maintenance.length > 0 ? (
            data.maintenance.map((maint, index) => {
              const maintColor = getMaintenanceColor(maint);
              const { days, hours, minutes } = getTimeRemainingById(maint.part_mm);
              const futureDate = calculateFutureDate(days, hours, minutes);

              return (
                  <div
                      key={index}
                      className="maintenance-card"
                      style={{
                        backgroundColor: maintColor === 'red' ? '#ffe6e6' : '#e6ffe6',
                        borderColor: maintColor === 'red' ? 'red' : 'green'
                      }}
                  >
                    <h4 style={{color: maintColor}}>Part Name: {getPartNameById(maint.part_mm)}</h4>
                    <p>Last time: {new Date(maint.day).toLocaleDateString()} ({maint.description})</p>
                    <p>{`${days}d ${hours}h ${minutes}m remaining`}</p> {/* Display time remaining for maintenance */}
                    <p>{`Next time is ${futureDate}`}</p> {/* Display future date for maintenance */}
                  </div>
              );
            })
          ) : (
              <p>No maintenance data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
