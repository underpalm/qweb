# Qradient AI Consulting Website - PRD

## Original Problem Statement
Build a website for an AI Consulting company called "Qradient" with:
- Full-screen hero with video/image background
- About section with mission/vision
- Services section with AI consulting offerings
- Partner/technology showcase (scrolling marquee)
- Jobs section with detailed job listings and application functionality
- Contact form that saves to database
- Admin panel to manage contacts and applications
- Design 1:1 based on provided HTML template

## User Personas
1. **B2B Enterprise Leaders** - Seeking AI consulting services
2. **Job Applicants** - Looking for AI/tech positions
3. **Admin Users** - Managing contacts and applications

## Core Requirements
- Landing page with Hero, Services, About, Jobs, Contact sections
- MongoDB-backed contact form
- Job listings with apply functionality
- Admin dashboard for data management
- CV/Resume file upload for applications

## What's Been Implemented

### Session 1 (22 Feb 2026)
- ✅ Full-stack React + FastAPI + MongoDB architecture
- ✅ Hero section with gradient text and full-screen background
- ✅ Glass-morphism navigation and cards
- ✅ About section with mission/vision
- ✅ Dynamic job listings with detail modal
- ✅ Job application form with full field support
- ✅ Contact form with MongoDB storage
- ✅ Admin dashboard with tabs (Messages, Jobs, Applications)
- ✅ Stats dashboard with real-time counts
- ✅ CRUD operations for all entities
- ✅ Application status workflow (new → reviewing → interviewed → accepted/rejected)
- ✅ Job create/edit/toggle/delete functionality

### Session 2 (Dec 2025)
- ✅ Services section with 4 service cards
- ✅ Partner/Technology scrolling marquee (OpenAI, AWS, NVIDIA, Google Cloud, Azure, Snowflake, Databricks, Hugging Face)
- ✅ Gradient fade effects on marquee edges for professional look
- ✅ Full-width team/workspace images section (above Contact)
- ✅ Fixed images section to be truly full-width (no side padding)
- ✅ CV/Resume file upload functionality in job applications
- ✅ Mobile responsive hamburger menu
- ✅ Privacy Policy modal
- ✅ Impressum modal (German legal requirements)

### Session 3 (23 Feb 2026)
- ✅ Complete design overhaul with dark theme (#0f172a, neon-green #00FF88)
- ✅ Service modal with detailed descriptions and images
- ✅ Values section (Client First, Excellence, Innovation, Trust)
- ✅ Layout fixes: Services section now uses full width (px-4)
- ✅ Reduced empty space below footer (pt-32 pb-16)
- ✅ Fixed Contact form backend connectivity with subject field
- ✅ Fixed Apply form backend connectivity (job_id parameter)
- ✅ Toast notifications for successful form submissions (German messages)
- ✅ **Job Modal erweitert**: Zeigt jetzt Anforderungen und Benefits
- ✅ **Newsletter-Anmeldung**: Neue Section mit E-Mail-Formular und Backend-Integration
- ✅ Submit Application Button funktioniert korrekt mit Erfolgs-Toast

## Tech Stack
- Frontend: React 19, Tailwind CSS, Shadcn/UI, Lucide React
- Backend: FastAPI, Motor (async MongoDB)
- Database: MongoDB

## API Endpoints
- `POST /api/contacts` - Submit contact form (name, email, subject, message)
- `GET /api/jobs` - Get job listings (with requirements & benefits)
- `POST /api/applications/upload` - Submit job application with CV (FormData)
- `POST /api/newsletter` - Subscribe to newsletter
- `GET /api/newsletter` - Get newsletter subscribers
- `DELETE /api/newsletter/{email}` - Unsubscribe from newsletter
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/cv/{filename}` - Download uploaded CV
- `POST /api/seed` - Initial data seeding

## P0/P1/P2 Features Remaining
### P1 (Nice to have)
- Email notifications for new applications
- Search/filter in admin
- Multiple language support (German/English toggle)

### P2 (Future)
- Analytics dashboard
- Public job board page

## Next Tasks
1. Add email notifications (SendGrid/Resend integration)
2. Add search functionality in admin
3. Multi-language support

