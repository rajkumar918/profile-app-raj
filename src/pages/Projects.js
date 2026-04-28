// filepath: d:\java\login-app\src\pages\Projects.js
import React from 'react';

export default function Projects() {
  const projects = [
    { id: 1, name: 'Order Processing API', tech: 'Spring Boot, MySQL', desc: 'High-throughput order processing' },
    { id: 2, name: 'Filenet Migration', tech: 'Filenet P8, Java', desc: 'Migrated legacy docs into Filenet' },
    { id: 3, name: 'CI/CD Pipeline', tech: 'Jenkins, Docker, Kubernetes', desc: 'Automated build and deploy' },
  ];

  return (
    <div className="page profile-section">
      <h2>Projects</h2>
      {projects.map(p => (
        <div key={p.id} className="project-item">
          <h3>{p.name} <small>({p.tech})</small></h3>
          <p>{p.desc}</p>
        </div>
      ))}
    </div>
  );
}