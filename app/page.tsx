import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <h1>Industrial Intelligence. Built to Last.</h1>
          <p className="subtitle">In a world of noise and failed AI projects, Qradient shows regulated companies the path of steepest ascent, so they don't just understand AI, but implement it correctly.</p>
          <div className="buttons">
            <a href="mailto:info@qradient.com" className="btn-outline">Start Your Project ↗</a>
            <a href="#services" className="btn-outline">Explore Solutions</a>
          </div>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div id="services" className="middle">
        <h2>Engineering the Path of Steepest Ascent.</h2>
        <p className="desc">8 out of 10 AI projects fail. Not because of the technology.<br />Qradient shows regulated companies the path of steepest ascent, so they don't just understand AI, but implement it correctly.</p>
        <div className="middle-buttons">
          <a href="mailto:info@qradient.com" className="btn-outline-dark">Get Started ↗</a>
        </div>

        <div className="cards">
          {/* Card 1 */}
          <div className="card">
            <div className="card-img card-img-1">
              <div className="card-service-label">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  <line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                </svg>
                <span>AI Assessment</span>
              </div>
            </div>
            <h3>Know exactly where you stand.</h3>
            <p>Most companies start with the wrong question: "Which AI tool should we buy?" The right question is: "Are we ready?"<br /><br />In 48 hours, we assess your organization across five dimensions: data quality, infrastructure, talent, governance and culture. You receive a clear report with a prioritized action plan.</p>
          </div>

          {/* Card 2 */}
          <div className="card">
            <div className="card-img card-img-2">
              <div className="card-service-label">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>Executive Bootcamp</span>
              </div>
            </div>
            <h3>Turn strategy into action. In one day.</h3>
            <p>Your leaders don't need another AI presentation. They need frameworks they can use on Monday morning.<br /><br />In one intensive day, we work through four frameworks: AI Maturity Assessment, Use Case Prioritization, Build/Buy/Partner Decision, and Leadership Plan. Every participant leaves with a personal AI roadmap, not a certificate.</p>
          </div>

          {/* Card 3 */}
          <div className="card">
            <div className="card-img card-img-3">
              <div className="card-service-label">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                <span>Team Bootcamp</span>
              </div>
            </div>
            <h3>From Zero to AI Dream Team.</h3>
            <p>The gap between "we should do AI" and "we are doing AI" is not technology. It's alignment, use case clarity and a team that knows what to do next.<br /><br />In two days, your mixed team from Operations, IT, Compliance and Management develops real use cases, calculates ROI, maps compliance requirements and builds a 6-month roadmap. Together. With their own data.</p>
          </div>
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div id="about" className="about-section">
        <div className="about-inner">
          <div className="about-text">
            <p className="about-intro">We come from the industry.</p>
            <p className="about-body">
              Our founder is an AI Research Scientist who used to work at Roche Diagnostics and Rheinmetall, two of the most demanding AI environments in the world.
            </p>
            <p className="about-body">
              We know what it takes to build AI that works where compliance, safety and reliability are non-negotiable.
            </p>
            <div className="about-expertise">
              <p className="about-expertise-label">Built with expertise from</p>
              <div className="about-expertise-logos">
                <img src="/roche_logo.png" alt="Roche" style={{ height: 90, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
                <img src="/rheinmetall.png" alt="Rheinmetall" style={{ height: 90, width: 'auto', filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
              </div>
            </div>
          </div>

          <div className="about-pillars">
            <div className="pillar">
              <span className="pillar-number">01</span>
              <div>
                <div className="pillar-title">Client</div>
                <div className="pillar-sub">First Priority</div>
              </div>
            </div>
            <div className="pillar">
              <span className="pillar-number">02</span>
              <div>
                <div className="pillar-title">Excellence</div>
                <div className="pillar-sub">Always Deliver</div>
              </div>
            </div>
            <div className="pillar">
              <span className="pillar-number">03</span>
              <div>
                <div className="pillar-title">Innovation</div>
                <div className="pillar-sub">Push Limits</div>
              </div>
            </div>
            <div className="pillar">
              <span className="pillar-number">04</span>
              <div>
                <div className="pillar-title">Trust</div>
                <div className="pillar-sub">Be Transparent</div>
              </div>
            </div>
          </div>

          <blockquote className="about-quote">
            &ldquo;Precision is the purest form of clarity.&rdquo;
          </blockquote>
        </div>
      </div>

      {/* CTA SECTION */}
      <div id="contact" className="cta-section">
        <h2>Get Started</h2>
        <a href="mailto:info@qradient.com" className="btn-outline-dark">Contact ↗</a>
      </div>

      <Footer />
    </>
  );
}
