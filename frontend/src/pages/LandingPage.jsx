import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { ArrowRight, ArrowDown, Play, Upload } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LandingPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [applicationForm, setApplicationForm] = useState({
    name: "", email: "", phone: "", linkedin: "", portfolio: "", cover_letter: "", experience_years: 0, cv_file: null
  });
  const [cvFileName, setCvFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchJobs();
    seedData();
    setupScrollAnimation();
  }, []);

  const seedData = async () => {
    try {
      await axios.post(`${API}/seed`);
    } catch (e) {
      console.log("Seed error or data exists");
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API}/jobs?active_only=true`);
      setJobs(response.data);
    } catch (e) {
      console.error("Error fetching jobs:", e);
    }
  };

  const setupScrollAnimation = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/contacts`, contactForm);
      toast.success("Message sent! We'll be in touch.");
      setContactForm({ name: "", email: "", message: "" });
    } catch (e) {
      toast.error("Failed to send message");
    }
    setIsSubmitting(false);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!applicationForm.name || !applicationForm.email || !applicationForm.cover_letter) {
      toast.error("Please fill all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API}/applications`, {
        ...applicationForm,
        job_id: selectedJob.id
      });
      toast.success("Application submitted successfully!");
      setShowApplicationModal(false);
      setApplicationForm({ name: "", email: "", phone: "", linkedin: "", portfolio: "", cover_letter: "", experience_years: 0, cv_file: null });
      setCvFileName("");
    } catch (e) {
      toast.error("Failed to submit application");
    }
    setIsSubmitting(false);
  };

  const openJobDetail = (job) => {
    setSelectedJob(job);
    setShowJobModal(true);
  };

  const openApplicationForm = () => {
    setShowJobModal(false);
    setShowApplicationModal(true);
  };

  const getAccentColor = (color) => {
    switch (color) {
      case "yellow": return "bg-[#ffde00] text-black";
      case "blue": return "bg-[#00c6ff] text-white";
      case "orange": return "bg-[#ff5e00] text-white";
      default: return "bg-[#ffde00] text-black";
    }
  };

  const getHoverColor = (color) => {
    switch (color) {
      case "yellow": return "group-hover:text-[#ffde00]";
      case "blue": return "group-hover:text-[#00c6ff]";
      case "orange": return "group-hover:text-[#ff5e00]";
      default: return "group-hover:text-[#ffde00]";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]">
      {/* Navigation */}
      <nav 
        data-testid="main-navigation"
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 glass-card px-8 py-6 flex justify-between items-center"
      >
        <a href="/" className="text-2xl font-black tracking-tighter hover:text-[#ffde00] transition-colors" data-testid="logo">QRADIENT.</a>
        <div className="hidden md:flex space-x-8 uppercase text-xs tracking-widest font-bold">
          <a href="#home" className="nav-link" data-testid="nav-home">Home</a>
          <a href="#services" className="nav-link" data-testid="nav-services">Services</a>
          <a href="#about" className="nav-link" data-testid="nav-about">About</a>
          <a href="#jobs" className="nav-link" data-testid="nav-jobs">Join Us</a>
          <a href="#contact" className="nav-link" data-testid="nav-contact">Contact</a>
        </div>
        <div>
          <a href="#contact" className="pharrell-btn text-xs" data-testid="nav-lets-talk">Let's Talk</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="home" className="hero-full-screen" data-testid="hero-section">
        <img 
          src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop" 
          alt="Immersive AI Background" 
          className="hero-video-bg"
        />
        <div className="hero-content">
          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 leading-none" data-testid="hero-title">
            DATA MEETS <br /> <span className="gradient-text">INTELLIGENCE.</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto mb-12 font-light text-gray-200" data-testid="hero-subtitle">
            Architecting the future of intelligence. Defined by empathy, design, and radical innovation.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="#about" className="pharrell-btn-white text-xs" data-testid="explore-mission-btn">Explore Mission</a>
            <button 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-4 rounded-full transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
              data-testid="watch-reel-btn"
            >
              <Play size={16} fill="currentColor" /> Watch Reel
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 scroll-indicator text-white">
          <ArrowDown size={30} />
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="bg-[#f0f0f0] fade-in-up" data-testid="services-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4">What We Do</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter">SERVICES</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Service 01 */}
            <div className="glass-card p-10 group hover:shadow-2xl transition-shadow">
              <span className="text-6xl font-black text-gray-200 group-hover:text-[#ffde00] transition-colors">01</span>
              <h4 className="text-xl md:text-2xl font-bold mt-4 mb-3">AI Strategy & Consulting</h4>
              <p className="text-gray-600 leading-relaxed">
                We help you identify AI opportunities and develop a roadmap for implementation that aligns with your business goals.
              </p>
            </div>

            {/* Service 02 */}
            <div className="glass-card p-10 group hover:shadow-2xl transition-shadow">
              <span className="text-6xl font-black text-gray-200 group-hover:text-[#00c6ff] transition-colors">02</span>
              <h4 className="text-xl md:text-2xl font-bold mt-4 mb-3">Data Analytics & Insights</h4>
              <p className="text-gray-600 leading-relaxed">
                Transform your raw data into actionable insights with our advanced analytics solutions and machine learning models.
              </p>
            </div>

            {/* Service 03 */}
            <div className="glass-card p-10 group hover:shadow-2xl transition-shadow">
              <span className="text-6xl font-black text-gray-200 group-hover:text-[#ff5e00] transition-colors">03</span>
              <h4 className="text-xl md:text-2xl font-bold mt-4 mb-3">Custom AI Solutions</h4>
              <p className="text-gray-600 leading-relaxed">
                From chatbots to predictive models, we build tailored AI solutions that solve your unique business challenges.
              </p>
            </div>

            {/* Service 04 */}
            <div className="glass-card p-10 group hover:shadow-2xl transition-shadow">
              <span className="text-6xl font-black text-gray-200 group-hover:text-[#ffde00] transition-colors">04</span>
              <h4 className="text-xl md:text-2xl font-bold mt-4 mb-3">AI Integration & Automation</h4>
              <p className="text-gray-600 leading-relaxed">
                Seamlessly integrate AI into your existing workflows and automate repetitive tasks to boost productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white fade-in-up" data-testid="about-section">
        <div className="container mx-auto max-w-6xl grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
              className="rounded-[40px] shadow-xl w-full"
              alt="Innovation Workspace"
              data-testid="about-image"
            />
          </div>
          <div>
            <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-4">About Qradient</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-8" data-testid="about-title">Mission & Vision</h3>
            <div className="space-y-6 text-base lg:text-lg leading-relaxed text-gray-600">
              <p>
                <strong>Our Mission:</strong> We democratize artificial intelligence by making it feelable, usable, and above all, human. Qradient is not just a consultancy – we are the architects of a new era.
              </p>
              <p>
                <strong>Our Vision:</strong> A world where technology expands the human spirit instead of replacing it. We seek the "gradient" between cold logic and warm creativity.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="p-4 border-l-4 border-[#ffde00]">
                <span className="block font-black text-2xl">100%</span>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-widest">Innovation focus</span>
              </div>
              <div className="p-4 border-l-4 border-[#00c6ff]">
                <span className="block font-black text-2xl">Global</span>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-widest">Network</span>
              </div>
              <div className="p-4 border-l-4 border-[#ff5e00]">
                <span className="block font-black text-2xl">Trust</span>
                <span className="text-xs uppercase font-bold text-gray-400 tracking-widest">Be Transparent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="bg-[#f0f0f0] fade-in-up" data-testid="jobs-section">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4" data-testid="jobs-title">JOIN THE TRIBE.</h2>
            <p className="text-gray-500">We are looking for visionaries, not employees.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <div 
                key={job.id}
                onClick={() => openJobDetail(job)}
                className="glass-card p-10 hover:shadow-2xl transition-shadow cursor-pointer group job-card"
                data-testid={`job-card-${job.id}`}
              >
                <span className={`inline-block ${getAccentColor(job.accent_color)} text-[10px] font-bold px-3 py-1 rounded-full mb-4`}>
                  {job.location_type} / {job.location}
                </span>
                <h4 className="text-xl md:text-2xl font-bold mb-2">{job.title}</h4>
                <p className="text-gray-600 mb-6 line-clamp-2">{job.description}</p>
                <div className={`flex items-center text-xs font-black tracking-widest uppercase transition-colors ${getHoverColor(job.accent_color)}`}>
                  View Details <ArrowRight className="ml-2" size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="fade-in-up" data-testid="contact-section">
        <div className="container mx-auto max-w-4xl glass-card p-8 md:p-12 shadow-2xl bg-white border-2 border-black">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-6" data-testid="contact-title">SAY HELLO.</h2>
              <p className="text-gray-600 mb-8 font-light">
                Ready for the next step? Leave us a message or drop by for a coffee at our studio.
              </p>
              <div className="space-y-4">
                <p className="font-bold">hello@qradient.ai</p>
                <p className="font-bold">+44 20 7946 0000</p>
                <p className="text-sm text-gray-400">Somewhere in the Future / London</p>
              </div>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4" data-testid="contact-form">
              <div>
                <input 
                  type="text" 
                  placeholder="NAME"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  className="form-input"
                  data-testid="contact-name-input"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="EMAIL"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="form-input"
                  data-testid="contact-email-input"
                />
              </div>
              <div>
                <textarea 
                  placeholder="YOUR VISION" 
                  rows="4"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  className="form-input resize-none"
                  data-testid="contact-message-input"
                />
              </div>
              <button 
                type="submit" 
                className="w-full pharrell-btn mt-6"
                disabled={isSubmitting}
                data-testid="contact-submit-btn"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-gray-100" data-testid="footer">
        <div className="text-4xl font-black tracking-tighter mb-8">QRADIENT.</div>
        <div className="flex justify-center space-x-6 mb-8 uppercase text-[10px] tracking-[0.2em] font-bold text-gray-400">
          <a href="#" className="hover:text-black transition-colors">Instagram</a>
          <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-black transition-colors">Twitter</a>
        </div>
        <p className="text-xs text-gray-300">2024 QRADIENT CONSULTING. DESIGNED BY HUMANITY.</p>
        <a href="/admin" className="text-xs text-gray-300 hover:text-gray-500 mt-4 inline-block" data-testid="admin-link">Admin</a>
      </footer>

      {/* Job Detail Modal */}
      <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black shadow-2xl" data-testid="job-detail-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">{selectedJob?.title}</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              <div className="flex gap-2">
                <span className={`${getAccentColor(selectedJob.accent_color)} text-[10px] font-bold px-3 py-1 rounded-full`}>
                  {selectedJob.location_type}
                </span>
                <span className="bg-gray-100 text-[10px] font-bold px-3 py-1 rounded-full">
                  {selectedJob.location}
                </span>
              </div>
              
              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-2">Description</h4>
                <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-2">Requirements</h4>
                <ul className="space-y-2">
                  {selectedJob.requirements?.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-[#ffde00] mt-1">*</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-2">Benefits</h4>
                <ul className="space-y-2">
                  {selectedJob.benefits?.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-[#00c6ff] mt-1">+</span>
                      {ben}
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={openApplicationForm}
                className="w-full pharrell-btn"
                data-testid="apply-now-btn"
              >
                Apply Now
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Modal */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black shadow-2xl" data-testid="application-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">
              Apply for {selectedJob?.title}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplicationSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text"
                placeholder="Full Name *"
                value={applicationForm.name}
                onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                className="form-input col-span-2"
                data-testid="application-name-input"
              />
              <input 
                type="email"
                placeholder="Email *"
                value={applicationForm.email}
                onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                className="form-input"
                data-testid="application-email-input"
              />
              <input 
                type="tel"
                placeholder="Phone"
                value={applicationForm.phone}
                onChange={(e) => setApplicationForm({...applicationForm, phone: e.target.value})}
                className="form-input"
                data-testid="application-phone-input"
              />
              <input 
                type="url"
                placeholder="LinkedIn URL"
                value={applicationForm.linkedin}
                onChange={(e) => setApplicationForm({...applicationForm, linkedin: e.target.value})}
                className="form-input"
                data-testid="application-linkedin-input"
              />
              <input 
                type="url"
                placeholder="Portfolio URL"
                value={applicationForm.portfolio}
                onChange={(e) => setApplicationForm({...applicationForm, portfolio: e.target.value})}
                className="form-input"
                data-testid="application-portfolio-input"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 block">
                Years of Experience
              </label>
              <input 
                type="number"
                min="0"
                value={applicationForm.experience_years}
                onChange={(e) => setApplicationForm({...applicationForm, experience_years: parseInt(e.target.value) || 0})}
                className="form-input"
                data-testid="application-experience-input"
              />
            </div>
            <div>
              <textarea 
                placeholder="Cover Letter / Why do you want to join Qradient? *"
                rows="5"
                value={applicationForm.cover_letter}
                onChange={(e) => setApplicationForm({...applicationForm, cover_letter: e.target.value})}
                className="form-input resize-none"
                data-testid="application-cover-letter-input"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 block">
                Upload CV / Resume *
              </label>
              <label 
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#ffde00] hover:bg-gray-50 transition-colors"
                data-testid="cv-upload-label"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  {cvFileName ? (
                    <p className="text-sm font-semibold text-[#1a1a1a]">{cvFileName}</p>
                  ) : (
                    <>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Click to upload</p>
                      <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX (max 5MB)</p>
                    </>
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("File size must be less than 5MB");
                        return;
                      }
                      setApplicationForm({...applicationForm, cv_file: file});
                      setCvFileName(file.name);
                    }
                  }}
                  data-testid="cv-upload-input"
                />
              </label>
            </div>
            <button 
              type="submit"
              className="w-full pharrell-btn"
              disabled={isSubmitting}
              data-testid="submit-application-btn"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
