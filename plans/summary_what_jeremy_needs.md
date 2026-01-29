What Jeremy & Keith Want You to Build
The Business Problem
Jeremy Gravel runs a depreciation report service for strata councils (condo associations) in Canada. Currently, the process is inefficient:

Property managers act as middlemen between Jeremy's team and strata councils
Data collection is slow and fragmented
Council members can't directly input information
Too much back-and-forth communication delays reports
The Solution
A self-service portal where strata council members can directly:

Fill out property surveys
Upload required documents
Schedule meetings with Jeremy's team
Track their progress
Receive their depreciation reports
Think of it as: "TurboTax for Depreciation Reports" - guiding users through a complex process step-by-step.

The Core Requirements
🎯 Primary Users (Strata Council Members)
Who: Senior citizens (60-75 years old), not tech-savvy

What they need to do:

Answer questions about their building (surveys)
Upload mandatory documents (strata plan, bylaws, insurance, AGM minutes)
Upload optional documents (engineering reports, financials)
Set their AGM date (Annual General Meeting)
Schedule site inspection with Jeremy's team
Review and approve draft reports
Download final depreciation report
Design requirements:

Large buttons, clear text (senior-friendly)
Desktop/tablet optimized (not mobile - they use computers)
Simple navigation with minimal clicks
Progress tracking so they know what's left to do
Auto-save (seniors might forget to save)
🎯 Secondary Users (Jeremy's SRP Staff)
3 Role Types:

Administrator (Jeremy/Keith) - Full access to everything
Assistant - Help manage projects, limited permissions
Inspector - Schedule site visits, review submissions
What staff needs:

Dashboard to monitor all active projects
See which strata councils are behind schedule
Export data (CSV/PDF) for analysis
Send automated reminder emails
Track document uploads with legal audit trail
Manage user accounts (5-user limit per strata)
🔑 Key Features Required
1. Dynamic Survey System
7 survey sections that adapt based on building type:
Exterior (building, roof, parking, landscaping)
Interior (hallways, elevators, common areas)
Services (HVAC, plumbing, electrical)
Clubhouse (recreation facilities)
Amenity Rooms (shared spaces)
Legal (strata plan details, bylaws)
Council Concerns (special maintenance issues)
2. Document Upload System
Mandatory documents (clearly labeled):
Strata Plan
Bylaws
Insurance Certificate
AGM Minutes (last 2 years)
Optional documents:
Engineering reports
Warranty documents
Contractor invoices
Financial records
Activity & Liability Log: Legal audit trail of who uploaded what and when
3. Timeline Calculator
User sets AGM date (this is the critical deadline)
System auto-calculates working backwards:
Data collection deadline
Site inspection date
Draft report review date
Final report delivery date
Visual timeline showing progress and upcoming milestones
4. Meeting Scheduler
3 types of meetings:
Site Inspection (Jeremy's team visits property)
Draft Review Meeting (review preliminary findings)
General meetings
Calendar-based booking interface
5. Automated Email Notifications
Progress reminders: "You're 75% complete!"
Deadline alerts: "Your AGM is in 30 days"
Call-to-action buttons: "Continue My Progress"
Friendly, non-technical tone for seniors
6. Team Collaboration
Multiple council members can work simultaneously (5-user limit per strata)
Progress tracker: See who's doing what
Avoid duplication: "John is working on surveys, Mary uploaded bylaws"
7. Role-Based Access
Strata Council Members: Can only see their own strata's data
SRP Admin: Can see all projects, export data, manage users
SRP Assistant: View-only access, can send reminders
SRP Inspector: Schedule inspections, review submissions
🇨🇦 Canadian Compliance
Data residency: All data stored on Canadian servers (legal requirement)
Privacy: No collection of unnecessary PII
Audit trail: Legal liability protection for councils
🎨 Branding Requirements
Jeremy's green color palette:
Primary: #6B8E5F
Dark: #5a7850
Light: #8fa882
Surface: #f5f7f4
Accent: #a4c297
Logo integration throughout the app
Professional, trustworthy appearance
✅ Success Criteria
For Strata Councils:

Can complete entire data collection without contacting property manager
Clear progress tracking so they know what's left to do
Senior-friendly interface (no confusion, no tech support calls)
Complete in 2-3 sessions (don't need to finish in one sitting)
For Jeremy's Team:

Receive complete, organized data in one submission
80% reduction in back-and-forth emails
Automated reminders reduce manual follow-ups
Legal audit trail protects against liability disputes
Export data for report writing
🚀 Current Status
You've built a 100% feature-complete frontend with:

✅ 15+ fully functional screens
✅ All user flows (strata + admin)
✅ Role-based navigation
✅ Senior-friendly UI
✅ Mock data for testing
What's missing (for production):

Backend database (Supabase recommended for Canadian hosting)
Real authentication
Actual file storage
Email service integration
Payment processing (if Jeremy charges for the service)
In one sentence: Jeremy wants a self-service portal that eliminates property manager bottlenecks by letting strata councils directly submit all required information for their depreciation reports through a simple, senior-friendly interface.