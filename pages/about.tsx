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

      <section className="section white">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <img src="/images/logos/shm.png" alt="Sea Horizon Offshore Marine Services (SHM)" className="partner-logo partner-logo-shm" />
            <span className="mono">Sea Horizon Offshore Marine Services</span>
            <h2>50+ years of Middle East maritime experience</h2>
          </div>
          <div className="grid-2" data-reveal="1">
            <p style={{ color: 'var(--ink-soft)' }}>
              With over 50 years of trusted experience in the Middle East maritime sector, Sea
              Horizon Offshore Marine Services W.L.L. (SHM) was headquartered in Qatar in 2022 and
              has since supported Qatar&rsquo;s maritime sector and the rest of the Arabian Gulf in
              various lines from provision of marine vessels to consultancy services. As a proudly
              Qatari-owned enterprise, SHM&rsquo;s mission has always been to be the reliable partner
              of choice for both state operators (such as QatarEnergy, QatarEnergy LNG, North Oil
              Company) and overseas organizations that are ready to establish a long-term base to
              support and develop the ecosystem in Qatar.
            </p>
            <p style={{ color: 'var(--ink-soft)' }}>
              Upholding this vision, SHM aims to be one of the trusted and go-to maritime services
              providers for the energy market in Qatar and the wider Middle East. As a ship owner,
              charterer, customized solutions and consultancy services provider, SHM is fully
              versed and experienced with the local requirements of operating marine assets with
              the required shore base support — delivering trust and reliability in a safe working
              environment.
            </p>
          </div>
          <div className="grid-2" style={{ marginTop: 48 }}>
            <div data-reveal="2">
              <h3 style={{ fontSize: '1.15rem', marginBottom: 12 }}>An emerging player</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem' }}>
                In less than half a decade, SHM has provided numerous support services to the
                offshore sector in Qatar, from critical offshore vessel logistics management to
                critical consultancy and survey services. Since founding its headquarters in
                Qatar, SHM has grown its presence milestone by milestone in the region and
                continues to play an impactful role in developing the local supply chain and
                economy of Qatar. More recently, SHM has created formidable partnerships in Qatar
                and the Middle East that continue to propel the company into a dynamic maritime
                services provider with a differentiated and unique offering to the energy sector.
              </p>
            </div>
            <div data-reveal="3">
              <h3 style={{ fontSize: '1.15rem', marginBottom: 12 }}>Building partnerships to create success</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem', marginBottom: 14 }}>
                A core, founding pillar of SHM has been to create strong partnerships with
                regional and international players holding an array of expertise in order to
                create avenues that bring joint success to all stakeholders — SHM, its trusted
                partners, and most importantly the operators focused on meeting the long-term
                goals of the State of Qatar.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem' }}>
                Following on this strong ambition, SHM has in a short time built a path with its
                partners that will form an inspiring cornerstone for future generations that aim
                to utilize their creativity with a focused mindset to achieve the impossible — a
                huge growth spurt attained by joining hands with some of the most recognized
                players of the industry to support the energy sector of Qatar and the wider
                Middle East through legacy long-term contracts and exclusive representations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head" data-reveal="0">
            <img src="/images/logos/adani.png" alt="Adani Group" className="partner-logo partner-logo-adani" />
            <span className="mono">Adani Group</span>
            <h2>A global marine services ecosystem</h2>
          </div>
          <div className="grid-2" data-reveal="1">
            <p style={{ color: 'var(--ink-soft)' }}>
              The Adani Group is one of India&rsquo;s largest and most diversified conglomerates,
              with a commanding presence across key infrastructure sectors including ports,
              airports, roads, renewable energy, oil &amp; gas, and mining. Operating across Asia,
              Australia, the Middle East, Africa, and the Americas, the group boasts a market
              capitalization exceeding USD 125 billion, reflecting its global scale and strategic
              vision.
            </p>
            <p style={{ color: 'var(--ink-soft)' }}>
              At the heart of Adani&rsquo;s infrastructure operations is Adani Ports and Special
              Economic Zone (APSEZ), the flagship company of the group. APSEZ owns and operates 14
              ports across India, with a combined capacity of over 535 million metric tons (MMT)
              and having handled more than 400 MMT of cargo in FY-24. The company&rsquo;s expertise
              spans a wide range of cargo types including containers, dry bulk, LPG, LNG, cement,
              POL, automobiles, and project cargoes.
            </p>
          </div>
          <div className="grid-2" style={{ marginTop: 48 }}>
            <div data-reveal="2">
              <h3 style={{ fontSize: '1.15rem', marginBottom: 12 }}>Marine services capability</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem', marginBottom: 14 }}>
                The Adani Group has developed a formidable marine services ecosystem that
                integrates harbour, offshore, and dredging operations under a unified framework.
                This integrated approach enables the group to offer end-to-end maritime solutions
                that are both scalable and tailored to the diverse needs of global clients. With a
                fleet of over 220 owned vessels — including high-capacity tugs, pilot boats,
                mooring crafts, dredgers, jack-up barges, flat-top barges, and offshore support
                vessels such as AHTS, PSVs, and work boats — Adani is equipped to handle complex
                marine operations across ports and offshore environments.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem' }}>
                The group&rsquo;s service portfolio is comprehensive and includes pilotage, harbour
                towage, mooring, offshore support services, diving and ROV operations, pipe laying
                assistance, well simulation support, FPSO and SBM operations, and both capital and
                maintenance dredging. These services are supported by robust infrastructure and a
                highly trained workforce, ensuring safe, efficient, and reliable execution. With an
                additional 20 vessels under construction, Adani continues to invest in fleet
                modernization and global expansion, reinforcing its commitment to delivering
                world-class marine services.
              </p>
            </div>
            <div data-reveal="3">
              <h3 style={{ fontSize: '1.15rem', marginBottom: 12 }}>Global experience and expertise</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem', marginBottom: 14 }}>
                With over two decades of operational excellence, the group has established itself
                as a trusted provider of comprehensive marine services across global markets. Its
                offerings span full-spectrum port operations, offshore support, and dredging
                solutions — delivered with precision, safety, and a customer-centric approach. The
                group has pioneered marine services at LNG terminals, demonstrating consistent
                performance in challenging environments with high tidal ranges, strong currents,
                and adverse weather conditions. In the offshore sector, it has executed complex
                projects including subsea maintenance, pipe laying, diving, and ROV operations,
                supported by a modern fleet deployed across key energy markets. Its dredging
                capabilities cover capital and maintenance works for ports, power plants, and
                inland waterways, along with land reclamation and industrial channel development.
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: '0.96rem' }}>
                Backed by a trained workforce of marine professionals and advanced digital systems
                for real-time operational insights, the Adani Group ensures safe, efficient, and
                sustainable service delivery. All operations adhere to globally recognized QHSE
                standards, reinforcing its commitment to quality, safety, and environmental
                governance.
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
