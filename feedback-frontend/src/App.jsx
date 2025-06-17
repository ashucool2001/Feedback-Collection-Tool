import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<FeedbackForm />} />
      <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;