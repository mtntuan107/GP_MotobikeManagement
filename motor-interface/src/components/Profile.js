import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiURL from "../api/api";
import urlCloudinary from "../api/urlCloudinary";

const urlImg = urlCloudinary;
const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');  // Chuyển hướng tới trang đăng nhập nếu không có token
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${apiURL}/account/current-user/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('access_token');  // Xóa access_token khỏi localStorage
    localStorage.removeItem('refresh_token'); // Xóa refresh_token khỏi localStorage
    navigate('/login');  // Điều hướng tới trang đăng nhập
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-details">
        <div className="profile-avatar">
          {userProfile.avatar ? (
            <img src={`${urlImg}${userProfile.avatar}`} alt="User Avatar" />
          ) : (
            <img src="default-avatar.png" alt="Default Avatar" />
          )}
        </div>
        <div className="profile-info">
          <h3>{userProfile.username}</h3>
          <h2>Hello, {userProfile['first_name']} {userProfile['last_name']}</h2>
          <p><strong>Phone:</strong> {userProfile.phone}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Date of Birth:</strong> {userProfile.dob}</p>
          <p><strong>Address:</strong> {userProfile.address}</p>
        </div>
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
