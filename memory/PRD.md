# Qradient AI Consulting Website - PRD

## Original Problem Statement
Build a website for an AI Consulting company called "Qradient" with:
- Full-screen hero with video/image background
- About section with mission/vision
- Jobs section with detailed job listings and application functionality
- Contact form that saves to database
- Admin panel to manage contacts and applications
- Design 1:1 based on provided HTML template

## User Personas
1. **B2B Enterprise Leaders** - Seeking AI consulting services
2. **Job Applicants** - Looking for AI/tech positions
3. **Admin Users** - Managing contacts and applications

## Core Requirements
- Landing page with Hero, About, Jobs, Contact sections
- MongoDB-backed contact form
- Job listings with apply functionality
- Admin dashboard for data management

## What's Been Implemented (22 Feb 2026)
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

## Tech Stack
- Frontend: React 19, Tailwind CSS, Shadcn/UI
- Backend: FastAPI, Motor (async MongoDB)
- Database: MongoDB

## API Endpoints
- `/api/contacts` - Contact messages CRUD
- `/api/jobs` - Job listings CRUD
- `/api/applications` - Job applications CRUD
- `/api/stats` - Dashboard statistics
- `/api/seed` - Initial data seeding

## P0/P1/P2 Features Remaining
### P1 (Nice to have)
- Email notifications for new applications
- PDF resume upload
- Search/filter in admin

### P2 (Future)
- Multi-language support
- Analytics dashboard
- Public job board page

## Next Tasks
1. Add email notifications (SendGrid/Resend integration)
2. File upload for resumes
3. Add search functionality in admin
