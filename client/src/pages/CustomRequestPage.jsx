import { useState } from 'react';
import { submitCustomRequest } from '../api.js';

export default function CustomRequestPage() {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    setPhoto(file || null);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    try {
      const result = await submitCustomRequest(form);
      if (result.error) throw new Error(result.error);

      const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
      const message = `Hi Fugu Fie! I'd like to request a custom smock.\n\nName: ${form.name}\nPhone: ${form.phone}\n\n(Attaching a reference photo below 👇)`;

      if (whatsappNumber) {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }

      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  }

  if (status === 'sent') {
    return (
      <div className="container empty-state">
        <h2>WhatsApp should be open in a new tab.</h2>
        <p>
          Attach your reference photo there using the paperclip icon, then hit send —
          that's what gets your photo to us. We've also been notified that your request
          is on its way.
        </p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '48px 0', maxWidth: '520px' }}>
      <h1>Request a custom smock</h1>
      <p style={{ color: 'var(--indigo-soft, #5c3d66)', marginBottom: '24px' }}>
        Have a specific style, color, or pattern in mind? Send your details and a
        reference photo straight to our WhatsApp — we'll talk through what you need there.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Full name</label>
          <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Phone / WhatsApp number</label>
          <input required value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>
        <div className="form-row">
          <label>Reference photo (attached in WhatsApp, not uploaded here)</label>
          <input type="file" accept="image/*" onChange={handlePhoto} />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Selected reference"
              style={{ marginTop: '10px', maxWidth: '160px', border: '1px solid var(--cotton-deep, #d8c7a3)' }}
            />
          )}
        </div>

        {errorMsg && <p style={{ color: 'var(--rust)' }}>{errorMsg}</p>}

        <button className="btn" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Continue to WhatsApp'}
        </button>
      </form>
    </div>
  );
}
