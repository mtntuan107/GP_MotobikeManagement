import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiURL from "../api/api";
import '../styles/Register.css'; // Import the CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
    address: '',
    avatar: null,
    phone: '',
    dob: '',
    role: 'user',
  });

  const [formErrors, setFormErrors] = useState({}); // State to manage form validation errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Reset error for the specific field when the user starts typing
    setFormErrors({
      ...formErrors,
      [name]: ''
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      avatar: e.target.files[0],
    });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.firstname) errors.firstname = "First name is required";
    if (!formData.lastname) errors.lastname = "Last name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.dob) errors.dob = "Date of birth is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Stop submission if there are errors
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post(`${apiURL}/account/create-account/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

      // Display success message
      alert("Account created successfully! Redirecting to login...");

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Error creating account:', error.response?.data || error.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {/* Inline Username and Password */}
        <div className="input-inline">
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className={formErrors.username ? 'error' : ''}
            />
            {formErrors.username && <span className="error-message">{formErrors.username}</span>}
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={formErrors.password ? 'error' : ''}
            />
            {formErrors.password && <span className="error-message">{formErrors.password}</span>}
          </div>
        </div>

        {/* Inline First Name and Last Name */}
        <div className="input-inline">
          <div>
            <label>First Name:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              className={formErrors.firstname ? 'error' : ''}
            />
            {formErrors.firstname && <span className="error-message">{formErrors.firstname}</span>}
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              className={formErrors.lastname ? 'error' : ''}
            />
            {formErrors.lastname && <span className="error-message">{formErrors.lastname}</span>}
          </div>
        </div>

        {/* Inline Email and Address */}
        <div className="input-inline">
          <div>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={formErrors.email ? 'error' : ''}
            />
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}
          </div>
          <div>
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Inline Phone and Avatar */}
        <div className="input-inline">
          <div>
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className={formErrors.phone ? 'error' : ''}
            />
            {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
          </div>
          <div>
            <label>Avatar:</label>
            <input type="file" name="avatar" onChange={handleFileChange}/>
          </div>
        </div>

        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className={formErrors.dob ? 'error' : ''}
          />
          {formErrors.dob && <span className="error-message">{formErrors.dob}</span>}
        </div>

        <button type="submit">Register</button>

        {/* Include the login button inside the form */}
        <p>
          Already have an account?
          <button type="button" onClick={() => navigate('/login')}>Login</button>
        </p>
      </form>
    </div>
  );
};

export default Register;
