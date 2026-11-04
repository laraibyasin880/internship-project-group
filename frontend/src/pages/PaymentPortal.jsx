import { useState, useEffect } from 'react'
import { API_URL } from '../config'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  LayoutDashboard,
  Mic,
  Briefcase,
  CalendarDays,
  FileText,
  ShieldCheck,
  MessageCircle,
  Settings,
  Wrench,
  UserRound,
  Building2,
} from 'lucide-react'
import '../App.css'

function detectBrand(digits) {
  if (digits.startsWith('4')) return 'Visa'
  if (/^5[1-5]/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'Amex'
  return ''
}

function passesLuhn(digits) {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

function formatCard(digits) {
  if (detectBrand(digits) === 'Amex') {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)]
      .filter(Boolean)
      .join(' ')
  }
  return digits.slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ')
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length <= 2 ? digits : digits.slice(0, 2) + '/' + digits.slice(2)
}

function validateName(value) {
  if (!value.trim()) return 'Name on card is required.'
  if (value.trim().length < 3) return 'Enter the full name as shown on the card.'
  return ''
}

function validateEmail(value) {
  if (!value.trim()) return 'Email is required.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.'
  return ''
}

function validateCard(digits) {
  if (!digits) return 'Card number is required.'
  const brand = detectBrand(digits)
  if (!brand) return 'Only Visa, Mastercard and Amex cards are accepted.'
  const needed = brand === 'Amex' ? 15 : 16
  if (digits.length !== needed) return `${brand} card must have ${needed} digits.`
  if (!passesLuhn(digits)) return 'This card number is not valid. Please check it.'
  return ''
}

function validateExpiry(value) {
  const match = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!match) return 'Enter expiry as MM/YY, for example 08/28.'
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return 'Month must be between 01 and 12.'
  const now = new Date()
  if (year * 12 + month - 1 < now.getFullYear() * 12 + now.getMonth()) {
    return 'This card has expired.'
  }
  return ''
}

function validateCvc(value, digits) {
  const needed = detectBrand(digits) === 'Amex' ? 4 : 3
  if (!new RegExp(`^\\d{${needed}}$`).test(value)) return `CVC must be ${needed} digits.`
  return ''
}

const workspaceItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Voice Quote', icon: Mic },
  { label: 'Jobs', icon: Briefcase },
  { label: 'Schedule', icon: CalendarDays },
  { label: 'Invoicing', icon: FileText },
  { label: 'Certificates', icon: ShieldCheck },
  { label: 'WhatsApp Inbox', icon: MessageCircle, badge: 3 },
]

const portalItems = [
  { label: 'Customer Portal', icon: UserRound, to: '/pay/INV-1024' },
  { label: 'Landlord Portal', icon: Building2, to: '/landlord/abc123' },
]

function NavLink({ label, icon: Icon, badge, active, to }) {
  const className = active ? 'nav-link active' : 'nav-link'
  const content = (
    <>
      <Icon size={18} />
      <span>{label}</span>
      {badge && <span className="badge">{badge}</span>}
    </>
  )

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <a href="#" className={className} onClick={(e) => e.preventDefault()}>
      {content}
    </a>
  )
}

function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-icon">
          <Wrench size={20} />
        </span>
        <span className="brand-name">TradesDash</span>
      </div>

      <p className="nav-section">Workspace</p>
      <nav>
        {workspaceItems.map((item) => (
          <NavLink key={item.label} {...item} />
        ))}
      </nav>

      <p className="nav-section">Portals</p>
      <nav>
        {portalItems.map((item) => (
          <NavLink
            key={item.label}
            {...item}
            active={pathname.startsWith('/' + item.to.split('/')[1])}
          />
        ))}
      </nav>

      <p className="nav-section">Account</p>
      <nav>
        <NavLink label="Settings" icon={Settings} />
      </nav>

      <div className="sidebar-footer">
        <strong>Okafor Plumbing & Heating</strong>
        <span>Gas Safe 748213 · Leeds</span>
      </div>
    </aside>
  )
}

export function Shell({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <header className="topbar">
          <span className="secure">Secure checkout</span>
        </header>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, strong }) {
  return (
    <div className={strong ? 'row strong' : 'row'}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg className="check-icon" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="25" fill="none" />
      <path fill="none" d="M14 27 l8 8 l16 -16" />
    </svg>
  )
}

function CardPreview({ digits, brand, name, expiry }) {
  const shown = (digits + '•'.repeat(16)).slice(0, 16).replace(/(.{4})(?=.)/g, '$1 ')
  return (
    <div className={`card-preview ${brand ? brand.toLowerCase() : 'generic'}`}>
      <div className="card-top">
        <span className="chip" />
        <span className="card-brand">{brand || 'Card'}</span>
      </div>
      <div className="card-number">{shown}</div>
      <div className="card-bottom">
        <div>
          <small>Card holder</small>
          <div>{name.trim() ? name.toUpperCase() : 'YOUR NAME'}</div>
        </div>
        <div>
          <small>Expires</small>
          <div>{expiry || 'MM/YY'}</div>
        </div>
      </div>
    </div>
  )
}

function PaymentPortal() {
  const { invoiceId } = useParams()

  const [invoice, setInvoice] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [payError, setPayError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | processing | success
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    fetch(`${API_URL}/api/invoices/${invoiceId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Invoice not found')
        return res.json()
      })
      .then((data) => setInvoice({ ...data, number: data.id }))
      .catch((err) => setLoadError('Could not load the invoice: ' + err.message))
  }, [invoiceId])

  const digits = card.replace(/\D/g, '')
  const brand = detectBrand(digits)

  function clearError(field) {
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  function handlePay() {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      card: validateCard(digits),
      expiry: validateExpiry(expiry),
      cvc: validateCvc(cvc, digits),
    }
    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return

    setStatus('processing')
    setPayError('')

    fetch(`${API_URL}/api/invoices/${invoice.id}/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brand, last4: digits.slice(-4), email: email.trim() }),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) throw new Error(data.message || 'Payment failed')
        return data
      })
      .then((payment) => {
        setReceipt({
          id: payment.id,
          date: new Date(payment.date).toLocaleString('en-GB'),
          brand: payment.brand,
          last4: payment.last4,
          email: payment.email,
        })
        setStatus('success')
        setCard('')
        setExpiry('')
        setCvc('')
      })
      .catch((err) => {
        setPayError(err.message)
        setStatus('idle')
      })
  }

  function startAgain() {
    setReceipt(null)
    setStatus('idle')
    setErrors({})
    setInvoice((prev) => ({ ...prev, status: 'Paid' }))
  }

  if (loadError) {
    return (
      <Shell>
        <div className="page">
          <h1>Invoice unavailable</h1>
          <p className="muted">{loadError}</p>
        </div>
      </Shell>
    )
  }

  if (!invoice) {
    return (
      <Shell>
        <div className="page">
          <p className="muted">Loading invoice...</p>
        </div>
      </Shell>
    )
  }

  const total = invoice.total

  if (status === 'success' && receipt) {
    return (
      <Shell>
        <div className="page">
          <div className="check-wrap">
            <CheckIcon />
          </div>
          <h1 className="center">Payment Successful</h1>
          <p className="muted center">
            Thank you, {invoice.customer}. Your payment has been received.
          </p>

          <div className="receipt">
            <Row label="Invoice" value={invoice.number} />
            <Row label="Transaction ID" value={receipt.id} />
            <Row label="Date" value={receipt.date} />
            <Row label="Paid with" value={`${receipt.brand} ending ${receipt.last4}`} />
            <Row label="Receipt sent to" value={receipt.email} />
            <Row label="Amount paid" value={`Rs ${total}`} strong />
          </div>

          <button className="btn-secondary" onClick={() => window.print()}>
            Print receipt
          </button>
          <button className="btn-secondary" onClick={startAgain}>
            Back to invoice
          </button>
        </div>
      </Shell>
    )
  }

  if (invoice.status === 'Paid') {
    return (
      <Shell>
        <div className="page">
          <div className="check-wrap">
            <CheckIcon />
          </div>
          <h1 className="center">Invoice paid</h1>
          <p className="muted center">
            Invoice {invoice.number} for {invoice.customer} has been paid. Thank you!
          </p>

          <div className="receipt">
            {invoice.items.map((item) => (
              <Row key={item.name} label={item.name} value={`Rs ${item.price}`} />
            ))}
            <Row label="Total paid" value={`Rs ${total}`} strong />
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="page">
        <div className="invoice-head">
          <h1>Invoice {invoice.number}</h1>
          <span className={invoice.status === 'Paid' ? 'status-badge paid' : 'status-badge'}>
            {invoice.status}
          </span>
        </div>
        <p className="muted">
          Customer: {invoice.customer} · Date: {invoice.date}
        </p>
        <p className="muted">Due by {invoice.dueDate}</p>

        <div className="receipt">
          {invoice.items.map((item) => (
            <Row key={item.name} label={item.name} value={`Rs ${item.price}`} />
          ))}
          <Row label="Total due" value={`Rs ${total}`} strong />
        </div>

        <h3 className="section-title">Pay securely</h3>

        <CardPreview digits={digits} brand={brand} name={name} expiry={expiry} />

        <div className="field">
          <input
            type="text"
            autoComplete="cc-name"
            placeholder="Name on card"
            value={name}
            className={errors.name ? 'invalid' : ''}
            onChange={(e) => {
              setName(e.target.value)
              clearError('name')
            }}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="field">
          <input
            type="email"
            autoComplete="email"
            placeholder="Email for receipt"
            value={email}
            className={errors.email ? 'invalid' : ''}
            onChange={(e) => {
              setEmail(e.target.value)
              clearError('email')
            }}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="field">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="Card number"
            value={card}
            className={errors.card ? 'invalid' : ''}
            onChange={(e) => {
              setCard(formatCard(e.target.value.replace(/\D/g, '')))
              clearError('card')
            }}
          />
          {errors.card && <p className="field-error">{errors.card}</p>}
        </div>

        <div className="two-col">
          <div className="field">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              maxLength={5}
              value={expiry}
              className={errors.expiry ? 'invalid' : ''}
              onChange={(e) => {
                setExpiry(formatExpiry(e.target.value))
                clearError('expiry')
              }}
            />
            {errors.expiry && <p className="field-error">{errors.expiry}</p>}
          </div>

          <div className="field">
            <input
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="CVC"
              maxLength={4}
              value={cvc}
              className={errors.cvc ? 'invalid' : ''}
              onChange={(e) => {
                setCvc(e.target.value.replace(/\D/g, ''))
                clearError('cvc')
              }}
            />
            {errors.cvc && <p className="field-error">{errors.cvc}</p>}
          </div>
        </div>

        {payError && <p className="field-error">{payError}</p>}

        <button onClick={handlePay} disabled={status === 'processing' || invoice.status === 'Paid'}>
          {status === 'processing' ? (
            <>
              <span className="spinner" />
              Processing...
            </>
          ) : (
            `Pay Rs ${total}`
          )}
        </button>
        <p className="secure-note">Your details are handled securely.</p>
      </div>
    </Shell>
  )
}

export default PaymentPortal