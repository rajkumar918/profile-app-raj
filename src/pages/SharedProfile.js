import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/Profile.css';

export default function SharedProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // Try server first
      try {
        const res = await fetch(`/api/profile/${userId}`);
        if (res.ok) {
          const json = await res.json();
          setProfile(json);
          return;
        }
      } catch (e) {
        // ignore
      }

      // Fallback: treat userId as short code, load local map
      const shortlinks = JSON.parse(localStorage.getItem('local_shortlinks_v1') || '{}');
      if (shortlinks[userId]) {
        const entry = shortlinks[userId];
        if (entry.expiry && Date.now() > entry.expiry) {
          // expired
          setProfile(null);
          return;
        }
        const local = JSON.parse(localStorage.getItem('local_profile_v1') || 'null');
        setProfile(local);
        return;
      }

      // Last resort: load local profile
      const local = JSON.parse(localStorage.getItem('local_profile_v1') || 'null');
      setProfile(local);
    };
    fetchProfile();
  }, [userId]);

  if (!profile) {
    return (
      <div className="page shared-profile profile-container">
        <div className="profile-card">
          <div className="profile-header" style={{ padding: '30px 20px' }}>
            <h1 style={{ margin: 0 }}>Shared Profile</h1>
            <p style={{ marginTop: 8 }}>No profile available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page shared-profile profile-container">
      <div className="profile-card">
        <div className="profile-header" style={{ padding: '30px 20px' }}>
          <h1 style={{ margin: 0 }}>{profile.name || 'Candidate Profile'}</h1>
        </div>

        <div className="profile-content">
          {profile.summary && (
            <section className="profile-section">
              <h2>Professional Summary</h2>
              <p>{profile.summary}</p>
            </section>
          )}

          {profile.skills && (
            <section className="profile-section">
              <h2>Technical Skills</h2>
              <div className="skills-grid">
                <div>
                  <p>{Array.isArray(profile.skills) ? profile.skills.join(', ') : profile.skills}</p>
                </div>
              </div>
            </section>
          )}

          {profile.experience && (
            <section className="profile-section">
              <h2>Professional Experience</h2>
              {Array.isArray(profile.experience) ? profile.experience.map((e, i) => (
                <div key={i} className="exp-item">
                  <h3>{e.title || e.company}</h3>
                  <p>{e.period || ''}</p>
                  <p>{e.details || ''}</p>
                </div>
              )) : <p>{profile.experience}</p>}
            </section>
          )}

          {profile.education && (
            <section className="profile-section">
              <h2>Education</h2>
              <p>{Array.isArray(profile.education) ? profile.education.join('; ') : profile.education}</p>
            </section>
          )}

          {profile.projects && (
            <section className="profile-section">
              <h2>Projects & Achievements</h2>
              <p>{Array.isArray(profile.projects) ? profile.projects.join('; ') : profile.projects}</p>
            </section>
          )}

          <section className="profile-section">
            <h2>Contact & Personal</h2>
            <div className="info-row">
              <label>Address:</label>
              <span>{profile.address || '—'}</span>
            </div>
            <div className="info-row">
              <label>Languages:</label>
              <span>{profile.languages ? (Array.isArray(profile.languages) ? profile.languages.join(', ') : profile.languages) : '—'}</span>
            </div>
            <div className="profile-subsection">
              <h4>Hobbies</h4>
              <p className="hobbies-list">{profile.hobbies ? (Array.isArray(profile.hobbies) ? profile.hobbies.join(', ') : profile.hobbies) : '—'}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}