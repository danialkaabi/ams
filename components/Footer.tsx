import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <img src="/images/logo.png" alt="AMS" />
          </div>
          <div className="foot-links">
            <div className="foot-col">
              <h5>Company</h5>
              <Link href="/about">About</Link>
              <Link href="/services">Services</Link>
              <Link href="/hse">HSE</Link>
              <Link href="/contact">Contact</Link>
            </div>
            <div className="foot-col">
              <h5>Office</h5>
              <a href="tel:+97440392773">+974 4039 2773</a>
              <a href="mailto:info@alannabimarine.com">info@alannabimarine.com</a>
            </div>
            <div className="foot-col">
              <h5>Registration</h5>
              <span style={{ display: 'block', color: 'rgba(255,255,255,0.68)', fontSize: '0.9rem' }}>
                CR No. 163121 · State of Qatar
              </span>
            </div>
          </div>
        </div>
        <div className="foot-row">
          <span>© {new Date().getFullYear()} Al Annabi Marine Services W.L.L. — An SHM &amp; Adani Group Joint Venture.</span>
          <span>Suite 3405, Palm Tower B, West Bay, Doha, Qatar</span>
        </div>
      </div>
    </footer>
  );
}
