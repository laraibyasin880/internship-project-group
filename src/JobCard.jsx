import { useState } from 'react';

function JobCard({ title, customer }) {
  const [done, setDone] = useState(false);

  return (
    <div style={{ border: '1px solid #ccc', padding: 12, margin: 8 }}>
      <h3>{title}</h3>
      <p>Customer: {customer}</p>
      <p>Status: {done ? 'Completed' : 'Pending'}</p>
      <button onClick={() => setDone(!done)}>
        {done ? 'Mark Pending' : 'Mark Complete'}
      </button>
    </div>
  );
}

export default JobCard;