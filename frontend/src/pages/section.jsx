import React from "react";
import { useNavigate } from "react-router-dom";
import {Heart,Shield,NotebookPen,Activity,Users,Brain,Lock,MessagesSquare} from "lucide-react";
export default function AboutPage() {
  const navigate = useNavigate();
  return (
    <main className="about-root">
      <style>{`
        .about-root { --bg:#0f172a; --card:#0b1227; --muted:#9aa4b2; --text:#e6edf6; --accent:#f472b6; --ring:#94a3b8; --line:#202a44; }
        .about-root { min-height: 100vh; background: radial-gradient(1200px 600px at 10% -10%, #2a2c45ff 0%, transparent 60%), radial-gradient(1000px 500px at 110% 0%, #1e1b4b 0%, transparent 55%), var(--bg); color: var(--text); display: flex; flex-direction: column; align-items: center; }
        .container { width: min(1100px, 92vw); margin: 0 auto; }
        .chip { display:inline-flex; align-items:center; gap:.5rem; font-size:.8rem; letter-spacing:.02em; background:rgba(244,114,182,.14); color:#ffd8eb; padding:.38rem .7rem; border:1px solid rgba(244,114,182,.35); border-radius:999px; }
        .hero { padding: 72px 0 28px; text-align:center; }
        .hero h1 { font-size: clamp(1.9rem, 4vw, 3rem); line-height: 1.1; margin: 14px 0 10px; font-weight: 800; }
        .hero p { color: var(--muted); font-size: clamp(.95rem, 1.5vw, 1.1rem); max-width: 720px; margin: 0 auto; }
        .cta { display:flex; gap:12px; justify-content:center; margin-top:20px; flex-wrap:wrap; }
        .btn { padding: .8rem 1.1rem; border-radius: 14px; border:1px solid var(--line); background:#121a34; color:var(--text); font-weight:600; letter-spacing:.02em; cursor:pointer; }
        .btn.primary { background: linear-gradient(180deg, #ff7db8, #f472b6 55%, #ec4899); border: none; color:#1a1020; }
        .btn:focus-visible { outline:2px solid var(--ring); outline-offset:2px; }

        .grid { display:grid; grid-template-columns: 1fr; gap:16px; margin: 26px 0; }
        @media (min-width: 860px){ .grid { grid-template-columns: 1fr 1fr; gap:18px; } }
        .card { background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02)); border:1px solid var(--line); border-radius: 16px; padding: 18px 18px 16px; box-shadow: 0 10px 30px rgba(0,0,0,.25); backdrop-filter: blur(8px); }
        .card h3 { display:flex; align-items:center; gap:.6rem; font-size:1.05rem; margin: 0 0 6px; }
        .card p { margin:0; color:var(--muted); line-height:1.6; }

        .section { padding: 18px 0 8px; }
        .section h2 { font-size: clamp(1.2rem, 2.4vw, 1.6rem); margin: 6px 0 4px; }
        .section p.lead { color: var(--muted); margin: 0 0 4px; }

        .feature-grid { display:grid; grid-template-columns: 1fr; gap:12px; margin-top:12px; }
        @media (min-width: 720px){ .feature-grid { grid-template-columns: repeat(3, 1fr); } }
        .feature { background:#0e1630; border:1px solid var(--line); border-radius: 14px; padding:14px; display:flex; gap:12px; align-items:flex-start; }
        .feature .icon { width: 34px; height: 34px; border-radius: 11px; display:grid; place-items:center; background: rgba(148,163,184,.12); border: 1px solid rgba(148,163,184,.25); flex: 0 0 34px; }
        .feature h4 { margin:2px 0 4px; font-size:1rem; }
        .feature p { margin:0; color: var(--muted); font-size:.95rem; }

        .values { background: #0b1227; border:1px solid var(--line); border-radius: 18px; padding: 16px; margin: 20px 0; }
        .values ul { list-style:none; padding:0; margin:10px 0 0; display:grid; grid-template-columns: 1fr; gap:10px; }
        @media (min-width: 720px){ .values ul { grid-template-columns: repeat(3,1fr); } }
        .values li { display:flex; gap:10px; align-items:flex-start; color:var(--text); }
        .values .dot { width:8px; height:8px; border-radius:999px; background:var(--accent); margin-top:.55rem; }

        .ctaCard { border:1px solid var(--line); background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02)); border-radius: 18px; padding: 16px; display:flex; gap:14px; align-items:center; justify-content:space-between; flex-wrap:wrap; }
        .mini { display:flex; gap:8px; flex-wrap:wrap; }
        .badge { padding:.42rem .7rem; border-radius:999px; border:1px solid var(--line); color:#b6c0cf; background:#0e1630; font-size:.8rem; }

        footer { color:#9aa4b2; font-size:.82rem; margin: 16px 0 40px; text-align:center; }
      `}</style>

      {/* HERO */}
      <header className="container hero">
       
        <h1>Caring for your mind, every day</h1>
        <p>
          We’re building a safe, stigma‑free space with tools that make self‑care simple: private journaling,
          mood tracking, gentle insights, and a supportive community.
        </p>
        <div className="cta">
          <button className="btn primary">Get Started</button>
          <button className="btn">Contact Us</button>
        </div>
      </header>

      {/* MISSION & PROMISE */}
      <section className="container section">
        <div className="grid">
          <div className="card">
            <h3>
              <Heart /> Our Mission
            </h3>
            <p>npm 
              To make mental well‑being approachable for everyone by offering practical, science‑informed tools that
              help you reflect, heal, and grow—at your pace.
            </p>
          </div>
          <div className="card">
            <h3>
              <Shield /> Our Promise
            </h3>
            <p>
              We protect your privacy, avoid judgment, and never replace professional care. Think of us as your everyday
              companion for small, meaningful steps.
            </p>
          </div>
        </div>
      </section>

      
      <section className="container section">
        <h2>What We Offer</h2>
        <p className="lead">Thoughtfully crafted features to help you understand patterns, manage stress, and celebrate progress.</p>
        <div className="feature-grid">
          <Feature icon={<NotebookPen/>} title="Private Journaling" desc="A safe space to express thoughts and feelings with optional guided prompts and streaks." />
          <Feature icon={<Activity/>} title="Mood Tracking" desc="Understand patterns with daily check‑ins and trend insights over time." />
          <Feature icon={<Brain/>} title="Gentle Insights" desc="Science‑informed tips for stress, sleep, anxiety, and focus—bite‑sized and practical." />
          <Feature icon={<Users/>} title="Community Support" desc="Find encouragement and share wins in a moderated, stigma‑free space." />
          <Feature icon={<Lock/>} title="Secure by Design" desc="Your notes are yours. We use privacy‑first practices and strong protection." />
          <Feature icon={<MessagesSquare/>} title="Kind Prompts" desc="Soft, human language that nudges reflection without pressure." />
        </div>
      </section>

      
      <section className="container">
        <div className="values">
          <h2>Our Values</h2>
          <ul>
            <ValueItem text="Compassion over perfection" />
            <ValueItem text="Privacy by design" />
            <ValueItem text="Science‑informed habits" />
            <ValueItem text="Community without judgment" />
            <ValueItem text="Progress you can track" />
            <ValueItem text="Gentle, human language" />
          </ul>
        </div>
      </section>

      
      <section className="container">
        <div className="ctaCard">
          <div>
            <h3 style={{margin:"0 0 6px", fontSize:"1.1rem"}}>You’re not alone on this journey</h3>
            <p style={{margin:0, color:"#235dafff"}}>Build healthier habits with mindful check‑ins, private notes, and supportive prompts.</p>
            <div className="mini" style={{marginTop:10}}>
              <span className="badge">No judgment</span>
              <span className="badge">Private & secure</span>
              <span className="badge">Free basic plan</span>
            </div>
          </div>
          <div className="cta">
            <button className="btn primary" onClick={() => navigate("/signup")}>Create Account</button>
            <button className="btn">Learn More</button>
          </div>
        </div>
      </section>

  
      <footer className="container">
        Disclaimer: This platform is for education and self‑care support. It is not a substitute for professional diagnosis or therapy. If you’re in crisis, please contact local emergency services or a crisis helpline.
      </footer>
    </main>
  );
}

function Feature({ icon, title, desc }){
  return (
    <div className="feature">
      <div className="icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function ValueItem({ text }) {
  return (
    <li>
      <span className="dot" />
      <span>{text}</span>
    </li>
  );
}




