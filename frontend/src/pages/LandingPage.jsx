import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Linkedin, Twitter, Facebook } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';

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
      const res = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        toast.success('Transmission erfolgreich! Wir melden uns bald.');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      }
    } catch (error) {
      toast.error('Fehler beim Senden.');
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', applyForm.name);
    formData.append('email', applyForm.email);
    formData.append('message', applyForm.message);
    if (applyForm.cv) formData.append('cv', applyForm.cv);

    try {
      const res = await fetch(`${API_URL}/api/applications/upload?job_id=${selectedJob._id}`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        toast.success('Bewerbung erfolgreich gesendet!');
        setShowApplyModal(false);
        setApplyForm({ name: '', email: '', message: '', cv: null });
      }
    } catch (error) {
      toast.error('Fehler beim Senden der Bewerbung.');
    }
  };

  const services = [
    {
      title: 'AI Integration & Automation',
      description: 'Seamlessly integrate AI into your existing workflows and automate repetitive tasks to boost productivity across every department.',
      fullDescription: 'Our AI Integration & Automation service transforms your business operations by embedding intelligent automation into your existing infrastructure. We analyze your current workflows, identify automation opportunities, and implement AI-powered solutions that work seamlessly with your team. From intelligent document processing to automated decision-making systems, we help you achieve unprecedented efficiency gains while reducing operational costs.',
      tag: 'PROCESS_OPTIMIZATION_LOADED',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Data Analytics & Insights',
      description: 'Transform your raw data into actionable insights with our advanced analytics solutions and custom-trained machine learning models.',
      fullDescription: 'Unlock the hidden potential in your data with our comprehensive analytics solutions. We deploy advanced machine learning models and sophisticated data pipelines that transform raw information into strategic business intelligence. Our team builds custom dashboards, predictive models, and real-time analytics systems that give you a competitive edge in understanding market trends, customer behavior, and operational performance.',
      tag: 'DATA_MINING_ACTIVE',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Custom AI Solutions',
      description: 'From enterprise chatbots to predictive forecasting models, we build tailored AI solutions that solve your unique business challenges.',
      fullDescription: 'Every business is unique, and so are its challenges. Our Custom AI Solutions service delivers bespoke artificial intelligence systems designed specifically for your needs. Whether you need an intelligent customer service chatbot, a sophisticated recommendation engine, or a complex predictive maintenance system, we architect and build solutions that align perfectly with your business objectives and technical requirements.',
      tag: 'CUSTOM_BUILD_READY',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop'
    },
    {
      title: 'Executive Bootcamps & Training',
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
          <a href="#careers" className="nav-link-dark" data-testid="nav-careers">Join Us</a>
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
            <a href="#careers" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-white/10 hover:text-[#00FF88] transition-colors">Join Us</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-[#00FF88] transition-colors">Contact</a>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative min-h-screen flex flex-col justify-center px-6 md:px-24 pt-20 overflow-hidden fade-in-up" data-testid="hero-section">
        {/* Blob Effects */}
        <div className="blob w-96 h-96 bg-[#00FF88] opacity-10 absolute top-20 -right-20"></div>
        <div className="blob w-64 h-64 bg-[#2C3E50] opacity-30 absolute bottom-10 left-10"></div>

        <div className="max-w-5xl z-10">
          <span className="mono text-[#00FF88] mb-6 block text-sm">// QUANTUM GRADIENT INTELLIGENCE</span>
          <h1 className="hero-title text-5xl sm:text-6xl md:text-8xl lg:text-9xl mb-8">
            Where <span className="italic font-light">Data</span> meets Intelligence.
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mb-12 font-light leading-relaxed">
            Transforming complex raw data into precise AI decisions. 
            <span className="text-white font-medium italic"> Automating workflows to drive tangible ROI for your enterprise.</span>
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#contact" className="btn-primary text-center" data-testid="hero-cta">Start Your Project</a>
            <a href="#services" className="px-8 py-4 border border-slate-700 hover:border-[#00FF88] rounded-lg transition-all mono text-sm text-center">
              Explore Solutions_
            </a>
          </div>
        </div>
      </main>

      {/* Tools, Partnerships & Technologies Marquee */}
      <section className="py-16 border-t border-b border-slate-800/50 overflow-hidden" data-testid="partners-section">
        <h3 className="text-center mono text-xs font-bold tracking-[0.3em] uppercase text-slate-500 mb-8">
          Tools, Partnerships & Technologies
        </h3>
        <div className="relative">
          {/* Gradient Fade Left */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0f172a] to-transparent z-10 pointer-events-none"></div>
          {/* Gradient Fade Right */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0f172a] to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex animate-marquee-rtl">
            {/* First set */}
            <div className="flex items-center gap-16 md:gap-24 px-8 shrink-0">
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">OpenAI</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">NVIDIA</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Hugging Face</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Google Cloud</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">AWS</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Azure</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Anthropic</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Databricks</span>
            </div>
            {/* Duplicate set for seamless loop */}
            <div className="flex items-center gap-16 md:gap-24 px-8 shrink-0">
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">OpenAI</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">NVIDIA</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Hugging Face</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Google Cloud</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">AWS</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Azure</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Anthropic</span>
              <span className="text-2xl md:text-3xl font-black text-slate-600 hover:text-[#00FF88] transition-colors whitespace-nowrap">Databricks</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 px-6 md:px-24 fade-in-up" data-testid="services-section">
        <div className="section-tag">Capabilities</div>
        <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight">Intelligence as a Service.</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#00FF88]">{service.title}</h3>
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
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-12 tracking-tighter">Mathematical clarity. <br/>Human-centric vision.</h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div>
              <h4 className="mono text-xs font-bold uppercase mb-4 text-slate-400">Our Mission</h4>
              <p className="text-lg md:text-xl font-light leading-relaxed">
                To bridge the gap between raw information and intelligent action, stripping away complexity to reveal the most efficient path forward for every business.
              </p>
            </div>
            <div>
              <h4 className="mono text-xs font-bold uppercase mb-4 text-slate-400">Our Vision</h4>
              <p className="text-lg md:text-xl font-light leading-relaxed">
                A future where data isn't a burden, but a precision tool that empowers human creativity through the seamless integration of machine intelligence.
              </p>
            </div>
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

          <blockquote className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter italic border-l-8 border-[#00FF88] pl-8 py-4">
            "Precision is the purest form of clarity."
          </blockquote>
        </div>
      </section>

      {/* Careers Section */}
      <section id="careers" className="py-32 px-6 md:px-24 fade-in-up" data-testid="careers-section">
        <div className="section-tag">Careers</div>
        <h2 className="text-4xl md:text-5xl font-black mb-16 tracking-tight">Join the Gradient.</h2>
        
        <div className="space-y-6">
          {jobs.length > 0 ? jobs.map((job) => (
            <div 
              key={job._id} 
              className="group p-6 md:p-8 border border-slate-800 rounded-xl job-card-dark flex flex-col md:flex-row justify-between items-start md:items-center cursor-pointer"
              onClick={() => { setSelectedJob(job); setShowJobModal(true); }}
              data-testid={`job-card-${job._id}`}
            >
              <div>
                <h3 className="text-xl md:text-2xl font-bold">{job.title}</h3>
                <p className="text-slate-400 mono text-sm mt-1">{job.location} / {job.type}</p>
              </div>
              <button className="mt-4 md:mt-0 text-[#00FF88] font-bold uppercase tracking-widest text-sm group-hover:underline flex items-center gap-2">
                View Details <ArrowRight size={16} />
              </button>
            </div>
          )) : (
            <>
              <div className="group p-6 md:p-8 border border-slate-800 rounded-xl job-card-dark flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold">AI Solution Architect</h3>
                  <p className="text-slate-400 mono text-sm mt-1">Remote / Full-time</p>
                </div>
                <button className="mt-4 md:mt-0 text-[#00FF88] font-bold uppercase tracking-widest text-sm group-hover:underline flex items-center gap-2">
                  Apply Now <ArrowRight size={16} />
                </button>
              </div>
              <div className="group p-6 md:p-8 border border-slate-800 rounded-xl job-card-dark flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold">Data Strategy Consultant</h3>
                  <p className="text-slate-400 mono text-sm mt-1">London / Hybrid</p>
                </div>
                <button className="mt-4 md:mt-0 text-[#00FF88] font-bold uppercase tracking-widest text-sm group-hover:underline flex items-center gap-2">
                  Apply Now <ArrowRight size={16} />
                </button>
              </div>
            </>
          )}
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
      <footer className="py-10 px-6 md:px-24 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0" data-testid="footer">
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
          <a href="#" className="text-[#00FF88] opacity-50 hover:opacity-100 transition-all transform hover:scale-110" data-testid="social-twitter">
            <Twitter size={20} />
          </a>
          <a href="#" className="text-[#00FF88] opacity-50 hover:opacity-100 transition-all transform hover:scale-110" data-testid="social-facebook">
            <Facebook size={20} />
          </a>
        </div>

        <div className="flex space-x-6 mono text-[10px] uppercase tracking-[0.2em] opacity-40">
          <button onClick={() => setShowPrivacyModal(true)} className="hover:text-[#00FF88] transition-colors" data-testid="footer-privacy">Privacy</button>
          <button onClick={() => setShowImpressumModal(true)} className="hover:text-[#00FF88] transition-colors" data-testid="footer-imprint">Imprint</button>
        </div>
      </footer>

      {/* Job Detail Modal */}
      <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
        <DialogContent className="bg-[#1a2233] border-slate-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#00FF88]">{selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="mono text-sm text-slate-400 mb-4">{selectedJob?.location} / {selectedJob?.type}</p>
            <p className="text-slate-300 leading-relaxed mb-6">{selectedJob?.description}</p>
            <button 
              onClick={() => { setShowJobModal(false); setShowApplyModal(true); }}
              className="btn-primary"
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
            <DialogTitle className="text-xl font-bold">Apply for {selectedJob?.title}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplySubmit} className="mt-4 space-y-4" data-testid="apply-form">
            <div className="contact-input-group">
              <input 
                type="text" 
                className="contact-input" 
                placeholder=" "
                value={applyForm.name}
                onChange={(e) => setApplyForm({...applyForm, name: e.target.value})}
                required
              />
              <label className="contact-label">Name</label>
            </div>
            <div className="contact-input-group">
              <input 
                type="email" 
                className="contact-input" 
                placeholder=" "
                value={applyForm.email}
                onChange={(e) => setApplyForm({...applyForm, email: e.target.value})}
                required
              />
              <label className="contact-label">Email</label>
            </div>
            <div className="contact-input-group">
              <textarea 
                className="contact-input min-h-[80px] resize-none" 
                placeholder=" "
                value={applyForm.message}
                onChange={(e) => setApplyForm({...applyForm, message: e.target.value})}
              />
              <label className="contact-label">Message</label>
            </div>
            <div>
              <label className="mono text-xs text-slate-400 uppercase tracking-widest block mb-2">Upload CV</label>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                onChange={(e) => setApplyForm({...applyForm, cv: e.target.files[0]})}
                className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00FF88] file:text-[#0f172a] file:font-bold file:cursor-pointer"
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-4">
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
