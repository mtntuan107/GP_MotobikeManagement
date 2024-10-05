import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiURL from "../api/api";

const Schedule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      // Gọi API để lấy thông tin người dùng hiện tại
      axios.get(`${apiURL}/account/current-user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // Kiểm tra vai trò của người dùng
        if (response.data.role === 'user') {
          setCurrentUser(response.data);
          setIsLoggedIn(true);
          // Gọi API lấy thông tin lịch bảo dưỡng
          fetchSchedule(token);
        } else if (response.data.role === 'e') {
          // Chuyển hướng đến trang '/employee'
          navigate('/employee');
        } else {
          handleLogout();
        }
      })
      .catch((error) => {
        console.error('Error fetching user', error);
        setIsLoggedIn(false);
      });
    } else {
      navigate('/login');  // Chuyển hướng về trang đăng nhập nếu không có token
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

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching schedule: {error.message}</p>;

  return (
    <div>
      <header>
        {isLoggedIn ? (
          <>
            <span>Ok</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <p>You are not logged in.</p>
        )}
      </header>

      {currentUser && <div>Welcome, {currentUser.username}!</div>}

      {/* Hiển thị dữ liệu partmm */}
      {data?.partmm && data.partmm.length > 0 ? (
        <div>
          <h3>PartMM Details</h3>
          {data.partmm.map((part, index) => (
            <div key={index}>
              <p>Part ID: {part.id}</p>
              <p>Created Date: {new Date(part.created_date).toLocaleString()}</p>
              <p>Updated Date: {new Date(part.updated_date).toLocaleString()}</p>
              <p>Is Maintenance: {part.is_Maintenance ? 'Yes' : 'No'}</p>
              <p>Motorbike Model ID: {part.motorbike_model}</p>
              <p>Part ID: {part.part}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No partmm data available.</p>
      )}

      {/* Hiển thị dữ liệu maintenance */}
      {data?.maintenance && (
        <div>
          <h3>Maintenance Details</h3>
          <p>Maintenance ID: {data.maintenance.id}</p>
          <p>Day: {data.maintenance.day}</p>
          <p>Description: {data.maintenance.description}</p>
          <p>Employee ID: {data.maintenance.employee}</p>
          <p>User Motorbike ID: {data.maintenance.user_motorbike}</p>
          <p>Maintenance Type ID: {data.maintenance.maintenance_type}</p>
        </div>
      )}
    </div>
  );
};

export default Schedule;
