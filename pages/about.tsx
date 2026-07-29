import Layout from '@/components/Layout';

const LEADERS = [
  { name: 'Jamal Alyafei', role: 'Director', img: '/images/leader-1.jpg' },
  { name: 'Danial Kaabi', role: 'Director', img: '/images/leader-2.jpg' },
  { name: 'Pranav Vora', role: 'Director', img: '/images/leader-3.jpg' },
  { name: 'Vishwas Shah', role: 'Director', img: '/images/leader-4.jpg' },
];

export default function About() {
  return (
    <Layout
      title="About"
      description="AMS is a joint venture between Sea Horizon Offshore Marine Services (SHM) and Adani Harbour Services, established to support Qatar National Vision 2030."
    >
      <section className="page-hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/images/vessels/ams-laffan-1.jpg')" }} />
        <div className="wrap">
          <span className="eyebrow">About AMS</span>
          <h1>Formed for the long-term. Built for Qatar.</h1>
          <p>
            Established in February 2025, Al Annabi Marine Services W.L.L. is a maritime services
            joint venture between Sea Horizon Offshore Marine Services W.L.L. and Adani Harbour
            Services Limited — a majority Qatari-owned company formed to support Qatar&rsquo;s 2030
            Vision.
          </p>
        </div>
      </section>

      <section className="section white">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">Our Story</span>
            <h2>Securing tonnage locally, for the long term</h2>
          </div>
          <div className="grid-2">
            <div data-reveal="1">
              <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
                As a majority Qatar-owned company, AMS was formed to support Qatar&rsquo;s 2030 Vision
                by delivering assets and personnel to meet the maritime requirements of the
                nation&rsquo;s state-owned enterprise, QatarEnergy. Given that the shareholders
                incorporated AMS for the long-term goal of providing reliable and sustainable
                services to QatarEnergy and its affiliates, AMS aims to ensure tonnage is secured
                locally for the foreseeable future — with vessels registered to the Flagstate of
                Qatar where required.
              </p>
              <p style={{ color: 'var(--ink-soft)' }}>
                In doing so, AMS fulfills one of its founding pillars: to support and develop the
                maritime sector of Qatar, for Qatar, ensuring the long-term reliable and
                sustainable development and retention of expertise and experience in the state&rsquo;s
                local workforce and supply chain. It is this vision that emboldened the
                shareholders of AMS to embark on this path as partners.
              </p>
            </div>
            <div className="mv-stack" data-reveal="2" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="fleet-card">
                <span className="tag">Mission</span>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem' }}>
                  To power Qatar&rsquo;s maritime and offshore future by delivering world-class,
                  sustainable marine services — fostering innovation, ensuring safety, and
                  nurturing local talent, all in support of Qatar National Vision 2030.
                </p>
              </div>
              <div className="fleet-card">
                <span className="tag">Vision</span>
                <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem' }}>
                  To emerge as Qatar&rsquo;s undisputed leader in marine and offshore services,
                  redefining excellence in reliability, sustainability, and digital innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid-2" style={{ alignItems: 'start' }}>
            <div data-reveal="0">
              <span className="mono" style={{ color: 'var(--maroon)', display: 'block', marginBottom: 16 }}>
                Sea Horizon Offshore Marine Services
              </span>
              <h2 style={{ fontSize: '1.7rem', marginBottom: 18 }}>50+ years of Middle East maritime experience</h2>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 16 }}>
                With over 50 years of trusted experience in the Middle East maritime sector, Sea
                Horizon Offshore Marine Services W.L.L. (SHM) was headquartered in Qatar in 2022
                and has since supported Qatar&rsquo;s maritime sector and the wider Arabian Gulf —
                from marine vessels to consultancy services.
              </p>
              <p style={{ color: 'var(--ink-soft)' }}>
                As a proudly Qatari-owned enterprise, SHM&rsquo;s mission has always been to be the
                reliable partner of choice for state operators — QatarEnergy, QatarEnergy LNG,
                North Oil Company — and overseas organizations building a long-term base to
                support Qatar&rsquo;s ecosystem.
              </p>
            </div>
            <div data-reveal="1">
              <span className="mono" style={{ color: 'var(--maroon)', display: 'block', marginBottom: 16 }}>
                Adani Group
              </span>
              <h2 style={{ fontSize: '1.7rem', marginBottom: 18 }}>A global marine services ecosystem</h2>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 16 }}>
                The Adani Group is one of India&rsquo;s largest and most diversified conglomerates,
                with a market capitalization exceeding USD 125 billion. Its flagship, Adani Ports
                and Special Economic Zone (APSEZ), owns and operates 14 ports across India with a
                combined capacity of over 535 million metric tons.
              </p>
              <p style={{ color: 'var(--ink-soft)' }}>
                With a fleet of over 220 owned vessels — tugs, pilot boats, dredgers, jack-up
                barges, and offshore support vessels — Adani brings pilotage, harbour towage,
                diving and ROV, and dredging expertise built over two decades of global operation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="leadership" className="section white">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">Leadership</span>
            <h2>Meet our expert leadership</h2>
            <p>
              At AMS, our leadership team is the cornerstone of our success — fusing decades of
              maritime expertise, deep regional insight, and strategic vision.
            </p>
          </div>
          <div className="lead-grid">
            {LEADERS.map((leader, i) => (
              <div className="lead-card" key={leader.name} data-reveal={String((i % 4) + 1)}>
                <img className="headshot" src={leader.img} alt={`${leader.name}, ${leader.role}`} />
                <h4>{leader.name}</h4>
                <div className="role">{leader.role}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 40, color: 'var(--ink-soft)', maxWidth: 760 }} data-reveal="0">
            This board unites seasoned local Qatari leadership with extensive international
            maritime operations experience — ensuring profound cultural alignment and an
            unwavering commitment to technical excellence in every project AMS undertakes.
          </p>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">Looking Ahead</span>
            <h2>Catalyzing Qatar&rsquo;s maritime future</h2>
          </div>
          <div className="grid-2">
            <div data-reveal="1">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--white)' }}>Forging a legacy of growth</h3>
              <p style={{ marginTop: 16, color: 'rgba(255,255,255,0.75)' }}>
                AMS is committed to cultivating a robust, self-sustaining offshore services
                ecosystem that propels Qatar&rsquo;s maritime industry forward and generates enduring
                national value — in direct alignment with Qatar National Vision 2030.
              </p>
            </div>
            <div data-reveal="2">
              <h3 style={{ fontSize: '1.3rem', color: 'var(--white)' }}>Strategic pillars of expansion</h3>
              <ul className="pillars" style={{ marginTop: 16 }}>
                <li style={{ color: 'rgba(255,255,255,0.75)' }}>Elevating port service capabilities across Qatar&rsquo;s key facilities</li>
                <li style={{ color: 'rgba(255,255,255,0.75)' }}>Delivering specialized offshore support for complex energy infrastructure</li>
                <li style={{ color: 'rgba(255,255,255,0.75)' }}>Fostering job creation and advanced skills development for Qatari nationals</li>
                <li style={{ color: 'rgba(255,255,255,0.75)' }}>Developing visionary leadership within the maritime industry sector</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
