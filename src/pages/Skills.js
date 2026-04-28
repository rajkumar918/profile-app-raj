// filepath: d:\java\login-app\src\pages\Skills.js
import React from 'react';

export default function Skills() {
  const skills = [
    'Java (Spring Boot)', 'Filenet P8', 'Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Git', 'SQL'
  ];

  return (
    <div className="page profile-section">
      <h2>Skills</h2>
      <ul className="skills-list">
        {skills.map(s => <li key={s}>{s}</li>)}
      </ul>
    </div>
  );
}