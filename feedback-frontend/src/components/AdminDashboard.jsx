import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const socket = io('http://localhost:3000');

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('http://localhost:3000/feedback/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data);
      } catch (err) {
        console.error('Error fetching feedbacks:', err);
      }
    };

    fetchFeedbacks();
    socket.on('feedbackUpdated', fetchFeedbacks);
    return () => socket.off('feedbackUpdated', fetchFeedbacks);
  }, [token]);

  const averageRating = (
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length || 0
  ).toFixed(2);

  const feedbackCountByProduct = feedbacks.reduce((acc, f) => {
    acc[f.product] = (acc[f.product] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(feedbackCountByProduct),
    datasets: [
      {
        label: 'Feedbacks per Product',
        data: Object.values(feedbackCountByProduct),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto' }}>
      <h2>Admin Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <p>Total Feedbacks: {feedbacks.length}</p>
      <p>Average Rating: {averageRating}</p>

      <Bar data={chartData} />

      <h3>All Feedback</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Product</th>
            <th>Name</th>
            <th>Email</th>
            <th>Feedback</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((f) => (
            <tr key={f.id}>
              <td>{f.product}</td>
              <td>{f.name || '-'}</td>
              <td>{f.email || '-'}</td>
              <td>{f.content}</td>
              <td>{f.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
