import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../components/ui/dropdown-menu";
import { 
  Mail, 
  Briefcase, 
  Users, 
  MoreVertical, 
  Trash2, 
  Eye, 
  Check, 
  X as XIcon,
  ArrowLeft,
  Plus,
  Power,
  Edit,
  FileText
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({ contacts: {}, jobs: {}, applications: {} });
  const [contacts, setContacts] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState("");
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    location_type: "REMOTE",
    description: "",
    requirements: [""],
    benefits: [""],
    accent_color: "yellow"
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [statsRes, contactsRes, jobsRes, appsRes] = await Promise.all([
        axios.get(`${API}/stats`),
        axios.get(`${API}/contacts`),
        axios.get(`${API}/jobs`),
        axios.get(`${API}/applications`)
      ]);
      setStats(statsRes.data);
      setContacts(contactsRes.data);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (e) {
      toast.error("Failed to fetch data");
    }
  };

  const updateContactStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/contacts/${id}/status?status=${status}`);
      toast.success("Status updated");
      fetchAll();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API}/contacts/${id}`);
      toast.success("Contact deleted");
      fetchAll();
    } catch (e) {
      toast.error("Failed to delete contact");
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/applications/${id}/status?status=${status}`);
      toast.success("Status updated");
      fetchAll();
    } catch (e) {
      toast.error("Failed to update status");
    }
  };

  const deleteApplication = async (id) => {
    try {
      await axios.delete(`${API}/applications/${id}`);
      toast.success("Application deleted");
      fetchAll();
    } catch (e) {
      toast.error("Failed to delete application");
    }
  };

  const toggleJobStatus = async (id) => {
    try {
      await axios.patch(`${API}/jobs/${id}/toggle`);
      toast.success("Job status toggled");
      fetchAll();
    } catch (e) {
      toast.error("Failed to toggle job status");
    }
  };

  const deleteJob = async (id) => {
    try {
      await axios.delete(`${API}/jobs/${id}`);
      toast.success("Job deleted");
      fetchAll();
    } catch (e) {
      toast.error("Failed to delete job");
    }
  };

  const openDetail = (item, type) => {
    setSelectedItem(item);
    setDetailType(type);
    setShowDetailModal(true);
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...jobForm,
        requirements: jobForm.requirements.filter(r => r.trim()),
        benefits: jobForm.benefits.filter(b => b.trim())
      };
      
      if (editingJob) {
        await axios.patch(`${API}/jobs/${editingJob.id}`, payload);
        toast.success("Job updated");
      } else {
        await axios.post(`${API}/jobs`, payload);
        toast.success("Job created");
      }
      
      setShowJobForm(false);
      setEditingJob(null);
      setJobForm({
        title: "", location: "", location_type: "REMOTE",
        description: "", requirements: [""], benefits: [""], accent_color: "yellow"
      });
      fetchAll();
    } catch (e) {
      toast.error("Failed to save job");
    }
  };

  const openEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title,
      location: job.location,
      location_type: job.location_type,
      description: job.description,
      requirements: job.requirements.length ? job.requirements : [""],
      benefits: job.benefits.length ? job.benefits : [""],
      accent_color: job.accent_color
    });
    setShowJobForm(true);
  };

  const addArrayItem = (field) => {
    setJobForm({ ...jobForm, [field]: [...jobForm[field], ""] });
  };

  const updateArrayItem = (field, index, value) => {
    const updated = [...jobForm[field]];
    updated[index] = value;
    setJobForm({ ...jobForm, [field]: updated });
  };

  const removeArrayItem = (field, index) => {
    const updated = jobForm[field].filter((_, i) => i !== index);
    setJobForm({ ...jobForm, [field]: updated.length ? updated : [""] });
  };

  const getStatusBadge = (status) => {
    const classes = {
      new: "status-new",
      reviewing: "status-reviewing",
      interviewed: "status-interviewed",
      accepted: "status-accepted",
      rejected: "status-rejected",
      unread: "status-unread",
      read: "status-read"
    };
    return `px-2 py-1 rounded-full text-[10px] font-bold uppercase ${classes[status] || "bg-gray-500 text-white"}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" data-testid="admin-dashboard">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <a href="/" className="text-gray-400 hover:text-white transition-colors" data-testid="back-to-site">
            <ArrowLeft size={20} />
          </a>
          <a href="/" className="text-2xl font-black tracking-tighter hover:text-[#ffde00] transition-colors">QRADIENT.</a>
          <span className="text-gray-500">/ Admin</span>
        </div>
      </header>

      <div className="p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="admin-glass rounded-2xl p-6" data-testid="stats-contacts">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#00c6ff]/20 flex items-center justify-center">
                <Mail className="text-[#00c6ff]" size={24} />
              </div>
              <div>
                <p className="text-3xl font-black">{stats.contacts?.total || 0}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Messages</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#00c6ff]">{stats.contacts?.unread || 0} unread</p>
          </div>

          <div className="admin-glass rounded-2xl p-6" data-testid="stats-jobs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ffde00]/20 flex items-center justify-center">
                <Briefcase className="text-[#ffde00]" size={24} />
              </div>
              <div>
                <p className="text-3xl font-black">{stats.jobs?.total || 0}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Jobs</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#ffde00]">{stats.jobs?.active || 0} active</p>
          </div>

          <div className="admin-glass rounded-2xl p-6" data-testid="stats-applications">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#ff5e00]/20 flex items-center justify-center">
                <Users className="text-[#ff5e00]" size={24} />
              </div>
              <div>
                <p className="text-3xl font-black">{stats.applications?.total || 0}</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Applications</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#ff5e00]">{stats.applications?.new || 0} new</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="bg-white/5 border border-white/10 mb-6">
            <TabsTrigger value="contacts" className="data-[state=active]:bg-white/10" data-testid="tab-contacts">
              Messages
            </TabsTrigger>
            <TabsTrigger value="jobs" className="data-[state=active]:bg-white/10" data-testid="tab-jobs">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-white/10" data-testid="tab-applications">
              Applications
            </TabsTrigger>
          </TabsList>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            <div className="admin-glass rounded-2xl overflow-hidden" data-testid="contacts-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td className="font-medium">{contact.name}</td>
                      <td className="text-gray-400">{contact.email}</td>
                      <td className="max-w-xs truncate text-gray-400">{contact.message}</td>
                      <td><span className={getStatusBadge(contact.status)}>{contact.status}</span></td>
                      <td className="text-gray-400">{formatDate(contact.created_at)}</td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <MoreVertical size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#1a1a1a] border-white/10">
                            <DropdownMenuItem onClick={() => openDetail(contact, "contact")}>
                              <Eye size={14} className="mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateContactStatus(contact.id, contact.status === "unread" ? "read" : "unread")}>
                              <Check size={14} className="mr-2" /> Toggle Read
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteContact(contact.id)} className="text-red-400">
                              <Trash2 size={14} className="mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {contacts.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-gray-500 py-12">No messages yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <div className="mb-4">
              <button 
                onClick={() => { setEditingJob(null); setShowJobForm(true); }}
                className="pharrell-btn text-xs flex items-center gap-2"
                data-testid="add-job-btn"
              >
                <Plus size={16} /> Add Job
              </button>
            </div>
            <div className="admin-glass rounded-2xl overflow-hidden" data-testid="jobs-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Apps</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td className="font-medium">{job.title}</td>
                      <td className="text-gray-400">{job.location}</td>
                      <td className="text-gray-400">{job.location_type}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${job.is_active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {job.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>{applications.filter(a => a.job_id === job.id).length}</td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <MoreVertical size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#1a1a1a] border-white/10">
                            <DropdownMenuItem onClick={() => openEditJob(job)}>
                              <Edit size={14} className="mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleJobStatus(job.id)}>
                              <Power size={14} className="mr-2" /> Toggle Status
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteJob(job.id)} className="text-red-400">
                              <Trash2 size={14} className="mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && (
                    <tr><td colSpan={6} className="text-center text-gray-500 py-12">No jobs yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <div className="admin-glass rounded-2xl overflow-hidden" data-testid="applications-table">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Job</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td className="font-medium">{app.name}</td>
                      <td className="text-gray-400">{app.email}</td>
                      <td className="text-gray-400">{app.job_title}</td>
                      <td className="text-gray-400">{app.experience_years} yrs</td>
                      <td><span className={getStatusBadge(app.status)}>{app.status}</span></td>
                      <td className="text-gray-400">{formatDate(app.created_at)}</td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <MoreVertical size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#1a1a1a] border-white/10">
                            <DropdownMenuItem onClick={() => openDetail(app, "application")}>
                              <Eye size={14} className="mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateApplicationStatus(app.id, "reviewing")}>
                              Reviewing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateApplicationStatus(app.id, "interviewed")}>
                              Interviewed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateApplicationStatus(app.id, "accepted")} className="text-green-400">
                              <Check size={14} className="mr-2" /> Accept
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateApplicationStatus(app.id, "rejected")} className="text-red-400">
                              <XIcon size={14} className="mr-2" /> Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteApplication(app.id)} className="text-red-400">
                              <Trash2 size={14} className="mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr><td colSpan={7} className="text-center text-gray-500 py-12">No applications yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg" data-testid="detail-modal">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {detailType === "contact" ? "Message Details" : "Application Details"}
            </DialogTitle>
          </DialogHeader>
          {selectedItem && detailType === "contact" && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Name</p>
                <p className="font-medium">{selectedItem.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Email</p>
                <p className="font-medium">{selectedItem.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Message</p>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedItem.message}</p>
              </div>
            </div>
          )}
          {selectedItem && detailType === "application" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Name</p>
                  <p className="font-medium">{selectedItem.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Email</p>
                  <p className="font-medium">{selectedItem.email}</p>
                </div>
              </div>
              {selectedItem.phone && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                  <p>{selectedItem.phone}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                {selectedItem.linkedin && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">LinkedIn</p>
                    <a href={selectedItem.linkedin} target="_blank" rel="noreferrer" className="text-[#00c6ff] hover:underline break-all">
                      {selectedItem.linkedin}
                    </a>
                  </div>
                )}
                {selectedItem.portfolio && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Portfolio</p>
                    <a href={selectedItem.portfolio} target="_blank" rel="noreferrer" className="text-[#00c6ff] hover:underline break-all">
                      {selectedItem.portfolio}
                    </a>
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Experience</p>
                <p>{selectedItem.experience_years} years</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Cover Letter</p>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedItem.cover_letter}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Form Modal */}
      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="job-form-modal">
          <DialogHeader>
            <DialogTitle className="text-xl font-black">
              {editingJob ? "Edit Job" : "Create New Job"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleJobSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Title</label>
              <input 
                type="text"
                value={jobForm.title}
                onChange={(e) => setJobForm({...jobForm, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00c6ff] focus:outline-none transition-colors"
                required
                data-testid="job-form-title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Location</label>
                <input 
                  type="text"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({...jobForm, location: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00c6ff] focus:outline-none transition-colors"
                  required
                  data-testid="job-form-location"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Type</label>
                <select 
                  value={jobForm.location_type}
                  onChange={(e) => setJobForm({...jobForm, location_type: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00c6ff] focus:outline-none transition-colors"
                  data-testid="job-form-type"
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ON-SITE">On-Site</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Accent Color</label>
              <select 
                value={jobForm.accent_color}
                onChange={(e) => setJobForm({...jobForm, accent_color: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00c6ff] focus:outline-none transition-colors"
                data-testid="job-form-color"
              >
                <option value="yellow">Yellow</option>
                <option value="blue">Blue</option>
                <option value="orange">Orange</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Description</label>
              <textarea 
                value={jobForm.description}
                onChange={(e) => setJobForm({...jobForm, description: e.target.value})}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#00c6ff] focus:outline-none transition-colors resize-none"
                required
                data-testid="job-form-description"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Requirements</label>
              {jobForm.requirements.map((req, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input 
                    type="text"
                    value={req}
                    onChange={(e) => updateArrayItem("requirements", i, e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00c6ff] focus:outline-none transition-colors"
                    data-testid={`job-form-req-${i}`}
                  />
                  <button type="button" onClick={() => removeArrayItem("requirements", i)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors">
                    <XIcon size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("requirements")} className="text-xs text-[#00c6ff] hover:underline">
                + Add Requirement
              </button>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-1 block">Benefits</label>
              {jobForm.benefits.map((ben, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input 
                    type="text"
                    value={ben}
                    onChange={(e) => updateArrayItem("benefits", i, e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#00c6ff] focus:outline-none transition-colors"
                    data-testid={`job-form-ben-${i}`}
                  />
                  <button type="button" onClick={() => removeArrayItem("benefits", i)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors">
                    <XIcon size={16} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem("benefits")} className="text-xs text-[#00c6ff] hover:underline">
                + Add Benefit
              </button>
            </div>
            <button type="submit" className="w-full pharrell-btn" data-testid="job-form-submit">
              {editingJob ? "Update Job" : "Create Job"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
