import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { ArrowRight, ArrowDown, Play, Upload, Menu, X } from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LandingPage() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showImpressumModal, setShowImpressumModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [applicationForm, setApplicationForm] = useState({
    name: "", email: "", phone: "", linkedin: "", portfolio: "", cover_letter: "", experience_years: 0, cv_file: null
  });
  const [cvFileName, setCvFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    if (!applicationForm.cv_file) {
      toast.error("Please upload your CV");
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("job_id", selectedJob.id);
      formData.append("name", applicationForm.name);
      formData.append("email", applicationForm.email);
      formData.append("phone", applicationForm.phone || "");
      formData.append("linkedin", applicationForm.linkedin || "");
      formData.append("portfolio", applicationForm.portfolio || "");
      formData.append("cover_letter", applicationForm.cover_letter);
      formData.append("experience_years", applicationForm.experience_years);
      if (applicationForm.cv_file) {
        formData.append("cv_file", applicationForm.cv_file);
      }
      
      await axios.post(`${API}/applications/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
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
        className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 glass-card px-4 md:px-8 py-4 md:py-6 flex justify-between items-center"
      >
        <a href="/" className="text-xl md:text-2xl font-black tracking-tighter hover:text-[#ffde00] transition-colors" data-testid="logo">QRADIENT.</a>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex space-x-8 uppercase text-xs tracking-widest font-bold">
          <a href="#home" className="nav-link" data-testid="nav-home">Home</a>
          <a href="#services" className="nav-link" data-testid="nav-services">Services</a>
          <a href="#about" className="nav-link" data-testid="nav-about">About</a>
          <a href="#jobs" className="nav-link" data-testid="nav-jobs">Join Us</a>
          <a href="#contact" className="nav-link" data-testid="nav-contact">Contact</a>
        </div>
        
        <div className="hidden md:block">
          <a href="#contact" className="pharrell-btn text-xs" data-testid="nav-lets-talk">Let's Talk</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2 hover:bg-black/10 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-btn"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-24 left-4 right-4 z-40 glass-card p-6 lg:hidden" data-testid="mobile-menu">
          <div className="flex flex-col space-y-4 uppercase text-sm tracking-widest font-bold">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-200 hover:text-[#ffde00] transition-colors">Home</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-200 hover:text-[#ffde00] transition-colors">Services</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-200 hover:text-[#ffde00] transition-colors">About</a>
            <a href="#jobs" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-200 hover:text-[#ffde00] transition-colors">Join Us</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="py-2 border-b border-gray-200 hover:text-[#ffde00] transition-colors">Contact</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="pharrell-btn text-xs text-center mt-4">Let's Talk</a>
          </div>
        </div>
      )}

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

          {/* Tools & Technologies Marquee */}
          <div className="mt-20">
            <h3 className="text-center text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-8">
              Tools, Partnerschaften & Technologien
            </h3>
            <div className="relative overflow-hidden">
              <div className="flex animate-marquee whitespace-nowrap">
                {/* First set of logos */}
                <div className="flex items-center gap-16 mx-8">
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.6 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>
                    <span className="font-bold text-sm">OpenAI</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-8 w-auto" viewBox="0 0 60 36" fill="currentColor"><path d="M17.507 22.477l-2.817-8.567h-1.554l-2.817 8.567h1.376l.67-2.15h3.097l.67 2.15h1.375zm-3.61-6.88l1.209 3.886h-2.417l1.208-3.886zM25.89 13.91l-2.56 7.102-2.559-7.101h-1.478l3.2 8.567h1.67l3.2-8.567h-1.473zM32.41 22.625c1.67 0 2.877-.67 3.548-1.614l-.967-.819c-.596.745-1.459 1.167-2.492 1.167-1.628 0-2.893-1.167-2.893-3.051s1.265-3.051 2.893-3.051c1.033 0 1.896.422 2.492 1.167l.967-.819c-.671-.944-1.878-1.614-3.548-1.614-2.37 0-4.24 1.748-4.24 4.317 0 2.568 1.87 4.317 4.24 4.317z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0v36h60V0H0zm3.6 3.6h52.8v28.8H3.6V3.6z"/></svg>
                    <span className="font-bold text-sm">AWS</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-6 w-auto" viewBox="0 0 351 81" fill="currentColor"><path d="M0 19.836h15.264v41.064h25.536v13.068H0V19.836zm47.064 0h15.264v54.132H47.064V19.836zm23.148 27.072c0-16.164 12.06-28.08 28.836-28.08 16.776 0 28.836 11.916 28.836 28.08 0 16.164-12.06 28.08-28.836 28.08-16.776 0-28.836-11.916-28.836-28.08zm42.408 0c0-9.108-5.736-15.516-13.572-15.516-7.836 0-13.572 6.408-13.572 15.516 0 9.108 5.736 15.516 13.572 15.516 7.836 0 13.572-6.408 13.572-15.516zM130.944 0h15.264v73.968h-15.264V0zm23.148 19.836h15.264v7.836h.324c2.916-5.412 9-9.144 17.16-9.144 14.22 0 24.84 11.916 24.84 28.08 0 16.164-10.62 28.08-24.84 28.08-8.16 0-14.244-3.732-17.16-9.144h-.324v28.476h-15.264V19.836zm42.324 26.772c0-9.108-5.736-15.516-13.572-15.516-7.836 0-13.572 6.408-13.572 15.516 0 9.108 5.736 15.516 13.572 15.516 7.836 0 13.572-6.408 13.572-15.516zM220.428 19.836h15.264v54.132h-15.264V19.836zm7.632-5.004c-4.86 0-8.82-3.96-8.82-8.82s3.96-8.82 8.82-8.82 8.82 3.96 8.82 8.82-3.96 8.82-8.82 8.82zm18.072 5.004h15.264v7.512h.324c2.592-4.86 8.496-8.82 17.16-8.82 13.896 0 20.952 9.432 20.952 23.004v32.436h-15.264V44.796c0-7.836-3.408-12.372-10.62-12.372-7.212 0-12.552 5.184-12.552 13.02v28.524h-15.264V19.836zm63.936 27.072c0-16.164 12.06-28.08 28.836-28.08 16.776 0 28.836 11.916 28.836 28.08 0 16.164-12.06 28.08-28.836 28.08-16.776 0-28.836-11.916-28.836-28.08zm42.408 0c0-9.108-5.736-15.516-13.572-15.516-7.836 0-13.572 6.408-13.572 15.516 0 9.108 5.736 15.516 13.572 15.516 7.836 0 13.572-6.408 13.572-15.516z"/></svg>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                    <span className="font-bold text-sm">Google Cloud</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.049 2.7L6.736 21.3H0l13.049-18.6z"/></svg>
                    <span className="font-bold text-sm">Azure</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>
                    <span className="font-bold text-sm">Tailwind</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/></svg>
                    <span className="font-bold text-sm">Ethereum</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/></svg>
                    <span className="font-bold text-sm">React</span>
                  </div>
                </div>
                {/* Duplicate set for seamless loop */}
                <div className="flex items-center gap-16 mx-8">
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.6 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>
                    <span className="font-bold text-sm">OpenAI</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-8 w-auto" viewBox="0 0 60 36" fill="currentColor"><path d="M17.507 22.477l-2.817-8.567h-1.554l-2.817 8.567h1.376l.67-2.15h3.097l.67 2.15h1.375zm-3.61-6.88l1.209 3.886h-2.417l1.208-3.886zM25.89 13.91l-2.56 7.102-2.559-7.101h-1.478l3.2 8.567h1.67l3.2-8.567h-1.473zM32.41 22.625c1.67 0 2.877-.67 3.548-1.614l-.967-.819c-.596.745-1.459 1.167-2.492 1.167-1.628 0-2.893-1.167-2.893-3.051s1.265-3.051 2.893-3.051c1.033 0 1.896.422 2.492 1.167l.967-.819c-.671-.944-1.878-1.614-3.548-1.614-2.37 0-4.24 1.748-4.24 4.317 0 2.568 1.87 4.317 4.24 4.317z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M0 0v36h60V0H0zm3.6 3.6h52.8v28.8H3.6V3.6z"/></svg>
                    <span className="font-bold text-sm">AWS</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-6 w-auto" viewBox="0 0 351 81" fill="currentColor"><path d="M0 19.836h15.264v41.064h25.536v13.068H0V19.836zm47.064 0h15.264v54.132H47.064V19.836zm23.148 27.072c0-16.164 12.06-28.08 28.836-28.08 16.776 0 28.836 11.916 28.836 28.08 0 16.164-12.06 28.08-28.836 28.08-16.776 0-28.836-11.916-28.836-28.08zm42.408 0c0-9.108-5.736-15.516-13.572-15.516-7.836 0-13.572 6.408-13.572 15.516 0 9.108 5.736 15.516 13.572 15.516 7.836 0 13.572-6.408 13.572-15.516zM130.944 0h15.264v73.968h-15.264V0zm23.148 19.836h15.264v7.836h.324c2.916-5.412 9-9.144 17.16-9.144 14.22 0 24.84 11.916 24.84 28.08 0 16.164-10.62 28.08-24.84 28.08-8.16 0-14.244-3.732-17.16-9.144h-.324v28.476h-15.264V19.836zm42.324 26.772c0-9.108-5.736-15.516-13.572-15.516-7.836 0-13.572 6.408-13.572 15.516 0 9.108 5.736 15.516 13.572 15.516 7.836 0 13.572-6.408 13.572-15.516zM220.428 19.836h15.264v54.132h-15.264V19.836zm7.632-5.004c-4.86 0-8.82-3.96-8.82-8.82s3.96-8.82 8.82-8.82 8.82 3.96 8.82 8.82-3.96 8.82-8.82 8.82zm18.072 5.004h15.264v7.512h.324c2.592-4.86 8.496-8.82 17.16-8.82 13.896 0 20.952 9.432 20.952 23.004v32.436h-15.264V44.796c0-7.836-3.408-12.372-10.62-12.372-7.212 0-12.552 5.184-12.552 13.02v28.524h-15.264V19.836zm63.936 27.072c0-16.164 12.06-28.08 28.836-28.08 16.776 0 28.836 11.916 28.836 28.08 0 16.164-12.06 28.08-28.836 28.08-16.776 0-28.836-11.916-28.836-28.08zm42.408 0c0-9.108-5.736-15.516-13.572-15.516-7.836 0-13.572 6.408-13.572 15.516 0 9.108 5.736 15.516 13.572 15.516 7.836 0 13.572-6.408 13.572-15.516z"/></svg>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>
                    <span className="font-bold text-sm">Google Cloud</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.049 2.7L6.736 21.3H0l13.049-18.6z"/></svg>
                    <span className="font-bold text-sm">Azure</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>
                    <span className="font-bold text-sm">Tailwind</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/></svg>
                    <span className="font-bold text-sm">Ethereum</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
                    <svg className="h-7 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/></svg>
                    <span className="font-bold text-sm">React</span>
                  </div>
                </div>
              </div>
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
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              <div className="p-4 border-l-4 border-[#ffde00]">
                <span className="text-3xl font-black text-gray-200">01</span>
                <p className="text-base font-black mt-1">CLIENT</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">First Priority</p>
              </div>
              <div className="p-4 border-l-4 border-[#00c6ff]">
                <span className="text-3xl font-black text-gray-200">02</span>
                <p className="text-base font-black mt-1">EXCELLENCE</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Always Deliver</p>
              </div>
              <div className="p-4 border-l-4 border-[#ff5e00]">
                <span className="text-3xl font-black text-gray-200">03</span>
                <p className="text-base font-black mt-1">INNOVATION</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Push Limits</p>
              </div>
              <div className="p-4 border-l-4 border-[#1a1a1a]">
                <span className="text-3xl font-black text-gray-200">04</span>
                <p className="text-base font-black mt-1">TRUST</p>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mt-1">Be Transparent</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Work Images Section */}
      <section className="py-16 bg-white fade-in-up" data-testid="images-section">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-[40px] group">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Team Collaboration"
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div>
                  <p className="text-white text-xs uppercase tracking-widest font-bold mb-2">Our Team</p>
                  <p className="text-white/80 text-sm">Collaborative innovation at its finest</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[40px] group">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop" 
                alt="Modern Workspace"
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div>
                  <p className="text-white text-xs uppercase tracking-widest font-bold mb-2">Our Space</p>
                  <p className="text-white/80 text-sm">Where ideas come to life</p>
                </div>
              </div>
            </div>
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

      {/* Footer */}
      <footer className="py-10 text-center border-t border-gray-100" data-testid="footer">
        <div className="text-2xl font-black tracking-tighter mb-4">QRADIENT.</div>
        <div className="flex justify-center space-x-6 mb-4 uppercase text-[10px] tracking-[0.2em] font-bold text-gray-400">
          <a href="#" className="hover:text-black transition-colors">Instagram</a>
          <a href="#" className="hover:text-black transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-black transition-colors">Twitter</a>
        </div>
        <div className="flex justify-center space-x-6 mb-4 text-xs text-gray-400">
          <button onClick={() => setShowPrivacyModal(true)} className="hover:text-black transition-colors">Privacy Policy</button>
          <span>|</span>
          <button onClick={() => setShowImpressumModal(true)} className="hover:text-black transition-colors">Impressum</button>
        </div>
        <p className="text-xs text-gray-300">© 2026 QRADIENT. ALL RIGHTS RESERVED.</p>
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

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacyModal} onOpenChange={setShowPrivacyModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black shadow-2xl" data-testid="privacy-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Privacy Policy</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-600 leading-relaxed mt-4">
            <section>
              <h3 className="font-bold text-lg text-black mb-2">1. Introduction</h3>
              <p>At Qradient, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">2. Information We Collect</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Fill out contact forms</li>
                <li>Apply for job positions</li>
                <li>Subscribe to our newsletter</li>
                <li>Request information about our services</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">3. How We Use Your Information</h3>
              <p>We use the information we collect to:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Respond to your inquiries and requests</li>
                <li>Process job applications</li>
                <li>Improve our website and services</li>
                <li>Send you relevant updates (with your consent)</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">4. Data Security</h3>
              <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">5. Your Rights</h3>
              <p>You have the right to access, correct, or delete your personal data. Contact us at privacy@qradient.ai for any requests regarding your data.</p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">6. Contact Us</h3>
              <p>If you have questions about this Privacy Policy, please contact us at:</p>
              <p className="mt-2 font-semibold">privacy@qradient.ai</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Impressum Modal */}
      <Dialog open={showImpressumModal} onOpenChange={setShowImpressumModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-black shadow-2xl" data-testid="impressum-modal">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tight">Impressum</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-600 leading-relaxed mt-4">
            <section>
              <h3 className="font-bold text-lg text-black mb-2">Angaben gemäß § 5 TMG</h3>
              <p className="font-semibold">Qradient Consulting GmbH</p>
              <p>Musterstraße 123</p>
              <p>10115 Berlin</p>
              <p>Deutschland</p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">Kontakt</h3>
              <p>Telefon: +49 30 123456789</p>
              <p>E-Mail: hello@qradient.ai</p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">Vertreten durch</h3>
              <p>Geschäftsführer: Max Mustermann</p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">Registereintrag</h3>
              <p>Eintragung im Handelsregister</p>
              <p>Registergericht: Amtsgericht Berlin-Charlottenburg</p>
              <p>Registernummer: HRB 123456</p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">Umsatzsteuer-ID</h3>
              <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:</p>
              <p>DE 123456789</p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
              <p>Max Mustermann</p>
              <p>Musterstraße 123</p>
              <p>10115 Berlin</p>
            </section>
            
            <section>
              <h3 className="font-bold text-lg text-black mb-2">Haftungsausschluss</h3>
              <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
