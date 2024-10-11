import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiURL from "../api/api"; // This should be your backend API URL
import '../styles/Motorbike.css'; // Import the CSS file here

function Motorbike() {
  const [motorbikeData, setMotorbikeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    // Fetch motorbike data from the API
    axios.get(`${apiURL}/user_motorbike/get_motorbike/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setMotorbikeData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching motorbike data:", err);
        setError("Error fetching motorbike data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!motorbikeData) {
    return <div>No motorbike data available</div>;
  }

  return (
    <div className="motorbike-info">
      {/* Display image at the top */}
      {motorbikeData.motorbike_model.image && (
        <div className="motorbike-image">
          <img
            src={motorbikeData.motorbike_model.image}
            alt={`${motorbikeData.motorbike_model.brand} image`}
          />
        </div>
      )}
      <h2>Motorbike Details</h2>
      <div>
        <strong>License Plate:</strong> {motorbikeData.license_plate}
      </div>
      <div>
        <strong>Chassis Number:</strong> {motorbikeData.chassis_number}
      </div>
      <div>
        <strong>Engine Number:</strong> {motorbikeData.engine_number}
      </div>
      <div>
        <strong>Buy Date:</strong> {new Date(motorbikeData.buy_days).toLocaleDateString()}
      </div>

      <div>
        <strong>Brand:</strong> {motorbikeData.motorbike_model.brand}
      </div>
      <div>
        <strong>Engine Capacity:</strong> {motorbikeData.motorbike_model.engine_capacity}
      </div>
      <div>
        <strong>Model Code:</strong> {motorbikeData.motorbike_model.model_code}
      </div>
      <div>
        <strong>Year:</strong> {motorbikeData.motorbike_model.year}
      </div>
    </div>
  );
}

export default Motorbike;
