import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import PaymentPortal from './pages/PaymentPortal'
import LandlordPortal from './pages/LandlordPortal'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/pay/:invoiceId" element={<PaymentPortal />} />
        <Route path="/landlord/:token" element={<LandlordPortal />} />
        <Route path="*" element={<Navigate to="/pay/INV-1024" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
