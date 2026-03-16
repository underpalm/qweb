import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Linkedin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_5l06wxr';
const EMAILJS_TEMPLATE_ID = 'template_ek975q4';
const EMAILJS_PUBLIC_KEY = 'cFzVAIA-ASWXD8nIC';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showImpressumModal, setShowImpressumModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [applyForm, setApplyForm] = useState({ name: '', email: '', message: '', cv: null });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
    
    // Fade in animation observer
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

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/jobs?active_only=true`);
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: contactForm.name,
          time: new Date().toLocaleString('de-DE'),
          message: `Email: ${contactForm.email}\nBetreff: ${contactForm.subject}\n\n${contactForm.message}`,
          reply_to: contactForm.email,
        },
        EMAILJS_PUBLIC_KEY
      );
      toast.success('Message sent successfully! We will get back to you soon.');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Error sending message. Please try again.');
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    
    const formData = new FormData();
    formData.append('job_id', selectedJob.id);
    formData.append('name', applyForm.name);
    formData.append('email', applyForm.email);
    formData.append('message', applyForm.message);
    if (applyForm.cv) formData.append('cv', applyForm.cv);

    try {
      const res = await fetch(`${API_URL}/api/applications/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        toast.success('Application submitted successfully! We will get back to you soon.');
        setShowApplyModal(false);
        setApplyForm({ name: '', email: '', message: '', cv: null });
      } else {
        const data = await res.json();
        toast.error(data.detail || 'Error submitting application.');
      }
    } catch (error) {
      toast.error('Error submitting application.');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    setNewsletterLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (res.ok) {
        toast.success('Successfully subscribed to our newsletter!');
        setNewsletterEmail('');
      } else {
        const data = await res.json();
        toast.error(data.detail || 'Error subscribing to newsletter.');
      }
    } catch (error) {
      toast.error('Error subscribing to newsletter.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const services = [
    {
      title: 'AI Integration & Automation',
      niche: 'Specialized in regulated environments (FDA, MDR, ISO 13485)',
      description: 'Seamlessly integrate AI into your existing workflows and automate repetitive tasks to boost productivity across every department.',
      fullDescription: 'Our AI Integration & Automation service transforms your business operations by embedding intelligent automation into your existing infrastructure. We analyze your current workflows, identify automation opportunities, and implement AI-powered solutions that work seamlessly with your team. From intelligent document processing to automated decision-making systems, we help you achieve unprecedented efficiency gains while reducing operational costs.',
      tag: 'PROCESS_OPTIMIZATION_LOADED',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Data Analytics & Insights',
      niche: 'For industrial and clinical data pipelines',
      description: 'Transform your raw data into actionable insights with our advanced analytics solutions and custom-trained machine learning models.',
      fullDescription: 'Unlock the hidden potential in your data with our comprehensive analytics solutions. We deploy advanced machine learning models and sophisticated data pipelines that transform raw information into strategic business intelligence. Our team builds custom dashboards, predictive models, and real-time analytics systems that give you a competitive edge in understanding market trends, customer behavior, and operational performance.',
      tag: 'DATA_MINING_ACTIVE',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Custom AI Solutions',
      niche: 'Built for Pharma, MedTech and Defense',
      description: 'From enterprise chatbots to predictive forecasting models, we build tailored AI solutions that solve your unique business challenges.',
      fullDescription: 'Every business is unique, and so are its challenges. Our Custom AI Solutions service delivers bespoke artificial intelligence systems designed specifically for your needs. Whether you need an intelligent customer service chatbot, a sophisticated recommendation engine, or a complex predictive maintenance system, we architect and build solutions that align perfectly with your business objectives and technical requirements.',
      tag: 'CUSTOM_BUILD_READY',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Executive Bootcamps & Training',
      niche: 'AI literacy for regulated industries',
      description: 'Empower your workforce with the skills to leverage AI. We provide high-level strategic training for leaders and technical workshops for teams.',
      fullDescription: 'Bridge the AI knowledge gap in your organization with our comprehensive training programs. Our Executive Bootcamps provide C-suite leaders with strategic AI insights, while our technical workshops equip your teams with hands-on skills in machine learning, data science, and AI implementation. We customize every training program to your industry and organizational needs, ensuring maximum relevance and impact.',
      tag: 'KNOWLEDGE_TRANSFER_SYNC',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 px-6 py-6 flex justify-between items-center" data-testid="main-navigation">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#00FF88] rounded-full"></div>
          <a href="/" className="text-2xl font-black tracking-tighter uppercase" data-testid="logo">Qradient</a>
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
          <source src="/space.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0f172a]/80 z-0"></div>

        <div className="max-w-5xl z-10">
          <span className="mono text-[#00FF88] mb-6 block text-sm">// QUANTUM GRADIENT INTELLIGENCE</span>
          <h1 className="hero-title text-5xl sm:text-6xl md:text-8xl lg:text-9xl mb-8">
            Where <span className="italic font-light">Data</span> meets Intelligence.
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-10 font-light leading-relaxed">
            Qradient builds AI systems that pass regulatory audits, integrate into legacy infrastructure, and actually work in Industrial environments.
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

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#contact" className="btn-primary text-center" data-testid="hero-cta">Start Your Project</a>
            <a href="#services" className="px-8 py-4 border border-slate-700 hover:border-[#00FF88] rounded-lg transition-all mono text-sm text-center">
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
        <div className="px-2 md:px-4">
          <div className="section-tag">Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight">Intelligence as a Service.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-[#1a2233] border-neon rounded-2xl overflow-hidden group cursor-pointer" 
              data-testid={`service-card-${index}`}
              onClick={() => { setSelectedService(service); setShowServiceModal(true); }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-3 text-[#00FF88]">{service.title}</h3>
                <p className="mono text-xs text-[#00FF88]/60 mb-4 tracking-wide">— {service.niche}</p>
                <p className="text-slate-400 leading-relaxed">{service.description}</p>
                <div className="mt-6 flex justify-between items-center">
                  <span className="mono text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">{service.tag}</span>
                  <span className="text-[#00FF88] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    Learn More <ArrowRight size={14} />
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
              Our founder has worked as AI Research Scientist<br/>
              at Roche Diagnostics and Rheinmetall — two of<br/>
              the most demanding AI environments in the world.<br/><br/>
              We know what it takes to build AI that works<br/>
              where compliance, safety and reliability<br/>
              are non-negotiable.<br/><br/>
              That's why we started Qradient.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="border-l-4 border-[#00FF88] pl-4">
              <span className="text-4xl md:text-5xl font-black text-slate-200">01</span>
              <h4 className="text-lg font-bold mt-2">CLIENT</h4>
              <p className="text-sm text-slate-500 uppercase tracking-wider">First Priority</p>
            </div>
            <div className="border-l-4 border-[#00FF88] pl-4">
              <span className="text-4xl md:text-5xl font-black text-slate-200">02</span>
              <h4 className="text-lg font-bold mt-2">EXCELLENCE</h4>
              <p className="text-sm text-slate-500 uppercase tracking-wider">Always Deliver</p>
            </div>
            <div className="border-l-4 border-[#00FF88] pl-4">
              <span className="text-4xl md:text-5xl font-black text-slate-200">03</span>
              <h4 className="text-lg font-bold mt-2">INNOVATION</h4>
              <p className="text-sm text-slate-500 uppercase tracking-wider">Push Limits</p>
            </div>
            <div className="border-l-4 border-[#00FF88] pl-4">
              <span className="text-4xl md:text-5xl font-black text-slate-200">04</span>
              <h4 className="text-lg font-bold mt-2">TRUST</h4>
              <p className="text-sm text-slate-500 uppercase tracking-wider">Be Transparent</p>
            </div>
          </div>

          <blockquote className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter">
            "Precision is the purest form of clarity."
          </blockquote>
        </div>
      </section>


      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-40 px-6 md:px-24 bg-[#0f172a] relative overflow-hidden fade-in-up" data-testid="contact-section">
        <div className="blob w-[500px] h-[500px] bg-[#00FF88] opacity-[0.03] absolute -bottom-20 -left-20"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-5">
              <div className="section-tag">Contact Us</div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-10 tracking-tighter leading-none">
                Costs meet <br/>their <span className="text-[#00FF88] italic">match.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-md leading-relaxed">
                Ready to calculate the gradient of your success? Reach out for a high-level technical assessment.
              </p>
              
              <div className="space-y-8">
                <div className="group cursor-pointer">
                  <p className="mono text-[10px] text-[#00FF88] uppercase tracking-widest mb-1 opacity-50 group-hover:opacity-100">Direct_Line</p>
                  <a href="mailto:hello@qradient.ai" className="text-xl md:text-2xl font-bold hover:text-[#00FF88] transition-colors">hello@qradient.ai</a>
                </div>
                <div className="group cursor-pointer">
                  <p className="mono text-[10px] text-[#00FF88] uppercase tracking-widest mb-1 opacity-50 group-hover:opacity-100">Location_Node</p>
                  <p className="text-xl md:text-2xl font-bold">Berlin / Global Remote</p>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-[#1a2233]/50 p-6 md:p-12 lg:p-16 rounded-[2rem] border border-slate-800 backdrop-blur-sm">
              <form onSubmit={handleContactSubmit} className="space-y-6" data-testid="contact-form">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="contact-input-group">
                    <input 
                      type="text" 
                      className="contact-input" 
                      placeholder=" "
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                      data-testid="contact-name"
                    />
                    <label className="contact-label">Identification / Name</label>
                  </div>
                  <div className="contact-input-group">
                    <input 
                      type="email" 
                      className="contact-input" 
                      placeholder=" "
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                      data-testid="contact-email"
                    />
                    <label className="contact-label">Electronic Mail</label>
                  </div>
                </div>

                <div className="contact-input-group">
                  <input 
                    type="text" 
                    className="contact-input" 
                    placeholder=" "
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    data-testid="contact-subject"
                  />
                  <label className="contact-label">Operational Subject</label>
                </div>

                <div className="contact-input-group">
                  <textarea 
                    className="contact-input min-h-[120px] resize-none" 
                    placeholder=" "
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                    data-testid="contact-message"
                  />
                  <label className="contact-label">Project Parameters / Message</label>
                </div>

                <div className="pt-4">
                  <button type="submit" className="btn-primary w-full md:w-auto px-12 group flex items-center justify-center space-x-4" data-testid="contact-submit">
                    <span className="tracking-widest text-sm">Execute Transmission</span>
                    <span className="mono text-xs opacity-50 group-hover:translate-x-1 transition-transform">-&gt;</span>
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-6 px-6 md:px-24 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0" data-testid="footer">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 bg-[#00FF88] rounded-full"></div>
          <span className="text-md font-black tracking-tighter uppercase">Qradient</span>
          <span className="mono text-[10px] opacity-30 ml-2 tracking-widest hidden sm:inline">&copy; 2026 LABS</span>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-8">
          <a href="https://www.linkedin.com/company/qradient" target="_blank" rel="noopener noreferrer" className="text-[#00FF88] opacity-50 hover:opacity-100 transition-all transform hover:scale-110" data-testid="social-linkedin">
            <Linkedin size={20} />
          </a>
        </div>

        <div className="flex space-x-6 mono text-[10px] uppercase tracking-[0.2em] opacity-40">
          <button onClick={() => setShowPrivacyModal(true)} className="hover:text-[#00FF88] transition-colors" data-testid="footer-privacy">Privacy</button>
          <button onClick={() => setShowImpressumModal(true)} className="hover:text-[#00FF88] transition-colors" data-testid="footer-imprint">Imprint</button>
        </div>
      </footer>

      {/* Job Detail Modal */}
      <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
        <DialogContent className="bg-[#1a2233] border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#00FF88]">{selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-3 py-1 bg-slate-800 rounded-full mono text-xs text-slate-300">{selectedJob?.location}</span>
              <span className="px-3 py-1 bg-[#00FF88]/20 text-[#00FF88] rounded-full mono text-xs">{selectedJob?.location_type}</span>
            </div>
            
            <p className="text-slate-300 leading-relaxed mb-8 text-lg">{selectedJob?.description}</p>
            
            {selectedJob?.requirements && selectedJob.requirements.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00FF88] rounded-full"></span>
                  Requirements
                </h4>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req, idx) => (
                    <li key={idx} className="text-slate-400 flex items-start gap-3">
                      <span className="text-[#00FF88] mt-1">→</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {selectedJob?.benefits && selectedJob.benefits.length > 0 && (
              <div className="mb-8">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00FF88] rounded-full"></span>
                  Benefits
                </h4>
                <ul className="space-y-2">
                  {selectedJob.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-slate-400 flex items-start gap-3">
                      <span className="text-[#00FF88] mt-1">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <button 
              onClick={() => { setShowJobModal(false); setShowApplyModal(true); }}
              className="btn-primary w-full md:w-auto"
              data-testid="apply-btn"
            >
              Apply Now
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Apply Modal */}
      <Dialog open={showApplyModal} onOpenChange={setShowApplyModal}>
        <DialogContent className="bg-[#1a2233] border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#00FF88]">Apply for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplySubmit} className="mt-6 space-y-5" data-testid="apply-form">
            <div>
              <label className="mono text-xs text-slate-400 uppercase tracking-widest block mb-2">Full Name *</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF88] transition-colors"
                placeholder="Your name"
                value={applyForm.name}
                onChange={(e) => setApplyForm({...applyForm, name: e.target.value})}
                required
                data-testid="apply-name"
              />
            </div>
            <div>
              <label className="mono text-xs text-slate-400 uppercase tracking-widest block mb-2">Email Address *</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF88] transition-colors"
                placeholder="your@email.com"
                value={applyForm.email}
                onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                required
                data-testid="apply-email"
              />
            </div>
            <div>
              <label className="mono text-xs text-slate-400 uppercase tracking-widest block mb-2">Cover Letter / Message</label>
              <textarea 
                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF88] transition-colors min-h-[100px] resize-none"
                placeholder="Tell us why you're interested in this position..."
                value={applyForm.message}
                onChange={(e) => setApplyForm({...applyForm, message: e.target.value})}
                data-testid="apply-message"
              />
            </div>
            <div>
              <label className="mono text-xs text-slate-400 uppercase tracking-widest block mb-2">Upload CV</label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => setApplyForm({...applyForm, cv: e.target.files[0]})}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00FF88] file:text-[#0f172a] file:font-bold file:cursor-pointer"
                data-testid="apply-cv"
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary w-full mt-4 py-4 text-base font-bold"
              data-testid="apply-submit"
            >
              Submit Application
            </button>
          </form>
        </DialogContent>
      </Dialog>

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
        <DialogContent className="bg-[#1a2233] border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          {selectedService && (
            <>
              <div className="h-64 overflow-hidden">
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
                  {selectedService.fullDescription}
                </p>
                <a 
                  href="#contact" 
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
            <p>E-Mail: hello@qradient.ai</p>
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
