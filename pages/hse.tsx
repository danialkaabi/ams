import Layout from '@/components/Layout';

const PRINCIPLES = [
  'Comply with all relevant health, safety, and environmental regulations and client requirements',
  'Implement and continuously improve safe work practices',
  'Record and analyze incidents and near-misses to learn and prevent recurrence',
  'Apply risk management to reduce risks to "As Low as Reasonably Practicable" (ALARP)',
  'Monitor performance through clear KPIs to drive accountability and learning',
  'Maintain safe working conditions, equipment, and emergency preparedness',
  'Foster a culture where safety, quality, and care are seamlessly integrated into everything we do',
];

export default function HSE() {
  return (
    <Layout
      title="Health, Safety & Environment"
      description="AMS's commitment to Health, Safety & Environment — an Integrated Management System aligned with ISM 2017 and ISO best practice."
    >
      <section className="page-hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/images/doha-skyline.jpg')" }} />
        <div className="wrap">
          <span className="eyebrow">Safety First</span>
          <h1>Our unwavering commitment to HSE</h1>
          <p>
            At AMS, the safety, health, and well-being of our people is not just a priority — it
            is a core value that defines who we are.
          </p>
        </div>
      </section>

      <section className="section white">
        <div className="wrap">
          <div className="hse-grid grid-2">
            <div data-reveal="0">
              <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
                Since our founding, we have led with care, actively listening to and engaging with
                our teams — especially those on the frontlines — to ensure that everyone returns
                home safely, every day.
              </p>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
                Upholding our commitment to safety means that we continuously learn, adapt, and
                strengthen our ability to manage work safely. We empower our people to speak up,
                take ownership, and contribute to a culture of trust, transparency, and continuous
                improvement — because every voice matters.
              </p>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 20 }}>
                Our HSE mission is to support people in leading healthy, independent lives by
                delivering high-quality, safe, and people-centered services. We are committed to
                building a responsive and integrated health and safety system that ensures the
                best value from our resources while protecting our teams, clients, and
                communities.
              </p>
              <p style={{ color: 'var(--ink-soft)' }}>
                We proactively identify, eliminate, or mitigate risks and hazards across all
                operations — from our offices to our marine assets — ensuring that our assets are
                maintained to perform at the highest standards, thereby ensuring the safety of all
                personnel. Our Integrated Management System is aligned with the International
                Safety Management Code (ISM 2017) and industry best practices including ISO.
              </p>
            </div>
            <ul className="hse-list" data-reveal="1">
              {PRINCIPLES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap" style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto' }} data-reveal="0">
          <h2 style={{ color: 'var(--white)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
            &ldquo;Our people are our greatest asset — and their insights are the foundation of our
            global safety culture.&rdquo;
          </h2>
          <p style={{ marginTop: 24, color: 'rgba(255,255,255,0.72)' }}>
            Together, we lead with care, act with integrity, and strive for excellence in every
            aspect of health, safety, and environmental stewardship.
          </p>
        </div>
      </section>
    </Layout>
  );
}
