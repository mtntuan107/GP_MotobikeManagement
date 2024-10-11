import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from "./components/Register";
import Profile from "./components/Profile";
import Employee from "./components/Employee";
import Schedule from "./components/Schedule";
import Motorbike from "./components/Motorbike";
import Maintenance from "./components/Maintenance";
import UserHistory from "./components/UserHistory";
import History from "./components/History";
function App() {

  return (
    <Router>
      <Routes>
        {/*<Route path="/" element={<Home />} />*/}<Route path="/" element={<Home />}>
          <Route path="profile" element={<Profile />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="motorbike" element={<Motorbike />} />
          <Route path="userhistory" element={<UserHistory />} />
        </Route>
        <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        {/*  <Route path="/profile" element={<Profile />} />*/}
        {/*  /!*<Route path="/employee" element={<Employee />} />*!/*/}
        {/*  <Route path="/schedule" element={<Schedule />} />*/}
        {/*<Route path="/motorbike" element={<Motorbike />} />*/}
        {/*<Route path="/maintenance" element={<Maintenance />} />*/}
        {/*<Route path="/history" element={<History />} />*/}
        <Route path="/employee" element={<Employee />}>
            <Route index element={<Profile />} /> {/* Default to Profile */}
                    <Route path="maintenance" element={<Maintenance />} />
                    <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;