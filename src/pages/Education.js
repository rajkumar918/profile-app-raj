// filepath: d:\java\login-app\src\pages\Education.js
import React from 'react';

export default function Education() {
  // replace with real data from context / API
  const education = [
    { id: 1, school: 'State Univ', degree: 'B.Sc. Computer Science', year: '2016-2020' },
    { id: 2, school: 'Online Bootcamp', degree: 'Filenet Administration', year: '2021' },
  ];

  return (
    <div className="page profile-section">
      <h2>Education</h2>
      <ul>
        {education.map(e => (
          <li key={e.id}>
            <strong>{e.degree}</strong> — {e.school} ({e.year})
          </li>
        ))}
      </ul>
    </div>
  );
}