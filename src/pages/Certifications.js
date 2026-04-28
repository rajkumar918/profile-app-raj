// filepath: d:\java\login-app\src\pages\Certifications.js
import React from 'react';

export default function Certifications() {
  const certs = [
    { id: 1, name: 'Oracle Certified Professional Java SE', year: 2021 },
    { id: 2, name: 'Filenet Administrator', year: 2022 },
    { id: 3, name: 'Certified Kubernetes Administrator', year: 2024 },
  ];

  return (
    <div className="page profile-section">
      <h2>Certifications</h2>
      <ul>
        {certs.map(c => <li key={c.id}>{c.name} — {c.year}</li>)}
      </ul>
    </div>
  );
}