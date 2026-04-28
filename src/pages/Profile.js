import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';
import Toast from '../components/Toast';

// Simple helper to persist profile locally (fallback when API is not available)
const LOCAL_PROFILE_KEY = 'local_profile_v1';
const LOCAL_SHORTLINKS_KEY = 'local_shortlinks_v1';

const Profile = () => {
  const { user } = useAuth();
  const userId = (user && user.id) || localStorage.getItem('userId') || 'me';
  const shareUrl = `${window.location.origin}/shared/${userId}`;
  const [toastMsg, setToastMsg] = useState('');
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [privacy, setPrivacy] = useState({});
  const [activeSection, setActiveSection] = useState(null);
  const navRef = useRef();
  const [shortExpiryDays, setShortExpiryDays] = useState(30);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem(LOCAL_PROFILE_KEY) || 'null');

    // default skills and experience (used to seed when local storage is empty)
    const defaultSkills = [
      'HTML', 'CSS', 'JavaScript', 'RESTful APIs', 'Web Services', 'Spring MVC', 'IBM WebSphere Application Server',
      'CorelDraw', 'Photoshop', 'Java', 'Python', 'C', 'SQL', 'Oracle', 'DB2', 'SQL Server',
      'Linux (RHEL, Ubuntu)', 'Docker', 'Kubernetes', 'IBM FileNet P8', 'IBM Content Navigator', 'Splunk', 'Log4j', 'Bash', 'Ansible'
    ];

    const defaultExperience = [
      {
        company: 'HSBC',
        title: 'Software Engineer',
        period: 'Jul 2023 – Present',
        summary: 'Administered and optimized IBM FileNet P8 environments (Content Engine, Process Engine, Application Engine).',
      },
      {
        company: 'TCS',
        title: 'System Engineer',
        period: 'Nov 2020 – Jun 2023',
        summary: 'Led FileNet API integration projects and migrated legacy content systems to FileNet.'
      }
    ];

    const base = {
      name: (user && user.name) || (local && local.name) || '',
      email: (user && user.email) || (local && local.email) || '',
      address: (local && local.address) || '',
      languages: (local && local.languages) || ['English'],
      hobbies: (local && local.hobbies) || ['Reading', 'Traveling'],
      summary: (local && local.summary) || '',
      skills: (local && local.skills) || defaultSkills,
      experience: (local && local.experience) || defaultExperience,
      education: (local && local.education) || [],
      projects: (local && local.projects) || [],
      certifications: (local && local.certifications) || []
    };

    setProfile(base);
    // if no local data, seed localStorage so dashboard and other pages can read it
    if (!local) {
      saveLocalProfile(base);
    } else {
      // ensure privacy object exists
      setPrivacy((local && local.privacy) || {
        summary: true, skills: true, experience: true, education: true, projects: true, certifications: true, contact: true
      });
      // if local exists but missing skills/experience, merge and persist
      const needSave = (!local.skills || local.skills.length === 0) || (!local.experience || local.experience.length === 0);
      if (needSave) {
        const merged = { ...local, skills: local.skills && local.skills.length ? local.skills : defaultSkills, experience: local.experience && local.experience.length ? local.experience : defaultExperience };
        saveLocalProfile(merged);
        setProfile(merged);
      }
    }

    // ensure privacy set when local is missing
    if (!local) {
      setPrivacy({ summary: true, skills: true, experience: true, education: true, projects: true, certifications: true, contact: true });
    }
    // if URL contains a hash like #skills, show that section
    try {
      const hash = window.location.hash || '';
      if (hash && hash.startsWith('#')) setActiveSection(hash.replace('#', ''));
    } catch (e) {
      // ignore
    }
  }, [user]);

  // listen for updates coming from other components/tabs so UI refreshes
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LOCAL_PROFILE_KEY) {
        try {
          const p = JSON.parse(e.newValue || 'null');
          setProfile(p);
        } catch (err) {
          // ignore
        }
      }
    };
    const onProfileUpdated = () => {
      try {
        const p = JSON.parse(localStorage.getItem(LOCAL_PROFILE_KEY) || 'null');
        setProfile(p);
      } catch (err) {
        // ignore
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('profileUpdated', onProfileUpdated);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('profileUpdated', onProfileUpdated);
    };
  }, []);

  const saveLocalProfile = (data) => {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(data));
  };

  const updateProfileField = (field, value) => {
    setProfile(prev => {
      const next = { ...prev, [field]: value };
      return next;
    });
  };

  // generate and persist a short link code, return short URL
  const generateShortLink = (uid, expiryDays = 30) => {
    const code = Math.random().toString(36).slice(2, 8);
    const shortMap = JSON.parse(localStorage.getItem(LOCAL_SHORTLINKS_KEY) || '{}');
    shortMap[code] = { uid, created: Date.now(), expiry: Date.now() + expiryDays * 24 * 3600 * 1000 };
    localStorage.setItem(LOCAL_SHORTLINKS_KEY, JSON.stringify(shortMap));
    return `${window.location.origin}/s/${code}`;
  };

  const createShortLink = () => {
    const url = generateShortLink(userId, shortExpiryDays);
    setToastMsg(`Short link: ${url}`);
    copyToClipboard(url, 'Short link copied');
  };

  const copyToClipboard = async (text, msg = 'Copied') => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMsg(msg);
    } catch (e) {
      console.warn('Clipboard failed', e);
      setToastMsg('Copy failed');
    }
  };

  const getQRUrl = (text) => {
    // Use qrserver API for a reliable public QR generator
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  const downloadQR = async (text) => {
    const url = getQRUrl(text);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('QR fetch failed');
      const blob = await res.blob();
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = 'qr.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
    } catch (e) {
      console.warn('downloadQR error', e);
      setToastMsg('QR download failed');
    }
  };

  const handleSave = () => {
    // normalize comma-separated fields into arrays
    const data = { ...profile };
    if (typeof data.social === 'string') {
      data.social = data.social.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof data.languages === 'string') {
      data.languages = data.languages.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (typeof data.hobbies === 'string') {
      data.hobbies = data.hobbies.split(',').map(s => s.trim()).filter(Boolean);
    }
    saveLocalProfile(data);
    setProfile(data);
    setEditing(false);
    setToastMsg('Profile saved locally');
    // notify other components (same-tab listeners and other tabs)
    try {
      window.dispatchEvent(new Event('profileUpdated'));
      // also write to localStorage again to trigger storage event in other tabs
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(data));
    } catch (e) {
      // ignore
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (id) => {
    // show just the clicked section (so details are visible) then scroll to it
    setActiveSection(id);
    // small delay to allow layout changes before scrolling
    setTimeout(() => scrollTo(id), 50);
  };

  const copyShareLink = () => copyToClipboard(shareUrl, 'Share link copied');

  if (!profile) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{(user && user.name && user.name.charAt(0).toUpperCase()) || ''}</div>
          {editing ? (
            <div>
              <input className="profile-name-input" value={profile.name || ''} onChange={(e) => updateProfileField('name', e.target.value)} />
              <input className="profile-email-input" value={profile.email || ''} onChange={(e) => updateProfileField('email', e.target.value)} />
            </div>
          ) : (
            <>
              <h1>{(user && user.name) || profile.name || ''}</h1>
              <p>{(user && user.email) || profile.email || ''}</p>
            </>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-nav" ref={navRef}>
            <button onClick={() => handleNavClick('summary')}>Summary</button>
            <button onClick={() => handleNavClick('skills')}>Skills</button>
            <button onClick={() => handleNavClick('experience')}>Experience</button>
            <button onClick={() => handleNavClick('education')}>Education</button>
            <button onClick={() => handleNavClick('projects')}>Projects</button>
            <button onClick={() => handleNavClick('certifications')}>Certifications</button>
            <button onClick={() => handleNavClick('contact')}>Contact</button>
            <button style={{ marginLeft: 'auto' }} onClick={() => setActiveSection(null)}>Show All</button>
          </div>

          <section className={`profile-section ${activeSection && activeSection !== 'summary' ? 'collapsed' : 'expanded'}`} id="summary">
            <h2>Professional Summary</h2>
            {editing ? (
              <textarea
                value={profile.summary || ''}
                onChange={(e) => updateProfileField('summary', e.target.value)}
                rows={6}
                style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
              />
            ) : (
              <p>{(profile && profile.summary) || 'No professional summary provided. Edit your profile to add one.'}</p>
            )}
          </section>

          <section className={`profile-section ${activeSection && activeSection !== 'skills' ? 'collapsed' : 'expanded'}`} id="skills">
            <h2>Technical Skills</h2>
            <div className="skills-chips">
              {(profile.skills || []).map((s, i) => (
                <div key={i} className="chip">
                  <span>{s}</span>
                  {editing && <button onClick={() => removeSkillProfile(i)}>✕</button>}
                </div>
              ))}
            </div>
            {editing && <AddSkillInput onAdd={(v) => addSkillProfile(v)} />}

            <details style={{ marginTop: 12 }}>
              <summary>Skill categories & details</summary>
              <div className="skills-grid" style={{ marginTop: 12 }}>
                <div>
                  <h4>Web & Application Technologies</h4>
                  <p>HTML, CSS, JavaScript, RESTful APIs, Web Services, Spring MVC, IBM WebSphere Application Server</p>
                </div>
                <div>
                  <h4>Design Tools</h4>
                  <p>CorelDraw, Photoshop</p>
                </div>
                <div>
                  <h4>Programming Languages</h4>
                  <p>Java / Jakarta EE (FileNet API development), Python (automation, integration), C</p>
                </div>
                <div>
                  <h4>Databases & Query Languages</h4>
                  <p>SQL (queries, schema design, metadata modeling), Oracle, DB2, SQL Server (FileNet repository management)</p>
                </div>
                <div>
                  <h4>Operating Systems</h4>
                  <p>Linux (RHEL, Ubuntu) – administration, scripting, security hardening</p>
                </div>
                <div>
                  <h4>Containerization & Orchestration</h4>
                  <p>Docker (containerized deployments), Kubernetes (scalable orchestration, hybrid cloud readiness)</p>
                </div>
                <div>
                  <h4>ECM Platforms</h4>
                  <p>IBM FileNet P8 (Content Engine, Process Engine, Application Engine), IBM Content Navigator, IBM Case Manager, IBM Datacap</p>
                </div>
                <div>
                  <h4>Monitoring & Logs</h4>
                  <p>Splunk (system monitoring, diagnostics), Log4j (application log analysis)</p>
                </div>
                <div>
                  <h4>Scripting & Tools</h4>
                  <p>Bash, Cron jobs (automation), Ansible (basic – configuration management)</p>
                </div>
                <div>
                  <h4>Integration & Web Services</h4>
                  <p>FileNet Content Engine API & Process Engine API, REST API integrations with third-party applications</p>
                </div>
                <div>
                  <h4>Security & Compliance</h4>
                  <p>SSL/TLS Certificates, Security Hardening, Role-based Access Control, IAM concepts, GDPR, HIPAA</p>
                </div>
                <div>
                  <h4>System Optimization & Resilience</h4>
                  <p>Workflow optimization, performance tuning of queries and processes, disaster recovery planning, backup solutions</p>
                </div>
              </div>
            </details>
          </section>

          <section className={`profile-section ${activeSection && activeSection !== 'experience' ? 'collapsed' : 'expanded'}`} id="experience">
            <h2>Professional Experience</h2>
            <div className="exp-item">
              <h3>HSBC — Software Engineer (Jul 2023 – Present)</h3>
              <ul>
                <li>Administered and optimized IBM FileNet P8 environments (Content Engine, Process Engine, Application Engine).</li>
                <li>Designed and implemented workflows and case management solutions, reducing manual processing time by 30%.</li>
                <li>Customized IBM Content Navigator to improve user experience and streamline document access.</li>
                <li>Managed WebSphere Application Server deployments, ensuring high availability and performance.</li>
                <li>Collaborated with database teams to optimize Oracle/DB2 queries, improving system response times.</li>
                <li>Implemented security policies and role-based access controls, ensuring compliance with organizational standards.</li>
                <li>Automated routine administration tasks using Python and shell scripting, reducing downtime and manual effort.</li>
                <li>Monitored system health using Splunk and Log4j, proactively identifying and resolving performance bottlenecks.</li>
              </ul>
              <p><strong>Key Achievements:</strong> Led migration of FileNet components to a hybrid cloud environment; developed REST API integrations with third-party applications; implemented disaster recovery strategies achieving 99.9% system uptime.</p>
            </div>

            <div className="exp-item">
              <h3>TCS — System Engineer (Nov 2020 – Jun 2023)</h3>
              <ul>
                <li>Led FileNet API integration projects for banking clients.</li>
                <li>Developed IBM Content Navigator (ICN) plugins and implemented document-level security.</li>
                <li>Migrated legacy content systems to FileNet with zero downtime and full data integrity.</li>
                <li>Deployed and configured FileNet components on WebSphere Application Server in Linux environments.</li>
                <li>Developed and maintained shell scripts for routine maintenance, health checks, and backups.</li>
                <li>Supported FileNet upgrades, fix packs, and patch deployments.</li>
                <li>Collaborated with developers to deploy and troubleshoot Java-based custom FileNet applications.</li>
                <li>Managed user access, security policies, and LDAP integration.</li>
              </ul>
            </div>
          </section>

          <section className={`profile-section ${activeSection && activeSection !== 'education' ? 'collapsed' : 'expanded'}`} id="education">
            <h2>Education</h2>
            <p>Bachelor of Technology in Computer Science — (2020)</p>
          </section>

          <section className={`profile-section ${activeSection && activeSection !== 'projects' ? 'collapsed' : 'expanded'}`} id="projects">
            <h2>Projects & Achievements</h2>
            <ul>
              <li>Automated 80% of manual document routing using FileNet Triggers.</li>
              <li>Reduced access-related incidents by 60% through ACLs and RBAC.</li>
              <li>Migrated legacy systems with full data integrity.</li>
            </ul>
          </section>

          <section className={`profile-section ${activeSection && activeSection !== 'certifications' ? 'collapsed' : 'expanded'}`} id="certifications">
            <h2>Certifications</h2>
            <ul>
              <li>Oracle Certified Professional Java SE</li>
              <li>Filenet Administrator</li>
              <li>Certified Kubernetes Administrator</li>
            </ul>
          </section>

          <section className={`profile-section ${activeSection && activeSection !== 'contact' ? 'collapsed' : 'expanded'}`} id="contact">
            <h2>Contact & Personal</h2>
            {editing ? (
              <div className="contact-edit">
                <div className="info-row">
                  <label>Address:</label>
                  <input value={profile.address || ''} onChange={(e) => updateProfileField('address', e.target.value)} />
                </div>
                <div className="info-row">
                  <label>Contact (phone):</label>
                  <input value={profile.phone || ''} onChange={(e) => updateProfileField('phone', e.target.value)} />
                </div>
                <div className="info-row">
                  <label>DOB:</label>
                  <input type="date" value={profile.dob || ''} onChange={(e) => updateProfileField('dob', e.target.value)} />
                </div>
                <div className="info-row">
                  <label>Parents:</label>
                  <input value={profile.parents || ''} onChange={(e) => updateProfileField('parents', e.target.value)} />
                </div>
                <div className="info-row">
                  <label>Social (comma-separated):</label>
                  <input value={typeof profile.social === 'string' ? profile.social : (profile.social || []).join(', ')} onChange={(e) => updateProfileField('social', e.target.value)} />
                </div>
                <div className="info-row">
                  <label>Languages (comma-separated):</label>
                  <input value={typeof profile.languages === 'string' ? profile.languages : (profile.languages || []).join(', ')} onChange={(e) => updateProfileField('languages', e.target.value)} />
                </div>
                <div className="info-row">
                  <label>Hobbies (comma-separated):</label>
                  <input value={typeof profile.hobbies === 'string' ? profile.hobbies : (profile.hobbies || []).join(', ')} onChange={(e) => updateProfileField('hobbies', e.target.value)} />
                </div>
              </div>
            ) : (
              <>
                <div className="info-row">
                  <label>Address:</label>
                  <span>{(profile && profile.address) || 'Not provided.'}</span>
                </div>
                <div className="info-row">
                  <label>Languages:</label>
                  <span>{(profile && profile.languages && profile.languages.join(', ')) || 'English'}</span>
                </div>
                <div className="info-row">
                  <label>Contact:</label>
                  <span>{(profile && profile.phone) || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <label>DOB:</label>
                  <span>{(profile && profile.dob) || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <label>Parents:</label>
                  <span>{(profile && profile.parents) || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <label>Social:</label>
                  <span>{(profile && profile.social && profile.social.join(', ')) || 'Not provided'}</span>
                </div>
                <div className="info-row">
                  <label>Hobbies:</label>
                  <span>{(profile && profile.hobbies && profile.hobbies.join(', ')) || 'Not provided'}</span>
                </div>
              </>
            )}
          </section>

          <div className="profile-actions">
            {editing ? (
              <>
                <button className="btn btn-primary" onClick={handleSave}>Save</button>
                <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Profile</button>
                <button className="btn btn-secondary" onClick={() => window.print()}>Export / Print</button>
              </>
            )}
            <button className="btn" onClick={copyShareLink}>Copy Share Link</button>
            <button className="btn" onClick={createShortLink}>Generate Short Link</button>
            <button className="btn" onClick={() => setToastMsg('QR shown below')}>Show QR</button>
          </div>

          <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'center' }}>
            <img alt="qr" src={getQRUrl(shareUrl)} width="200" height="200" style={{ borderRadius: 6 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn" onClick={() => downloadQR(shareUrl)}>Download QR</button>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <label style={{ fontSize: 0.9 }}>Short link expiry (days)</label>
                <input type="number" value={shortExpiryDays} onChange={(e) => setShortExpiryDays(Number(e.target.value || 0))} style={{ width: 70 }} />
              </div>
            </div>
          </div>

          <section className="profile-section share-section">
            <h2>Shareable link</h2>
            <p className="muted">Use this read-only link when applying for roles (Java, FileNet, DevOps).</p>
            <div className="share-row">
              <input readOnly value={shareUrl} aria-label="share-link" />
              <button type="button" onClick={copyShareLink}>Copy</button>
            </div>
          </section>

          <Toast message={toastMsg} onClose={() => setToastMsg('')} />
        </div>
      </div>
    </div>
  );
};

        // helper functions for profile skills editing
        const AddSkillInput = ({ onAdd }) => {
          const [val, setVal] = useState('');
          return (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <input placeholder="Add skill" value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (val.trim()) { onAdd(val.trim()); setVal(''); } } }} />
              <button className="btn" onClick={() => { if (val.trim()) { onAdd(val.trim()); setVal(''); } }}>Add</button>
            </div>
          );
        };

        const removeSkillProfile = (idx) => {
          try {
            const local = JSON.parse(localStorage.getItem(LOCAL_PROFILE_KEY) || 'null') || {};
            const skills = (local.skills || []).filter((s, i) => i !== idx);
            local.skills = skills;
            localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(local));
            window.dispatchEvent(new Event('profileUpdated'));
          } catch (e) {
            // ignore
          }
        };

        const addSkillProfile = (skill) => {
          try {
            const local = JSON.parse(localStorage.getItem(LOCAL_PROFILE_KEY) || 'null') || {};
            local.skills = [...(local.skills || []), skill];
            localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(local));
            window.dispatchEvent(new Event('profileUpdated'));
          } catch (e) {
            // ignore
          }
        };

export default Profile;
