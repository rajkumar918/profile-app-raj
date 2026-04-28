import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorSection, setEditorSection] = useState(null);
  const [editorData, setEditorData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const local = JSON.parse(localStorage.getItem('local_profile_v1') || 'null');
      setProfile(local);
    } catch (e) {
      setProfile(null);
    }
  }, []);

  // refresh when profile is updated in another tab or by Profile save (storage event)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'local_profile_v1') {
        try {
          const p = JSON.parse(e.newValue || 'null');
          setProfile(p);
        } catch (err) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    // same-tab updates from Profile (dispatchEvent)
    const onProfileUpdated = () => {
      try {
        const p = JSON.parse(localStorage.getItem('local_profile_v1') || 'null');
        setProfile(p);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('profileUpdated', onProfileUpdated);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('profileUpdated', onProfileUpdated);
    };
  }, []);

  // Inline editor helpers
  const openEditor = (section) => {
    setEditorSection(section);
    // clone current profile or create default
    setEditorData(JSON.parse(JSON.stringify(profile || { summary: '', skills: [], experience: [] })));
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    setEditorSection(null);
    setEditorData({});
  };

  const handleEditorChange = (field, value) => {
    setEditorData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill) => {
    if (!skill) return;
    setEditorData(prev => ({ ...prev, skills: [...(prev.skills || []), skill] }));
  };

  const removeSkill = (idx) => {
    setEditorData(prev => ({ ...prev, skills: (prev.skills || []).filter((s, i) => i !== idx) }));
  };

  const saveEditor = () => {
    try {
      const merged = { ...(profile || {}), ...(editorData || {}) };
      localStorage.setItem('local_profile_v1', JSON.stringify(merged));
      // notify other tabs and same-tab listeners
      window.dispatchEvent(new Event('profileUpdated'));
      setProfile(merged);
      closeEditor();
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your dashboard, {user?.name}!</p>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>Professional Summary</h2>
          <p className="muted">{(profile && profile.summary) || 'No professional summary provided. Edit your profile to add one.'}</p>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => openEditor('summary')}>Edit Summary</button>
          </div>
        </div>
        
        <div className="card">
          <h2>User Information</h2>
          <div className="info-block">
            <p><strong>Email:</strong> {user?.email || (profile && profile.email)}</p>
            <p><strong>Name:</strong> {user?.name || (profile && profile.name)}</p>
            <p><strong>Contact:</strong> {(profile && profile.phone) || 'Not provided'}</p>
            <p><strong>DOB:</strong> {(profile && profile.dob) || 'Not provided'}</p>
            <p><strong>Parents:</strong> {(profile && profile.parents) || 'Not provided'}</p>
            <p><strong>Social:</strong> {(profile && profile.social && profile.social.join(', ')) || 'Add LinkedIn/GitHub'}</p>
          </div>
        </div>

        <div className="card">
          <h2>Technical Skills (Quick View)</h2>
          <div className="skills-quick">
            {profile && profile.skills && profile.skills.length > 0 ? (
              <ul>
                {profile.skills.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            ) : (
              <p className="muted">No skills added yet. Edit your profile to add skills.</p>
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => openEditor('skills')}>Edit Skills</button>
          </div>
        </div>

        <div className="card">
          <h2>Experience (Quick View)</h2>
          <div className="experience-quick">
            {profile && profile.experience && profile.experience.length > 0 ? (
              profile.experience.map((exp, idx) => (
                <div key={idx} className="exp-brief">
                  <h4>{exp.title || exp.company || `Role ${idx + 1}`}</h4>
                  <p className="muted">{exp.duration || exp.period || ''}</p>
                  <p>{exp.summary || (exp.responsibilities && exp.responsibilities.slice(0, 2).join(', '))}</p>
                </div>
              ))
            ) : (
              <p className="muted">No experience details yet. Edit your profile to add roles.</p>
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            <button className="btn" onClick={() => openEditor('experience')}>Edit Experience</button>
          </div>
        </div>

        <div className="card">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10</h3>
              <p>Projects</p>
            </div>
            <div className="stat-item">
              <h3>25</h3>
              <p>Tasks</p>
            </div>
            <div className="stat-item">
              <h3>5</h3>
              <p>Teams</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            <li>✓ Logged in successfully</li>
            <li>✓ Updated profile</li>
            <li>✓ Created new project</li>
          </ul>
        </div>
      </div>

      {editorOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ width: 800, maxWidth: '95%', background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 6px 24px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginTop: 0 }}>Edit {editorSection}</h3>
            {editorSection === 'summary' && (
              <div>
                <textarea value={editorData.summary || ''} onChange={(e) => handleEditorChange('summary', e.target.value)} rows={6} style={{ width: '100%', padding: 8 }} />
              </div>
            )}

            {editorSection === 'skills' && (
              <div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {(editorData.skills || []).map((s, i) => (
                    <div key={i} style={{ background: '#eef', padding: '6px 8px', borderRadius: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span>{s}</span>
                      <button onClick={() => removeSkill(i)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>✕</button>
                    </div>
                  ))}
                </div>
                <AddSkillInput onAdd={(v) => addSkill(v)} />
              </div>
            )}

            {editorSection === 'experience' && (
              <div>
                <p className="muted">Edit experience as JSON array items (quick edit). For detailed edits go to Profile page.</p>
                <textarea value={JSON.stringify(editorData.experience || [], null, 2)} onChange={(e) => handleEditorChange('experience', safeParseJSON(e.target.value, []))} rows={8} style={{ width: '100%', padding: 8 }} />
              </div>
            )}

            <div style={{ marginTop: 12, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="btn" onClick={closeEditor}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEditor}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// small helper input component to add skills
const AddSkillInput = ({ onAdd }) => {
  const [val, setVal] = React.useState('');
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input placeholder="Add skill" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (val.trim()) { onAdd(val.trim()); setVal(''); } } }} />
      <button className="btn" onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(''); } }}>Add</button>
    </div>
  );
};

const safeParseJSON = (text, fallback) => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return fallback;
  }
};

export default Dashboard;
