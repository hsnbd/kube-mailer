import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      await axios.post('/api/mail/send', formData);
      setStatus({ type: 'success', message: 'Email sent successfully!' });
      setFormData({ to: '', subject: '', body: '' });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to send email' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Mail Sender</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="to">Recipient Email:</label>
          <input
            type="email"
            id="to"
            name="to"
            value={formData.to}
            onChange={handleChange}
            required
            placeholder="Enter recipient email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Enter email subject"
          />
        </div>

        <div className="form-group">
          <label htmlFor="body">Message:</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            required
            placeholder="Enter your message here..."
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Email'}
        </button>
      </form>

      {status && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
}

export default App;
