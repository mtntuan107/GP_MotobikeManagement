import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Employee() {
    const navigate = useNavigate();

    // Hàm đăng xuất
    const handleLogout = () => {
        // Xóa access_token và refresh_token khi logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login'); // Chuyển hướng về trang đăng nhập
    };

    return (
        <div>
            <h1>Employee Page</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Employee;
