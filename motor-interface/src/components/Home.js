import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiURL from "../api/api";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component được render
  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      // Nếu có token, thực hiện gọi API để lấy thông tin người dùng hiện tại
      axios.get(`${apiURL}/account/current-user/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        // Kiểm tra vai trò của người dùng
        if (response.data.role === 'user') {
          setCurrentUser(response.data);
          setIsLoggedIn(true);
        } else if (response.data.role === 'e') {
          // Nếu vai trò là 'employee', chuyển hướng đến trang '/employee'
          navigate('/employee');
        } else {
          // Nếu không phải là 'user' hoặc 'employee', gọi hàm đăng xuất
          handleLogout();
        }
      }).catch((error) => {
        console.error('Error fetching user', error);
        setIsLoggedIn(false);
      });
    }
  }, [navigate]); // Đảm bảo rằng `navigate` được đưa vào dependency array

  // Hàm đăng xuất
  const handleLogout = () => {
    // Xóa access_token và refresh_token khi logout
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div>
      <header>
        {isLoggedIn ? (
          <>
            <span>Ok</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </header>
      {currentUser && <div>Welcome, {currentUser.username}!</div>}
    </div>
  );
}

export default Home;
