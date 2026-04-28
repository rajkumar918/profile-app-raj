// filepath: d:\java\login-app\src\pages\Experience.js
import React from 'react';

export default function Experience() {
  const experience = [
    { id: 1, title: 'Java Developer', company: 'ACME Corp', period: '2020-2022', details: 'Backend services, Spring Boot' },
    { id: 2, title: 'Filenet Engineer', company: 'DocSys', period: '2022-2024', details: 'Content management, integrations' },
    { id: 3, title: 'DevOps Engineer', company: 'CloudOps', period: '2024-Present', details: 'CI/CD, Docker, Kubernetes' },
  ];

  return (
    <div className="page profile-section">
      <h2>Experience</h2>
      {experience.map(x => (
        <div key={x.id} className="exp-item">
          <h3>{x.title} — {x.company}</h3>
          <p>{x.period}</p>
          <p>{x.details}</p>
        </div>
      ))}
    </div>
  );
}