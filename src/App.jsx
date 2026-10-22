import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import TemplateLibrary from './pages/TemplateLibrary';
import ReviewRequest from './pages/ReviewRequest';
import PaymentChase from './pages/PaymentChase';

// Jis page par ho uska button navy ho jata hai
const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-navy-700 text-white' : 'text-navy-700 hover:bg-navy-50'
  }`;

function MyScreensNav() {
  return (
    <nav className="mx-auto mb-6 flex max-w-3xl flex-wrap gap-2 rounded-lg border border-line bg-white p-2 shadow-sm">
      <NavLink to="/inbox/templates" className={linkClass}>
        Template Library
      </NavLink>
      <NavLink to="/inbox/reviews/new" className={linkClass}>
        Review Request
      </NavLink>
      <NavLink to="/inbox/chase/INV-1001" className={linkClass}>
        Payment Chase
      </NavLink>
    </nav>
  );
}

function App() {
  return (
    <div className="p-6">
      <MyScreensNav />
      <Routes>
        <Route path="/" element={<Navigate to="/inbox/templates" replace />} />
        <Route path="/inbox/templates" element={<TemplateLibrary />} />
        <Route path="/inbox/reviews/new" element={<ReviewRequest />} />
        <Route path="/inbox/chase/:invoiceId" element={<PaymentChase />} />
      </Routes>
    </div>
  );
}

export default App;