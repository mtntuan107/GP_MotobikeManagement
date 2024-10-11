import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import '../styles/Employee.css' // Import the CSS file for styling

function Employee() {
    const navigate = useNavigate();

    // Handle logout function
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    return (
        <div className="employee-container">
            {/* Drawer Sidebar */}
            <div className="drawer">
                <div className="drawer-content">
                    <h2>Menu</h2>
                    <ul>
                        <li>
                            <Link to="/employee">Profile</Link>
                        </li>
                        <li>
                            <Link to="/employee/maintenance">Maintenance</Link>
                        </li>
                        <li>
                            <Link to="/employee/history">History</Link>
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
                <Outlet /> {/* This will load the Profile, Maintenance, or History components */}
            </div>
        </div>
    );
}

export default Employee;
