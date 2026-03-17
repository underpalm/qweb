import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Linkedin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showImpressumModal, setShowImpressumModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-up').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      number: '01',
      title: 'AI Integration & Workflow Automation',
      subtitle: 'Removing Friction',
      niche: 'Specialized in High-Compliance (FDA, MDR, ISO 13485)',
      description: 'We eliminate operative inefficiency through intelligent system integration. We don\'t build isolated tools, but seamless AI-driven workflows that reduce friction in regulated environments to zero.',
      tag: 'FRICTION_MINIMIZED',
      image: '/bild1.png'
    },
    {
      number: '02',
      title: 'Data Engineering & Predictive Insights',
      subtitle: 'Signal over Noise',
      niche: 'For Industrial and Clinical Data Pipelines',
      description: 'In a world full of noise, we extract the signal. We transform complex clinical and industrial raw data into precise mathematical models that don\'t just describe what was, but predict what will be.',
      tag: 'SIGNAL_AMPLIFIED',
      image: '/bild2.png'
    },
    {
      number: '03',
      title: 'Custom AI Solutions',
      subtitle: 'Strategic Advantage',
      niche: 'High-Stakes Environments: Pharma, MedTech, Defense',
      description: 'When standard tools fail, we build proprietary intelligence. From autonomous agents to highly specialized language models, we build assets that mathematically secure your competitive advantage.',
      tag: 'ASSET_DEPLOYED',
      image: '/bild3.png'
    },
    {
      number: '04',
      title: 'Executive Strategy & Bootcamps',
      subtitle: 'Cognitive Alignment',
      niche: 'AI Literacy for Decision Makers',
      description: 'We remove the blindfold. In our bootcamps, we transform uncertainty into strategic superiority. We empower leaders to recognize and navigate the gradient of their own organization.',
      tag: 'VISION_ALIGNED',
      image: '/bild4.png'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-6 flex justify-between items-center" data-testid="main-navigation">
        <div className="flex items-center">
          <a href="/" data-testid="logo">
            <img src="/logo.png" alt="Qradient" className="h-14 object-contain" />
          </a>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-12 uppercase text-sm font-bold tracking-widest">
          <a href="#services" className="nav-link-dark" data-testid="nav-services">Services</a>
          <a href="#about" className="nav-link-dark" data-testid="nav-about">About</a>
          <a href="#contact" className="nav-link-dark" data-testid="nav-contact">Contact</a>
        </div>

        <div className="mono text-xs opacity-50 hidden lg:block">
          [ OPTIMIZING_ROI ]
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-4 right-4 z-40 glass-card-dark p-6 md:hidden" data-testid="mobile-menu">
          <div className="flex flex-col space-y-4 uppercase text-sm tracking-widest font-bold">
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/10 hover:text-[#00FF88] transition-colors">Services</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/10 hover:text-[#00FF88] transition-colors">About</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#00FF88] transition-colors">Contact</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col justify-center px-6 md:px-24 pt-20 overflow-hidden fade-in-up" data-testid="hero-section">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/Timeline 1.mov" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0f172a]/80 z-0"></div>

        <div className="max-w-5xl z-10">
          <span className="mono text-[#00FF88] mb-6 block text-sm">QUANTUM GRADIENT INTELLIGENCE</span>
          <h1 className="hero-title text-5xl sm:text-6xl md:text-8xl lg:text-9xl mb-8">
            Industrial <span className="italic font-light">Intelligence</span>. Built to Last.
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-10 font-light leading-relaxed">
            In a world of noise and uncertainty, Qradient reveals the path of steepest ascent.
          </p>

          <div className="mb-12">
            <p className="mono text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 mb-5">Built with experts from</p>
            <div className="flex items-center gap-6">
              <div className="px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <img src="/stanford.png" alt="Stanford" className="h-16 md:h-20 object-contain brightness-0 invert opacity-80" />
              </div>
              <div className="px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <img src="/roche_logo.png" alt="Roche" className="h-16 md:h-20 object-contain brightness-0 invert opacity-80" />
              </div>
              <div className="px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10">
                <img src="/rheinmetall.png" alt="Rheinmetall" className="h-16 md:h-20 object-contain brightness-0 invert opacity-80" />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="mailto:info@qradient.com" className="btn-primary w-fit" data-testid="hero-cta">Start Your Project</a>
            <a href="#services" className="px-8 py-4 border border-slate-700 hover:border-[#00FF88] rounded-lg transition-all mono text-sm w-fit">
              Explore Solutions_
            </a>
          </div>
        </div>
      </main>

      {/* Partners & Tools Marquee */}
      <section className="py-12 border-t border-slate-800/50 bg-[#0f172a] px-6 md:px-24">
        <p className="mono text-[10px] font-bold tracking-[0.4em] uppercase text-slate-600 text-center mb-8">Partners & Tools</p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
          {["OpenAI", "NVIDIA", "Anthropic", "Hugging Face", "Google Cloud", "AWS", "Azure", "Databricks"].map((name, i, arr) => (
            <div key={i} className="flex items-center gap-8">
              <span className="text-lg md:text-xl font-black text-slate-700 hover:text-slate-400 transition-colors duration-300 cursor-default tracking-tight">
                {name}
              </span>
              {i < arr.length - 1 && <span className="text-[#00FF88]/30 text-xs">✦</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-4 fade-in-up" data-testid="services-section">
        <div className="mb-16 px-2 md:px-4">
          <div className="section-tag">The Gradient Framework</div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Engineering the Path of Steepest Ascent.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-[#00FF88]/40 transition-all duration-500"
              style={{ height: '420px' }}
              data-testid={`service-card-${index}`}
              onClick={() => { setSelectedService(service); setShowServiceModal(true); }}
            >
              {/* Full-bleed image */}
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 group-hover:via-black/40 transition-all duration-500" />

              {/* Number badge */}
              <span className="absolute top-5 left-5 mono text-[#00FF88] text-xs font-bold tracking-widest bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                {service.number}
              </span>

              {/* Status badge */}
              <span className="absolute top-5 right-5 mono text-[10px] text-[#00FF88]/70 tracking-widest bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                {service.tag}
              </span>

              {/* Text content at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <p className="mono text-[#00FF88] text-xs tracking-widest uppercase mb-2">{service.subtitle}</p>
                <h3 className="text-xl md:text-2xl font-black mb-1 leading-tight">{service.title}</h3>
                <p className="mono text-xs text-slate-400 mb-3 tracking-wide">— {service.niche}</p>

                {/* Description slides up on hover */}
                <p className="text-slate-300 text-sm leading-relaxed max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500 opacity-0 group-hover:opacity-100">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[#00FF88] text-sm font-bold flex items-center gap-1">
                    Explore <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-24 bg-white text-black relative fade-in-up" data-testid="about-section">
        <div className="max-w-5xl">
          <div className="section-tag bg-slate-100 !text-slate-600">About Us</div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-12 tracking-tighter">We come from the industry.</h2>

          <div className="mb-20">
            <p className="text-lg md:text-xl font-light leading-relaxed">
              Our founder is an AI Research Scientist who used to work<br/>
              at Roche Diagnostics and Rheinmetall, two of the most<br/>
              demanding AI environments in the world.<br/><br/>
              We know what it takes to build AI that works where<br/>
              compliance, safety and reliability are non-negotiable.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="border-l-4 border-[#00FF88] pl-4">
              <span className="text-4xl md:text-5xl font-black text-slate-200">01</span>
              <h4 className="text-lg font-bold mt-2">Client</h4>
              <p className="text-sm text-slate-500 tracking-wider">First Priority</p>
            </div>
            <div className="border-l-4 border-[#00FF88] pl-4">
              <span className="text-4xl md:text-5xl font-black text-slate-200">02</span>
              <h4 className="text-lg font-bold mt-2">Excellence</h4>
              <p className="text-sm text-slate-500 tracking-wider">Always Deliver</p>
            </div>
            <div className="border-l-4 border-[#00FF88] pl-4">
              <span className="text-4xl md:text-5xl font-black text-slate-200">03</span>
              <h4 className="text-lg font-bold mt-2">Innovation</h4>
              <p className="text-sm text-slate-500 tracking-wider">Push Limits</p>
            </div>
            <div className="border-l-4 border-[#00FF88] pl-4">
              <span className="text-4xl md:text-5xl font-black text-slate-200">04</span>
              <h4 className="text-lg font-bold mt-2">Trust</h4>
              <p className="text-sm text-slate-500 tracking-wider">Be Transparent</p>
            </div>
          </div>

          <blockquote className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter">
            "Precision is the purest form of clarity."
          </blockquote>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="pt-24 md:pt-40 pb-12 px-6 md:px-24 bg-[#0f172a] relative overflow-hidden fade-in-up" data-testid="contact-section">
        <div className="blob w-[500px] h-[500px] bg-[#00FF88] opacity-[0.03] absolute -bottom-20 -right-20"></div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="section-tag mx-auto mb-8">Contact Us</div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter leading-none">
            Let's build something<br/><span className="text-[#00FF88] italic">that lasts.</span>
          </h2>

          <p className="text-lg md:text-xl text-slate-400 mb-14 leading-relaxed">
            We work with a select number of clients per year.<br/>
            If your challenge is real, let's talk.
          </p>

          <a
            href="mailto:info@qradient.com"
            className="btn-primary px-14 py-5 text-base inline-flex items-center mb-20"
            data-testid="contact-submit"
          >
            <span className="tracking-widest">Get Started</span>
          </a>

          <div className="border-t border-slate-800 pt-12 flex flex-col sm:flex-row justify-center gap-12">
            <div className="group">
              <p className="mono text-[10px] text-[#00FF88] uppercase tracking-widest mb-2 opacity-50 group-hover:opacity-100 transition-opacity">Direct_Line</p>
              <a href="mailto:info@qradient.com" className="text-lg font-bold hover:text-[#00FF88] transition-colors">info@qradient.com</a>
            </div>
            <div className="hidden sm:block w-px bg-slate-800"></div>
            <div className="group">
              <p className="mono text-[10px] text-[#00FF88] uppercase tracking-widest mb-2 opacity-50 group-hover:opacity-100 transition-opacity">Location_Node</p>
              <p className="text-lg font-bold">Düsseldorf / Global Remote</p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="px-6 md:px-24 py-5 border-t border-slate-800/60 bg-[#0f172a]" data-testid="footer">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <img src="/logo.png" alt="Qradient" className="h-10 object-contain opacity-80" />

          <div className="flex items-center gap-6 mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
            <button onClick={() => setShowPrivacyModal(true)} className="hover:text-[#00FF88] transition-colors" data-testid="footer-privacy">Privacy</button>
            <span>·</span>
            <button onClick={() => setShowImpressumModal(true)} className="hover:text-[#00FF88] transition-colors" data-testid="footer-imprint">Imprint</button>
            <span>·</span>
            <span>&copy; 2026 Qradient</span>
          </div>

          <a href="https://www.linkedin.com/company/qradient" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-[#00FF88] transition-colors" data-testid="social-linkedin">
            <Linkedin size={16} />
          </a>
        </div>
      </footer>

      {/* Privacy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="bg-[#1a2233] border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#00FF88]">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-slate-300 space-y-4 text-sm leading-relaxed">
            <p>Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten auf unserer Website auf.</p>
            <h4 className="font-bold text-white mt-6">Verantwortlicher</h4>
            <p>Qradient GmbH, Berlin, Deutschland</p>
            <h4 className="font-bold text-white mt-6">Erhobene Daten</h4>
            <p>Bei der Nutzung unseres Kontaktformulars erheben wir Ihren Namen, Ihre E-Mail-Adresse sowie Ihre Nachricht.</p>
            <h4 className="font-bold text-white mt-6">Ihre Rechte</h4>
            <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer Daten.</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Detail Modal */}
      <Dialog open={showServiceModal} onOpenChange={setShowServiceModal}>
        <DialogContent className="bg-[#1a2233] border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto p-0 [&>button]:bg-black/60 [&>button]:text-white [&>button]:rounded-full [&>button]:p-1">
          {selectedService && (
            <>
              <div className="h-64 overflow-hidden relative">
                <img
                  src={selectedService.image}
                  alt={selectedService.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8">
                <div className="section-tag mb-4">{selectedService.tag}</div>
                <h2 className="text-2xl md:text-3xl font-black mb-6 text-[#00FF88]">{selectedService.title}</h2>
                <p className="text-slate-300 leading-relaxed text-base mb-8">
                  {selectedService.description}
                </p>
                <a
                  href="mailto:info@qradient.com"
                  onClick={() => setShowServiceModal(false)}
                  className="btn-primary inline-flex items-center gap-3"
                  data-testid="service-modal-cta"
                >
                  <span>Start Your Project</span>
                  <ArrowRight size={18} />
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Impressum Modal */}
      <Dialog open={showImpressumModal} onOpenChange={setShowImpressumModal}>
        <DialogContent className="bg-[#1a2233] border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#00FF88]">Impressum</DialogTitle>
          </DialogHeader>
          <div className="mt-4 text-slate-300 space-y-4 text-sm leading-relaxed">
            <h4 className="font-bold text-white">Angaben gemäß § 5 TMG</h4>
            <p>Qradient GmbH<br/>Musterstraße 123<br/>10115 Berlin</p>
            <h4 className="font-bold text-white mt-6">Kontakt</h4>
            <p>E-Mail: info@qradient.com</p>
            <h4 className="font-bold text-white mt-6">Handelsregister</h4>
            <p>Registergericht: Amtsgericht Berlin-Charlottenburg<br/>Registernummer: HRB XXXXX</p>
            <h4 className="font-bold text-white mt-6">Geschäftsführer</h4>
            <p>Max Mustermann</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
