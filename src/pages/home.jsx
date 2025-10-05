import Hero from '../components/hero.jsx';
import About from '../components/about';
function Home() {
  return (
    <div className='about-root'>
      <style>
        {
          `
          .about-root { --bg:#0f172a; --card:#0b1227; --muted:#9aa4b2; --text:#e6edf6; --accent:#f472b6; --ring:#94a3b8; --line:#202a44; }
        .about-root { min-height: 100vh; background: radial-gradient(1200px 600px at 10% -10%, #1f2350 0%, transparent 60%), radial-gradient(1000px 500px at 110% 0%, #1e1b4b 0%, transparent 55%), var(--bg); color: var(--text); display: flex; flex-direction: column; align-items: center; }
          
          `
        }
      </style>
      <Hero />
      <About />
    </div>
  );
}

export default Home;
