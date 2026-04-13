import { useState } from 'react';
import API from '../utils/api';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', orderNumber: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to a backend endpoint
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: '', email: '', phone: '', orderNumber: '', message: '' });
  };

  return (
    <div className="contact-page">
      <div className="container">
        <h1>CONTACT US</h1>

        <div className="contact-form">
          {sent && <p style={{ textAlign: 'center', color: '#2a9d3a', marginBottom: 24, fontWeight: 600 }}>Message sent successfully!</p>}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Order Number</label>
                <input type="text" value={form.orderNumber} onChange={(e) => setForm({ ...form, orderNumber: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-dark" style={{ width: '100%' }}>SEND MESSAGE</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
