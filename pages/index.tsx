import Link from 'next/link';
import Layout from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <section className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/images/vessels/ams-laffan-3.jpg')" }} />
        <div className="wrap hero-inner">
          <span className="eyebrow">Al Annabi Marine Services · Qatar</span>
          <h1>Delivering on a vision for Qatar&rsquo;s maritime future</h1>
          <p className="lede">
            AMS delivers tug and support vessel management, port &amp; terminal services, and
            offshore energy support — combining international maritime expertise with local
            Qatari insight, in direct support of Qatar National Vision 2030.
          </p>
          <div className="hero-ctas">
            <Link href="/services" className="btn btn-primary">
              Explore our services
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Contact us today
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          <div className="wrap">
            <div className="stat">
              <div className="num">51%</div>
              <div className="lbl">Qatari ownership</div>
            </div>
            <div className="stat">
              <div className="num">2025</div>
              <div className="lbl">Joint venture established</div>
            </div>
            <div className="stat">
              <div className="num">02</div>
              <div className="lbl">QatarEnergy newbuild charters</div>
            </div>
            <div className="stat">
              <div className="num">Doha</div>
              <div className="lbl">Headquartered, Qatar</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">Our Foundation</span>
            <h2>A strategic joint venture for maritime excellence</h2>
            <p>
              Al Annabi Marine Services W.L.L. (AMS) is a dynamic joint venture between Adani
              Harbour Services Ltd., a global leader in maritime operations, and Sea Horizon
              Offshore Marine Services W.L.L. (SHM), a prominent Qatari marine services provider.
            </p>
          </div>
          <div className="grid-2">
            <div data-reveal="1">
              <p style={{ marginBottom: 20, color: 'var(--ink-soft)' }}>
                This collaboration combines international expertise with unparalleled local
                insight to deliver world-class marine solutions. Established in 2025 and
                headquartered in Qatar, AMS is strategically positioned to support the nation&rsquo;s
                ambitious energy expansion.
              </p>
              <p style={{ color: 'var(--ink-soft)' }}>
                AMS is a dedicated entity established for the comprehensive delivery of essential
                marine services across Qatar — from harbour towage to offshore energy support.
              </p>
              <Link href="/about" className="btn btn-outline" style={{ marginTop: 32 }}>
                More about AMS
              </Link>
            </div>
            <ul className="fact-list" data-reveal="2">
              <li>
                <span className="fnum">01</span>
                <div>
                  <h4>51% Qatari ownership</h4>
                  <p>Joint venture agreement formed on 12 February 2025, marking a key milestone in our establishment.</p>
                </div>
              </li>
              <li>
                <span className="fnum">02</span>
                <div>
                  <h4>Awarded QatarEnergy tenders</h4>
                  <p>GT24106900 (T-214) and GT24110600 (T-221), underscoring our immediate strategic intent.</p>
                </div>
              </li>
              <li>
                <span className="fnum">03</span>
                <div>
                  <h4>Fully incorporated &amp; operational</h4>
                  <p>The company is duly incorporated in Qatar and has already commenced operations.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="partner-strip" data-reveal="3">
            <span className="mono">In Partnership With</span>
            <div className="partner-strip-logos">
              <img src="/images/logos/shm.png" alt="Sea Horizon Offshore Marine Services (SHM)" />
              <img src="/images/logos/adani.png" alt="Adani Group" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">What We Do</span>
            <h2>Comprehensive marine solutions</h2>
            <p>An extensive portfolio of services engineered to meet every maritime need across Qatar with precision and reliability.</p>
          </div>
          <div className="grid-3">
            <div className="card" data-reveal="1">
              <svg className="card-icon" viewBox="0 0 48 48" fill="none">
                <path d="M8 30 L40 30 L36 40 L12 40 Z" stroke="currentColor" strokeWidth="2" />
                <path d="M24 30 V10" stroke="currentColor" strokeWidth="2" />
                <path d="M24 12 L34 20 L24 24 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <h3>Tug &amp; MPSV fleet management</h3>
              <p>A versatile, purpose-built fleet — including specialized tugs and Multi-Purpose Support Vessels — tailored to diverse operational demands.</p>
            </div>
            <div className="card" data-reveal="2">
              <svg className="card-icon" viewBox="0 0 48 48" fill="none">
                <path d="M6 40 H42" stroke="currentColor" strokeWidth="2" />
                <path d="M10 40 V22 H16 V40" stroke="currentColor" strokeWidth="2" />
                <path d="M20 40 V16 H26 V40" stroke="currentColor" strokeWidth="2" />
                <path d="M30 40 V26 H36 V40" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>Port &amp; terminal services</h3>
              <p>Supporting the uninterrupted flow of commerce — terminal towage, crew and pilot boats, mooring, and emergency towing capability.</p>
            </div>
            <div className="card" data-reveal="3">
              <svg className="card-icon" viewBox="0 0 48 48" fill="none">
                <path d="M12 40 L20 16 L28 40" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M6 40 H42" stroke="currentColor" strokeWidth="2" />
                <path d="M30 40 L36 26 L42 40" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              <h3>Offshore energy support</h3>
              <p>Reliable support across every phase of field development — from seismic survey and drilling to production and decommissioning.</p>
            </div>
          </div>
          <div style={{ marginTop: 44 }} data-reveal="4">
            <Link href="/services" className="btn btn-outline">
              View all services
            </Link>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">How We Work</span>
            <h2>Our strategic partnership model</h2>
            <p>AMS thrives on a meticulously structured partnership model, designed to harness the unique strengths of each collaborator and guarantee impeccable service delivery.</p>
          </div>
          <div className="model-track">
            <div className="model-step" data-reveal="1">
              <span className="idx">Step 01</span>
              <h4>SHM — Operational lead</h4>
              <p>Drives successful bidding and tender submissions. Ensures flawless operational execution through the SHIPMAN platform, with experienced crews and comprehensive shore support.</p>
            </div>
            <div className="model-step" data-reveal="2">
              <span className="idx">Step 02</span>
              <h4>Adani — Strategic collaborator</h4>
              <p>Guides strategic collaboration and capital allocation. Formulates competitive pricing strategies, orchestrates shipyard operations, and oversees pivotal strategic decisions.</p>
            </div>
            <div className="model-step" data-reveal="3">
              <span className="idx">Step 03</span>
              <h4>QatarEnergy — Core engagement</h4>
              <p>Secures key charter hire agreements for advanced newbuild vessels — a long-term partnership vital for Qatar&rsquo;s offshore expansion and national energy security.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section maroon">
        <div className="wrap" style={{ textAlign: 'center' }} data-reveal="0">
          <span className="mono">Let&rsquo;s Talk</span>
          <h2 style={{ marginTop: 16, marginBottom: 28, fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            Ready to discuss your next project?
          </h2>
          <Link href="/contact" className="btn btn-ghost" style={{ borderColor: 'rgba(255,255,255,0.6)' }}>
            Get in touch
          </Link>
        </div>
      </section>
    </Layout>
  );
}
