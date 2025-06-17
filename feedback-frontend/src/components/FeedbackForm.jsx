import React, { useState } from "react";
import "./FeedbackForm.css"; // Assuming you have some styles in this file 

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
    rating: "5",
    product: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/feedback/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ Feedback submitted!");
        setFormData({ name: "", email: "", content: "", rating: "5", product: "" });
      } else {
        setMessage("❌ Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error.");
    }
  };

  return (
    <div className="feedback-container">
      <h2>📝 Submit Feedback</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="product" placeholder="Product" value={formData.product} onChange={handleChange} required />
        <textarea name="content" placeholder="Your feedback" value={formData.content} onChange={handleChange} required />
        <select name="rating" value={formData.rating} onChange={handleChange}>
          <option value="5">⭐ 5 Star</option>
          <option value="4">⭐ 4 Star</option>
          <option value="3">⭐ 3 Star</option>
          <option value="2">⭐ 2 Star</option>
          <option value="1">⭐ 1 Star</option>
        </select>
        <button type="submit">Submit</button>
        {message && <p className="feedback-message">{message}</p>}
      </form>
    </div>
  );
};

export default FeedbackForm;
