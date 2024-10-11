import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import apiURL from "../api/api";
import '../styles/Home.css' // Import the CSS file for styling the drawer

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
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
          setCurrentUser(response.data);
          setIsLoggedIn(true);

        } else if (response.data.role === 'e') {
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
      navigate('/login');
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Drawer Sidebar */}
      <div className="drawer">
        <div className="drawer-content">
          <h2>Menu</h2>
          <ul>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/schedule">Schedule</Link>
            </li>
            <li>
              <Link to="/motorbike">Motorbike</Link>
            </li>
            <li>
              <Link to="/userhistory">History</Link>
            </li>
          </ul>
        </div>

        {/* Logout button fixed at the bottom */}
        <div className="logout-section">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="content">
        <Outlet /> {/* This will load Profile, Schedule, or Motorbike based on the route */}
      </div>
    </div>
  );
}

export default Home;
