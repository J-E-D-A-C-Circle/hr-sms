# UI DEVELOPMENT PROMPT — DVLA HR SMS MESSAGING SYSTEM

## Project Title

**DVLA HR SMS Messaging & Staff Communication System**

## Project Overview

Design and develop a modern, professional, simple-to-use **HR SMS Messaging System for the Driver and Vehicle Licensing Authority (DVLA)**.

The system will be an internal web application used by the **DVLA Human Resources Department** to send SMS messages to individual staff members, selected groups of staff, departments, stations, regions, or the entire organization.

The primary purpose of the system is to make official staff communication faster, more organized, trackable, and easier to manage than manually sending SMS messages.

The UI should look like a **professional government enterprise application**. It must prioritize simplicity, clarity, accessibility, and efficient workflow.

---

# 1. DESIGN DIRECTION

Create a clean and professional administrative dashboard.

### Design principles

* Simple
* Clear
* Professional
* Government/institutional
* Modern but not flashy
* Easy for HR officers to understand
* Minimal unnecessary elements
* Strong visual hierarchy
* Spacious layouts
* Clear buttons and actions
* Responsive design
* Desktop-first, but responsive on tablets

### Avoid

* Glassmorphism
* Excessive gradients
* Neon colors
* Overly rounded interfaces
* Excessive animations
* Huge cards
* Unnecessary decorative elements
* Complicated navigation
* Consumer/social-media style UI

The application should feel like a **serious internal DVLA enterprise system**.

---

# 2. DVLA BRANDING

Use the **DVLA visual identity** throughout the application.

### Primary colors

Use DVLA-inspired colors:

* Deep Green as the primary brand color
* Yellow/Gold as the secondary accent
* White for backgrounds
* Very light gray for page sections
* Dark charcoal for primary text
* Muted gray for secondary text

The colors should be used carefully.

Green should primarily be used for:

* Primary buttons
* Active navigation
* Important status indicators
* Selected states
* Branding

Yellow/Gold should primarily be used for:

* Small accents
* Highlights
* Warning/attention states
* Branding details

Do not make the entire interface green or yellow.

---

# 3. TYPOGRAPHY

Use **Poppins** throughout the application.

Recommended weights:

* 400 — regular text
* 500 — labels and navigation
* 600 — headings and buttons
* 700 — major page headings

Keep typography readable and professional.

---

# 4. APPLICATION LAYOUT

Use a standard enterprise dashboard structure.

### Desktop layout

```text
---------------------------------------------------------
| DVLA LOGO | System Name                    | Profile |
---------------------------------------------------------
|           |                                            |
| Sidebar   | Main Content                               |
|           |                                            |
| Dashboard |                                            |
| Messages  |                                            |
| Staff     |                                            |
| Groups    |                                            |
| Templates |                                            |
| History   |                                            |
| Reports   |                                            |
| Settings  |                                            |
|           |                                            |
---------------------------------------------------------
```

### Sidebar

The sidebar should contain:

1. Dashboard
2. Send SMS
3. Staff Directory
4. Staff Groups
5. Message Templates
6. SMS History
7. Delivery Reports
8. Scheduled Messages
9. Settings

At the bottom:

* Logged-in user
* HR role
* Logout

Use simple line icons.

---

# 5. TOP NAVIGATION

The top bar should contain:

### Left

Current page title.

Example:

**Send SMS**

### Right

* Notification icon
* Logged-in user name
* User role: HR Administrator
* Profile/avatar
* Dropdown menu

Keep the top bar minimal.

---

# 6. DASHBOARD

Create a professional HR SMS dashboard.

### Header

**Good morning, HR Administrator**

Subtitle:

**Manage and monitor DVLA staff SMS communications from one place.**

### Statistics cards

Display:

#### Total Staff

Example:

**2,486**

Active staff registered in the system.

#### SMS Sent Today

Example:

**1,245**

#### Delivered

Example:

**1,192**

#### Failed

Example:

**53**

Use small icons and subtle status indicators.

---

# 7. DASHBOARD QUICK ACTIONS

Create a section called:

**Quick Actions**

Buttons:

### Send SMS

Start a new individual or bulk SMS.

### Staff Directory

View and search staff members.

### Create Group

Create a staff communication group.

### Message History

View previously sent messages.

### Schedule SMS

Schedule a message for a future date and time.

---

# 8. RECENT SMS ACTIVITY

Create a table showing recent communication.

Columns:

| Date | Message | Recipients | Type | Status | Action |
| ---- | ------- | ---------- | ---- | ------ | ------ |

Example:

**02 Sep 2026 | Staff Meeting Reminder | 245 Staff | Group | Delivered | View**

Status badges:

* Delivered — green
* Pending — yellow
* Failed — red
* Scheduled — blue

---

# 9. SEND SMS PAGE

This is one of the most important screens.

Create a clean SMS composition interface.

Page title:

**Send SMS**

Subtitle:

**Send an official message to individual staff members or selected staff groups.**

---

## Recipient Type

Provide two large selectable options:

### Individual Staff

Send a message to one or more specific staff members.

### Staff Group

Send a message to an organized group of staff.

Also allow:

**All Staff**

for authorized HR administrators.

---

# 10. INDIVIDUAL STAFF SMS

When Individual Staff is selected:

Show a searchable staff selector.

Example:

```text
Search staff by name, staff ID, department or phone number
-----------------------------------------------------------
John Mensah        DVLA-00125     HR Department
Ama Boateng        DVLA-00452     Finance
Kwame Asante       DVLA-00983     IT Department
```

Allow HR officers to select multiple staff.

Selected recipients should appear as removable chips.

Example:

```text
John Mensah ×
Ama Boateng ×
Kwame Asante ×
```

Display:

**3 recipients selected**

---

# 11. GROUP SMS

When Staff Group is selected, display group cards/dropdowns.

Available group categories:

### Department

* Human Resources
* Information Technology
* Finance
* Administration
* Legal
* Procurement
* Accounts
* Operations

### Location

* Head Office
* Regional Offices
* District Offices
* DVLA Stations

### Employment Category

* Permanent Staff
* Contract Staff
* Management
* Supervisors
* Officers

Allow the HR administrator to select one or multiple groups.

Example:

```text
Selected Groups

Human Resources          42 Staff     ×
IT Department             28 Staff     ×
Accra Regional Office     86 Staff     ×

Total Recipients: 156
```

---

# 12. MESSAGE COMPOSER

Create a large clean SMS text area.

Label:

**Message**

Placeholder:

**Type your message here...**

Below the text area display:

**Characters: 0 / 160**

and:

**SMS Parts: 0**

Automatically update these counters as the user types.

If the message exceeds one SMS, clearly indicate:

**This message will be sent as 2 SMS parts.**

---

# 13. MESSAGE TEMPLATES

Add a button:

**Use Template**

Clicking it opens a modal containing predefined HR templates.

Example templates:

### Staff Meeting

**Staff Meeting Reminder**

### General Announcement

**General Staff Announcement**

### Training

**Training Notification**

### Payroll

**Payroll Notification**

### Holiday

**Public Holiday Notice**

### Emergency

**Urgent Staff Notice**

Allow users to select a template and automatically populate the message composer.

---

# 14. SENDER ID

Add a sender ID selector.

Example:

```text
Sender ID

DVLA-HR
```

If multiple sender IDs are available:

```text
DVLA-HR
DVLA
DVLA-ADMIN
```

Only authorized sender IDs should be available.

---

# 15. SEND OPTIONS

Provide two options:

### Send Now

Send the message immediately.

### Schedule

Schedule the SMS for a future date and time.

When Schedule is selected, display:

```text
Date
[ 05 September 2026 ]

Time
[ 09:30 AM ]
```

---

# 16. MESSAGE PREVIEW

Before sending, provide a preview panel.

Example:

```text
SMS PREVIEW

From:
DVLA-HR

To:
156 recipients

Message:

Dear Staff, please be reminded that the
monthly departmental meeting will be held
on Friday at 10:00 AM.

---------------------------------

Recipients: 156
SMS Parts: 1
Estimated SMS: 156
```

---

# 17. CONFIRMATION BEFORE SENDING

When the HR officer clicks:

**Send SMS**

show a confirmation modal.

Example:

**Confirm SMS**

You are about to send this message to:

**156 staff members**

Message:

> Dear Staff, please be reminded...

Buttons:

**Cancel**

**Confirm & Send**

For large broadcasts, require an additional confirmation.

Example:

**This message will be sent to 2,486 staff members. Are you sure you want to continue?**

---

# 18. STAFF DIRECTORY

Create a complete staff directory page.

Header:

**Staff Directory**

Subtitle:

**View and manage DVLA staff communication records.**

Include:

### Search

Search by:

* Name
* Staff ID
* Phone number
* Department
* Station

### Filters

* Department
* Region
* Station
* Employment type
* Status

### Table

| Staff ID | Name | Department | Location | Phone | Status |
| -------- | ---- | ---------- | -------- | ----- | ------ |

Example:

**DVLA-00125 | John Mensah | HR | Head Office | 024 XXX XXXX | Active**

Use pagination.

---

# 19. STAFF PROFILE

Clicking a staff member should open a profile page/drawer.

Display:

### Staff Information

* Staff ID
* Full name
* Department
* Position
* Region
* Station
* Phone number
* Employment type
* Status

### Communication History

Show SMS messages previously sent to that staff member.

Columns:

* Date
* Message
* Status
* Sender

Add a prominent button:

**Send SMS to Staff Member**

---

# 20. STAFF GROUPS

Create a dedicated Staff Groups page.

Header:

**Staff Groups**

Display groups as simple cards or table rows.

Example:

```text
Human Resources
42 Staff

IT Department
28 Staff

Finance Department
56 Staff

Accra Regional Offices
186 Staff
```

Each group should have:

* Group name
* Number of staff
* Description
* Created date
* Last updated
* View
* Edit

Button:

**+ Create Group**

---

# 21. CREATE GROUP

Provide a simple form:

### Group Name

Example:

**Regional Managers**

### Description

Example:

**DVLA regional managers across all regions.**

### Group Members

Allow staff selection using:

* Search
* Department
* Region
* Station
* Position

Display selected staff.

Button:

**Create Group**

---

# 22. SMS HISTORY

Create a complete SMS history page.

Header:

**SMS History**

Display:

| Date | Sender | Message | Recipients | Type | Status | Actions |
| ---- | ------ | ------- | ---------- | ---- | ------ | ------- |

Filters:

* Date range
* Sender
* Message type
* Status
* Department
* Group

Actions:

**View Details**

**Resend**

**Export**

---

# 23. SMS DETAILS

Clicking a message should open detailed information.

Display:

### Message Information

* Message ID
* Date sent
* Time sent
* Sender
* Sender ID
* Message
* Number of recipients
* SMS parts
* Total SMS units

### Delivery Summary

Example:

```text
Delivered       1,192
Pending            21
Failed             32
```

Use a simple visual progress indicator.

---

# 24. DELIVERY REPORTS

Create a dedicated reporting page.

Show:

### SMS Delivery Statistics

* Total sent
* Delivered
* Failed
* Pending
* Delivery rate

Add date filtering.

Example:

```text
Date Range
[01 Sep 2026] — [03 Sep 2026]
```

Include simple charts:

### SMS Volume

Show SMS sent over time.

### Delivery Status

Show:

* Delivered
* Failed
* Pending

Keep charts clean and professional.

---

# 25. SCHEDULED MESSAGES

Create a page for scheduled communications.

Table:

| Message | Recipients | Scheduled Date | Time | Status | Action |
| ------- | ---------- | -------------- | ---- | ------ | ------ |

Statuses:

* Scheduled
* Processing
* Sent
* Cancelled

Actions:

**View**

**Edit**

**Cancel**

---

# 26. MESSAGE TEMPLATES

Create a template management page.

Display:

```text
Message Templates

Staff Meeting
General Announcement
Training Notification
Emergency Notice
Payroll Notification
Holiday Notice
```

Each template should have:

* Template name
* Category
* Last modified
* Created by
* Actions

Actions:

**Edit**

**Duplicate**

**Delete**

Button:

**+ Create Template**

---

# 27. SETTINGS

Create a simple settings section.

### SMS Settings

* Default sender ID
* SMS provider
* Character limits
* Delivery settings

### Organization Settings

* DVLA departments
* Regions
* Stations
* Staff categories

### User Management

* HR Administrators
* HR Officers
* Communication Officers
* View-only users

---

# 28. USER ROLES

Design the interface around role-based access.

### HR Administrator

Full access.

Can:

* Send SMS
* Broadcast SMS
* Manage staff
* Manage groups
* Manage templates
* View reports
* Manage users
* Manage settings

### HR Officer

Can:

* Send SMS
* View staff
* Manage groups
* View SMS history
* View reports

### Communication Officer

Can:

* Send approved messages
* View delivery reports
* View message history

### Viewer

Read-only access.

---

# 29. NOTIFICATIONS

Use small toast notifications.

Examples:

Success:

**SMS sent successfully to 156 recipients.**

Warning:

**Your message contains 2 SMS parts.**

Error:

**Some recipients could not be processed.**

Scheduled:

**SMS scheduled successfully for 5 September at 9:30 AM.**

---

# 30. RESPONSIVE DESIGN

The application must work properly on:

* Desktop
* Laptop
* Tablet

Desktop should be the primary target because this is an internal HR system.

On smaller screens:

* Collapse sidebar
* Make tables horizontally scrollable
* Stack form sections
* Keep primary actions visible
* Maintain readable typography

---

# 31. COMPONENT STYLE

Use consistent components throughout the application.

### Buttons

Primary:

**Green filled button**

Secondary:

**White button with green border**

Danger:

**Red button**

### Cards

Use:

* White background
* Subtle border
* Small radius
* Very light shadow

### Tables

Use:

* Clear headers
* Comfortable row spacing
* Hover states
* Status badges
* Pagination

### Forms

Use:

* Clear labels
* Large enough input fields
* Helpful placeholders
* Validation messages
* Consistent spacing

---

# 32. ICONS

Use a professional icon library such as **Lucide Icons**.

Suggested icons:

Dashboard → LayoutDashboard

SMS → MessageSquare

Staff → Users

Groups → UsersRound

Templates → FileText

History → History

Reports → BarChart3

Schedule → CalendarClock

Settings → Settings

Notifications → Bell

Profile → UserCircle

Search → Search

Send → Send

---

# 33. IMPORTANT USER EXPERIENCE REQUIREMENTS

The system must make it extremely difficult for an HR officer to accidentally broadcast an SMS to the wrong people.

Always clearly show:

**WHO will receive the message**

**HOW MANY people will receive it**

**WHAT message will be sent**

**WHEN it will be sent**

before the final confirmation.

For example:

```text
RECIPIENTS
Human Resources + Accra Regional Office

TOTAL RECIPIENTS
228 Staff

MESSAGE
Staff meeting scheduled for Friday...

SENDING TIME
Immediately
```

This information should be highly visible before sending.

---

# 34. EMPTY STATES

Create professional empty states.

Example:

**No SMS history**

No messages have been sent yet.

**No staff found**

Try changing your search or filters.

**No scheduled messages**

There are currently no scheduled SMS messages.

---

# 35. LOADING STATES

Use skeleton loaders for:

* Staff tables
* Dashboard statistics
* SMS history
* Reports

Avoid excessive spinners.

---

# 36. ERROR HANDLING

Display friendly and understandable error messages.

Never show raw system errors to the user.

Example:

Instead of:

`500 Internal Server Error`

show:

**Unable to load staff records**

Please try again.

---

# 37. ACCESSIBILITY

Ensure:

* Good text contrast
* Keyboard navigation
* Clear focus states
* Readable font sizes
* Buttons have clear labels
* Icons should not be the only indication of an action
* Status should use both color and text

---

# 38. TECHNOLOGY / FRONTEND

Build the frontend using:

* **Next.js**
* **React**
* **JavaScript (.js), NOT TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide React icons**

Use reusable components.

Suggested structure:

```text
app/
components/
  layout/
  dashboard/
  sms/
  staff/
  groups/
  templates/
  reports/
  settings/
lib/
public/
```

---

# 39. MOCK DATA

For the initial UI prototype, use realistic DVLA sample data.

Create mock staff records such as:

* Staff ID
* Name
* Department
* Region
* Station
* Position
* Phone number
* Employment type
* Status

Do NOT use real personal information.

Use fictional Ghanaian names and masked phone numbers.

Example:

**024 XXX 1234**

---

# 40. IMPORTANT DESIGN REQUIREMENT

The entire application should feel like **one unified DVLA HR system**, not a collection of unrelated pages.

Maintain:

* Same sidebar
* Same top navigation
* Same typography
* Same spacing
* Same button styles
* Same colors
* Same table styles
* Same status badges
* Same interaction patterns

Every page should visually belong to the same system.

---

# 41. FINAL UI GOAL

The final interface should communicate:

**"This is the official internal DVLA HR communication platform."**

It should be:

**Simple → Fast → Professional → Secure-looking → Easy to understand → Efficient**

The most important workflow should be:

```text
Select Recipients
       ↓
Compose Message
       ↓
Review Recipients
       ↓
Preview Message
       ↓
Confirm
       ↓
Send / Schedule
       ↓
Track Delivery
```

Design the UI around this workflow.

Do not overcomplicate the application.

Prioritize the **Send SMS**, **Staff Directory**, **Staff Groups**, **SMS History**, and **Delivery Reports** screens because these will be the most frequently used areas of the system.
