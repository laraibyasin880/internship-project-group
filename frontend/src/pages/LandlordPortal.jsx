import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { useParams } from 'react-router-dom'
import { Shell } from './PaymentPortal'
import '../App.css'



function getStatus(expires) {
  const today = new Date()
  const end = new Date(expires)
  const days = Math.ceil((end - today) / 86400000)
  if (days < 0) return { label: 'Expired', cls: 'expired' }
  if (days <= 30) return { label: 'Expiring soon', cls: 'soon' }
  return { label: 'Valid', cls: 'valid' }
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function LandlordPortal() {
  const { token } = useParams()
  const [data, setData] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${API_URL}/api/landlord/${token}/certificates`)
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body.message || 'Could not load certificates')
        return body
      })
      .then((body) => setData(body))
      .catch((err) => setLoadError(err.message))
  }, [token])

  function download(cert) {
  window.location.href = `${API_URL}/api/landlord/${token}/certificates/${cert.id}/download`
  setMessage(`Download started for ${cert.id}.`)
}

  if (loadError) {
    return (
      <Shell>
        <div className="page">
          <h1>Certificates unavailable</h1>
          <p className="muted">{loadError}</p>
        </div>
      </Shell>
    )
  }

  if (!data) {
    return (
      <Shell>
        <div className="page">
          <p className="muted">Loading certificates...</p>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="page">
        <h1>Your Certificates</h1>
        <p className="muted">
          {data.name} · {data.property}
        </p>

        {data.certificates.length === 0 && (
          <p className="muted">No certificates have been shared with you yet.</p>
        )}

        {data.certificates.map((cert) => {
          const status = getStatus(cert.expires)
          return (
            <div key={cert.id} className="cert-card">
              <div className="cert-head">
                <strong>{cert.type}</strong>
                <span className={`status-pill ${status.cls}`}>{status.label}</span>
              </div>
              <p className="muted">Certificate ID: {cert.id}</p>
              <p className="muted">
                Issued: {formatDate(cert.issued)} · Expires: {formatDate(cert.expires)}
              </p>
              <p className="muted">By: {cert.engineer}</p>
              <button onClick={() => download(cert)}>Download PDF</button>
            </div>
          )
        })}

        {message && <p className="field-success">{message}</p>}
      </div>
    </Shell>
  )
}

export default LandlordPortal