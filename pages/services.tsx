import Layout from '@/components/Layout';

const FEATURES = [
  {
    chapter: 'Chapter One',
    img: '/images/vessels/ams-laffan-4.jpg',
    title: 'Standing watch at Halul Island',
    desc: 'Qatar’s offshore crude export terminal never stops. Under a long-term charter with QatarEnergy, AMS supplies the tanker berthing assistance tug and utility maintenance vessel that keep tankers berthing safely and Halul Island’s marine infrastructure running around the clock.',
  },
  {
    chapter: 'Chapter Two',
    img: '/images/vessels/ams-al-wakra-1.jpg',
    title: 'Guarding the gateway at Ras Laffan',
    desc: 'A dedicated fleet of four ASD tugs, a pilot boat, and a crew boat now serve Ras Laffan Port under a long-term charter with QatarEnergy — the marine backbone behind one of the region’s busiest industrial and energy gateways.',
  },
];

const GALLERY = [
  { name: 'AMS Laffan 1', img: '/images/vessels/ams-laffan-1.jpg' },
  { name: 'AMS Laffan 2', img: '/images/vessels/ams-laffan-2.jpg' },
  { name: 'AMS Najam', img: '/images/vessels/ams-najam.jpg' },
];

const FLEET = [
  {
    tag: 'Tugs',
    title: 'ASD, AHTS & AHT tugs',
    desc: 'Varying specification to support port and offshore functions.',
  },
  {
    tag: 'PSVs',
    title: 'Platform Supply Vessels',
    desc: "Supporting overall logistics and drilling activities with DP capability.",
  },
  {
    tag: 'MPSVs',
    title: 'Multi-Purpose Support Vessels',
    desc: 'Equipped with bigger cranes and larger accommodation to support construction, hook-up and related activities.',
  },
  {
    tag: 'FSIVs',
    title: 'Fast Supply & Intervention Vessels',
    desc: 'Dedicated to efficient crew, personnel and small cargo transfer requirements.',
  },
];

const OFFSHORE = [
  'Seismic and geotechnical support',
  'Drilling',
  'Subsea',
  'Transport and installation',
  'Construction',
  'Hook up and commissioning',
  'Production',
  'Well stimulation',
  'Well and platform maintenance',
  'Plug and abandonment',
];

const PORT = [
  'Towage operations',
  'Vessel movements (including rig moves)',
  'Escorting',
  'Piloting',
  'Pilot, personnel and equipment transfer',
  'Firefighting, oil spill and emergency response',
  'Salvage and emergency towing operations',
  'Mooring / unmooring',
];

const LNG = [
  'Towing operations',
  'Tanker berthing / unberthing',
  'SBM operations, line & buoy handling',
  'Tanker ops at SBMs',
  'Inspection and maintenance activities',
  'Firefighting and oil spill contingency',
  'Piloting and personnel transfer',
];

export default function Services() {
  return (
    <Layout
      title="Services"
      description="AMS fleet and services — tugs, PSVs, MPSVs and FSIVs supporting offshore energy, port operations, and LNG loading/unloading across Qatar."
    >
      <section className="page-hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/images/vessels/ams-khattaf.jpg')" }} />
        <div className="wrap">
          <span className="eyebrow">What We Do</span>
          <h1>A fleet built for Qatar&rsquo;s energy expansion</h1>
          <p>
            AMS is committed to delivering both new build and second-hand Qatar-flagged tonnage,
            managed with dedicated shore-based support providing seamless, safe supervision — 24
            hours, 365 days a year.
          </p>
        </div>
      </section>

      <section className="section white">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">Looking Ahead</span>
            <h2>Projects that shape Qatar&rsquo;s maritime future</h2>
            <p>
              Two long-term partnerships with QatarEnergy mark the first chapters of a much longer
              voyage — proof of the trust placed in AMS to deliver where it matters most.
            </p>
          </div>
          <div className="feature-grid">
            {FEATURES.map((f, i) => (
              <div className="feature-tile" key={f.title} data-reveal={String((i % 4) + 1)}>
                <div className="hero-bg" style={{ backgroundImage: `url('${f.img}')` }} />
                <div className="feature-tile-body">
                  <span className="mono">{f.chapter}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">Ship Owning &amp; Management</span>
            <h2>A versatile, purpose-built fleet</h2>
            <p>
              State-of-the-art, safe, customized and versatile vessel classes dedicated to the
              State&rsquo;s energy expansion plans and infrastructure — including but not limited to:
            </p>
          </div>
          <div className="fleet-grid">
            {FLEET.map((item, i) => (
              <div className="fleet-card" key={item.tag} data-reveal={String((i % 4) + 1)}>
                <span className="tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">Service Segments</span>
            <h2>Multi-faceted support across the field lifecycle</h2>
          </div>

          <div className="segment" data-reveal="1">
            <div>
              <span className="mono">01 — Offshore</span>
              <h3>Offshore marine services</h3>
              <p style={{ color: 'var(--ink-soft)' }}>
                By equipping itself with a young, customized and dedicated fleet, AMS aims to
                support the complete offshore energy segment of Qatar at multi-faceted levels of
                field development.
              </p>
            </div>
            <ul>
              {OFFSHORE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="segment" data-reveal="2">
            <div>
              <span className="mono">02 — Port</span>
              <h3>Port services</h3>
              <p style={{ color: 'var(--ink-soft)' }}>
                Relentlessly supporting Qatar&rsquo;s port activities, especially the strategic
                expansion and development of the main port in Ras Laffan Industrial City, is a key
                long-term strategy of AMS. With its shareholders&rsquo; support, AMS is confident it
                will deliver on this promise by harnessing the depth of experience, skills and
                knowledge of its management, as well as by deploying its global access to
                resources — equipment and personnel — in an integrated approach to ensure robust,
                customized solutions designed to cater to Qatar&rsquo;s port development plans. AMS
                aims to play a key role in all critical port activities for QatarEnergy, such as:
              </p>
            </div>
            <ul>
              {PORT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="segment" data-reveal="3">
            <div>
              <span className="mono">03 — LNG</span>
              <h3>LNG loading &amp; unloading</h3>
              <p style={{ color: 'var(--ink-soft)', marginBottom: 14 }}>
                AMS will deploy years of global experience and knowledge to support QatarEnergy
                with its vital LNG operations. AMS will supply assist tugs and utility vessels to
                ensure QatarEnergy&rsquo;s LNG support operations are carried out in a safe and
                reliable environment, including a focus on Halul Island operations. The tugs and
                utility vessels AMS will deliver for these highly specialized operations will have
                an optimized design to operate in the required conditions and support with a
                range of services such as:
              </p>
            </div>
            <ul>
              {LNG.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p style={{ color: 'var(--ink-soft)', maxWidth: 760, marginTop: 8 }} data-reveal="3">
            In addition to the specially designed new build vessels, the highly experienced crew
            and support base will ensure operations are conducted with careful planning to ensure
            zero downtime.
          </p>
        </div>
      </section>

      <section className="section white">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <span className="mono">Our Fleet</span>
            <h2>Vessels on the water in Doha</h2>
          </div>
          <div className="gallery-grid">
            {GALLERY.map((v, i) => (
              <div className="gallery-card" key={v.name} data-reveal={String((i % 4) + 1)}>
                <img src={v.img} alt={v.name} />
                <span className="cap">{v.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section maroon">
        <div className="wrap" style={{ textAlign: 'center' }} data-reveal="0">
          <span className="mono">Get In Touch</span>
          <h2 style={{ marginTop: 16, marginBottom: 28, fontSize: 'clamp(1.8rem, 3.6vw, 2.6rem)' }}>
            Discuss a chartering or service requirement
          </h2>
          <a href="/contact" className="btn btn-ghost" style={{ borderColor: 'rgba(255,255,255,0.6)' }}>
            Contact our team
          </a>
        </div>
      </section>
    </Layout>
  );
}
