// DVLA HR SMS Messaging & Staff Communication System - Realistic Data Set

export const DEPARTMENTS = [
  "Human Resources",
  "Information Technology",
  "Finance",
  "Administration",
  "Legal",
  "Procurement",
  "Accounts",
  "Operations"
];

export const REGIONS = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Northern",
  "Central",
  "Volta",
  "Bono"
];

export const STATIONS = [
  "Head Office (14th Ave, Accra)",
  "37 Driver & Vehicle Licensing Center",
  "Tema Station",
  "Kumasi Regional Office (Asokwa)",
  "Takoradi Regional Office",
  "Tamale Station",
  "Cape Coast Station",
  "Ho Regional Office",
  "Sunyani Station"
];

export const EMPLOYMENT_CATEGORIES = [
  "Permanent Staff",
  "Contract Staff",
  "Management",
  "Supervisors",
  "Officers"
];

export const SENDER_IDS = [
  "DVLA-HR",
  "DVLA",
  "DVLA-ADMIN",
  "DVLA-INFO"
];

export const MNOTIFY_CONFIG = {
  providerName: "mNotify Ghana Enterprise API Gateway (v3)",
  apiKey: process.env.MNOTIFY_API_KEY || "JCxSF806JZq1TMUWRCF0maKkI",
  senderId: process.env.NEXT_PUBLIC_MNOTIFY_SENDER_ID || process.env.MNOTIFY_SENDER_ID || "Weskina",
  creditBalance: 300,
  smsRateGhc: 0.035,
  status: "Connected & Active",
  endpoint: process.env.MNOTIFY_API_URL || "https://api.mnotify.com/api/sms/quick"
};

export const INITIAL_STAFF = [
  { id: "DVLA-00125", name: "John Mensah", department: "Human Resources", position: "HR Director", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "024 XXX 1234", email: "j.mensah@dvla.gov.gh", employmentType: "Management", status: "Active" },
  { id: "DVLA-00452", name: "Ama Boateng", department: "Finance", position: "Senior Accountant", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "020 XXX 5678", email: "a.boateng@dvla.gov.gh", employmentType: "Permanent Staff", status: "Active" },
  { id: "DVLA-00983", name: "Kwame Asante", department: "Information Technology", position: "Head of IT Systems", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "055 XXX 9012", email: "k.asante@dvla.gov.gh", employmentType: "Management", status: "Active" },
  { id: "DVLA-01104", name: "Kofi Annan Baah", department: "Operations", position: "Licensing Officer", region: "Greater Accra", station: "37 Driver & Vehicle Licensing Center", phone: "024 XXX 3344", email: "k.baah@dvla.gov.gh", employmentType: "Officers", status: "Active" },
  { id: "DVLA-01290", name: "Abena Owusu-Ansah", department: "Administration", position: "Administrative Officer", region: "Greater Accra", station: "Tema Station", phone: "027 XXX 8890", email: "a.owusu@dvla.gov.gh", employmentType: "Permanent Staff", status: "Active" },
  { id: "DVLA-01455", name: "Kwesi Appiah", department: "Operations", position: "Vehicle Inspection Supervisor", region: "Ashanti", station: "Kumasi Regional Office (Asokwa)", phone: "020 XXX 7711", email: "k.appiah@dvla.gov.gh", employmentType: "Supervisors", status: "Active" },
  { id: "DVLA-01622", name: "Efua Kyei", department: "Legal", position: "Legal Counsel", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "054 XXX 4422", email: "e.kyei@dvla.gov.gh", employmentType: "Permanent Staff", status: "Active" },
  { id: "DVLA-01890", name: "Yaw Ofori", department: "Procurement", position: "Procurement Manager", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "026 XXX 1155", email: "y.ofori@dvla.gov.gh", employmentType: "Management", status: "Active" },
  { id: "DVLA-02031", name: "Akua Donkor", department: "Human Resources", position: "Training Coordinator", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "024 XXX 6677", email: "a.donkor@dvla.gov.gh", employmentType: "Officers", status: "Active" },
  { id: "DVLA-02219", name: "Kojo Kyei-Baffour", department: "Information Technology", position: "Network Administrator", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "050 XXX 9988", email: "k.baffour@dvla.gov.gh", employmentType: "Permanent Staff", status: "Active" },
  { id: "DVLA-02380", name: "Grace Addo", department: "Human Resources", position: "HR Officer", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "024 XXX 4433", email: "g.addo@dvla.gov.gh", employmentType: "Officers", status: "Active" },
  { id: "DVLA-02401", name: "Emmanuel Osei", department: "Human Resources", position: "Chief HR Officer", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "024 XXX 1100", email: "e.osei@dvla.gov.gh", employmentType: "Management", status: "Active" },
  { id: "DVLA-02550", name: "Samuel Darko", department: "Operations", position: "Driver Testing Officer", region: "Western", station: "Takoradi Regional Office", phone: "027 XXX 5522", email: "s.darko@dvla.gov.gh", employmentType: "Officers", status: "Active" },
  { id: "DVLA-02712", name: "Esi Quansah", department: "Accounts", position: "Accounts Officer", region: "Western", station: "Takoradi Regional Office", phone: "020 XXX 8833", email: "e.quansah@dvla.gov.gh", employmentType: "Contract Staff", status: "Active" },
  { id: "DVLA-02844", name: "Fiifi Egyir", department: "Operations", position: "Licensing Supervisor", region: "Northern", station: "Tamale Station", phone: "055 XXX 2211", email: "f.egyir@dvla.gov.gh", employmentType: "Supervisors", status: "Active" },
  { id: "DVLA-03012", name: "Mavis Tachie", department: "Administration", position: "Front Desk Coordinator", region: "Central", station: "Cape Coast Station", phone: "024 XXX 7744", email: "m.tachie@dvla.gov.gh", employmentType: "Contract Staff", status: "Active" },
  { id: "DVLA-03198", name: "Patrick Agbezuge", department: "Operations", position: "Station Manager", region: "Volta", station: "Ho Regional Office", phone: "026 XXX 9911", email: "p.agbezuge@dvla.gov.gh", employmentType: "Management", status: "Active" },
  { id: "DVLA-03350", name: "Nii Armah Mensah", department: "Information Technology", position: "Database Specialist", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "054 XXX 3366", email: "n.mensah@dvla.gov.gh", employmentType: "Permanent Staff", status: "On Leave" },
  { id: "DVLA-03510", name: "Bernice Badu", department: "Finance", position: "Auditor", region: "Ashanti", station: "Kumasi Regional Office (Asokwa)", phone: "020 XXX 4455", email: "b.badu@dvla.gov.gh", employmentType: "Supervisors", status: "Active" },
  { id: "DVLA-03688", name: "Francis Gyamfi", department: "Procurement", position: "Storekeeper", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "024 XXX 0099", email: "f.gyamfi@dvla.gov.gh", employmentType: "Permanent Staff", status: "Active" }
];

export const INITIAL_GROUPS = [
  {
    id: "grp-1",
    name: "Human Resources",
    category: "Department",
    count: 42,
    description: "All personnel under the HR directorate across head office & regional centers.",
    createdDate: "15 Jan 2026",
    lastUpdated: "28 Aug 2026",
    members: ["DVLA-00125", "DVLA-02031", "DVLA-02380", "DVLA-02401"]
  },
  {
    id: "grp-2",
    name: "IT Department",
    category: "Department",
    count: 28,
    description: "Software, infrastructure and database management team.",
    createdDate: "20 Jan 2026",
    lastUpdated: "01 Sep 2026",
    members: ["DVLA-00983", "DVLA-02219", "DVLA-03350"]
  },
  {
    id: "grp-3",
    name: "Accra Regional Offices",
    category: "Location",
    count: 186,
    description: "Staff deployed at 37 Center, Tema Station, and Greater Accra operational hubs.",
    createdDate: "02 Feb 2026",
    lastUpdated: "30 Aug 2026",
    members: ["DVLA-01104", "DVLA-01290"]
  },
  {
    id: "grp-4",
    name: "Management & Directorate",
    category: "Employment Category",
    count: 34,
    description: "Executive Management, Station Managers, and Departmental Heads nationwide.",
    createdDate: "10 Jan 2026",
    lastUpdated: "25 Aug 2026",
    members: ["DVLA-00125", "DVLA-00983", "DVLA-01890", "DVLA-02401", "DVLA-03198"]
  },
  {
    id: "grp-5",
    name: "Licensing Supervisors",
    category: "Employment Category",
    count: 65,
    description: "Vehicle examination and driver testing supervisors across all stations.",
    createdDate: "12 Feb 2026",
    lastUpdated: "02 Sep 2026",
    members: ["DVLA-01455", "DVLA-02844", "DVLA-03510"]
  },
  {
    id: "grp-6",
    name: "Kumasi Regional Station",
    category: "Location",
    count: 92,
    description: "Ashanti Region main licensing hub staff.",
    createdDate: "18 Feb 2026",
    lastUpdated: "29 Aug 2026",
    members: ["DVLA-01455", "DVLA-03510"]
  }
];

export const INITIAL_TEMPLATES = [
  {
    id: "tpl-1",
    title: "Staff Meeting Reminder",
    category: "Staff Meeting",
    message: "Dear Staff, please be reminded that the monthly departmental meeting will be held on Friday at 10:00 AM in Conference Room A. Attendance is mandatory.",
    lastModified: "01 Sep 2026",
    createdBy: "Emmanuel Osei (HR Admin)"
  },
  {
    id: "tpl-2",
    title: "General Staff Announcement",
    category: "General Announcement",
    message: "OFFICIAL NOTICE: Management announces the rollout of the new DVLA digital staff portal. Please check your official email for login credentials.",
    lastModified: "28 Aug 2026",
    createdBy: "Grace Addo (HR Officer)"
  },
  {
    id: "tpl-3",
    title: "Training Notification",
    category: "Training",
    message: "Notice: Mandatory Customer Service Excellence Training for all licensing officers commences on Monday at 09:00 AM. Please register with HR.",
    lastModified: "25 Aug 2026",
    createdBy: "Emmanuel Osei (HR Admin)"
  },
  {
    id: "tpl-4",
    title: "Urgent Staff Notice",
    category: "Emergency",
    message: "URGENT SAFETY ALERT: Due to scheduled facility maintenance, the Head Office licensing hall will close at 2:00 PM today. Emergency protocols active.",
    lastModified: "02 Sep 2026",
    createdBy: "Kofi Baah (Comm Officer)"
  },
  {
    id: "tpl-5",
    title: "Payroll Notification",
    category: "Payroll",
    message: "Dear Staff, September 2026 monthly salary advice slips are now available on the employee portal. Please report any discrepancies to Finance.",
    lastModified: "30 Aug 2026",
    createdBy: "Emmanuel Osei (HR Admin)"
  },
  {
    id: "tpl-6",
    title: "Public Holiday Notice",
    category: "Holiday",
    message: "SEASON GREETINGS: DVLA offices nationwide will be closed on Monday for the upcoming Public Holiday. Normal operations resume Tuesday at 08:00 AM.",
    lastModified: "15 Aug 2026",
    createdBy: "Grace Addo (HR Officer)"
  }
];

export const INITIAL_HISTORY = [
  {
    id: "SMS-9083",
    date: "03 Sep 2026",
    time: "10:15 AM",
    sender: "Emmanuel Osei",
    senderId: "DVLA-HR",
    message: "URGENT NOTICE: All Regional Managers are requested to submit Q3 staffing reports to the HR Directorate before 4:00 PM today.",
    recipientsSummary: "34 Staff Members",
    recipientType: "Group (Management)",
    type: "Group",
    status: "Delivered",
    deliveredCount: 34,
    pendingCount: 0,
    failedCount: 0,
    parts: 1,
    totalUnits: 34
  },
  {
    id: "SMS-9082",
    date: "03 Sep 2026",
    time: "08:45 AM",
    sender: "Emmanuel Osei",
    senderId: "DVLA-HR",
    message: "Emergency IT Systems Maintenance tonight from 11:00 PM to 03:00 AM. Access to internal portals will be temporarily suspended.",
    recipientsSummary: "28 Staff Members",
    recipientType: "Group (IT Department)",
    type: "Group",
    status: "Delivered",
    deliveredCount: 28,
    pendingCount: 0,
    failedCount: 0,
    parts: 1,
    totalUnits: 28
  },
  {
    id: "SMS-9081",
    date: "02 Sep 2026",
    time: "02:15 PM",
    sender: "Grace Addo",
    senderId: "DVLA-HR",
    message: "Staff Meeting Reminder: Monthly departmental review meeting will be held on Friday at 10:00 AM sharp in Conference Hall A.",
    recipientsSummary: "245 Staff Members",
    recipientType: "Group (Accra Regional & HR)",
    type: "Group",
    status: "Delivered",
    deliveredCount: 239,
    pendingCount: 0,
    failedCount: 6,
    parts: 1,
    totalUnits: 245,
    recipientLogs: [
      { staffId: "DVLA-01104", name: "Kofi Annan Baah", department: "Operations", station: "37 Driver Center", phone: "024 XXX 3344", status: "Delivered", deliveredAt: "02 Sep 2026 02:15 PM" },
      { staffId: "DVLA-01290", name: "Abena Owusu-Ansah", department: "Administration", station: "Tema Station", phone: "027 XXX 8890", status: "Delivered", deliveredAt: "02 Sep 2026 02:15 PM" },
      { staffId: "DVLA-01455", name: "Kwesi Appiah", department: "Operations", station: "Kumasi Regional Office", phone: "020 XXX 7711", status: "Delivered", deliveredAt: "02 Sep 2026 02:15 PM" },
      { staffId: "DVLA-02712", name: "Esi Quansah", department: "Accounts", station: "Takoradi Station", phone: "020 XXX 8833", status: "Failed", failureReason: "Carrier rejected / Invalid number", deliveredAt: null },
      { staffId: "DVLA-03012", name: "Mavis Tachie", department: "Administration", station: "Cape Coast Station", phone: "024 XXX 7744", status: "Failed", failureReason: "Network carrier timeout", deliveredAt: null },
      { staffId: "DVLA-03510", name: "Bernice Badu", department: "Finance", station: "Kumasi Regional Office", phone: "020 XXX 4455", status: "Failed", failureReason: "Subscriber phone switched off", deliveredAt: null }
    ]
  },
  {
    id: "SMS-9080",
    date: "02 Sep 2026",
    time: "09:30 AM",
    sender: "Emmanuel Osei",
    senderId: "DVLA-ADMIN",
    message: "Quarterly Performance Appraisal forms are now due. Kindly submit your completed appraisal to HR by end of week.",
    recipientsSummary: "1,245 Staff Members",
    recipientType: "All Staff Broadcast",
    type: "Broadcast",
    status: "Delivered",
    deliveredCount: 1192,
    pendingCount: 0,
    failedCount: 53,
    parts: 1,
    totalUnits: 1245,
    recipientLogs: [
      { staffId: "DVLA-00125", name: "John Mensah", department: "Human Resources", station: "Head Office (Accra)", phone: "024 XXX 1234", status: "Delivered", deliveredAt: "02 Sep 2026 09:30 AM" },
      { staffId: "DVLA-00452", name: "Ama Boateng", department: "Finance", station: "Head Office (Accra)", phone: "020 XXX 5678", status: "Delivered", deliveredAt: "02 Sep 2026 09:30 AM" },
      { staffId: "DVLA-00983", name: "Kwame Asante", department: "Information Technology", station: "Head Office (Accra)", phone: "055 XXX 9012", status: "Delivered", deliveredAt: "02 Sep 2026 09:30 AM" },
      { staffId: "DVLA-03350", name: "Nii Armah Mensah", department: "Information Technology", station: "Head Office (Accra)", phone: "054 XXX 3366", status: "Failed", failureReason: "On leave / Number deactivated", deliveredAt: null },
      { staffId: "DVLA-03688", name: "Francis Gyamfi", department: "Procurement", station: "Head Office (Accra)", phone: "024 XXX 0099", status: "Failed", failureReason: "Carrier network unreachable", deliveredAt: null }
    ]
  },
  {
    id: "SMS-9079",
    date: "01 Sep 2026",
    time: "04:00 PM",
    sender: "Kofi Baah",
    senderId: "DVLA-HR",
    message: "Individual Notice: Your request for casual leave from Sep 5th to Sep 8th has been approved by HR Management.",
    recipientsSummary: "Ama Boateng (DVLA-00452)",
    recipientType: "Individual",
    type: "Individual",
    status: "Delivered",
    deliveredCount: 1,
    pendingCount: 0,
    failedCount: 0,
    parts: 1,
    totalUnits: 1
  },
  {
    id: "SMS-9078",
    date: "01 Sep 2026",
    time: "11:20 AM",
    sender: "Emmanuel Osei",
    senderId: "DVLA-HR",
    message: "Reminder: Mandatory Customer Service Excellence Training session commences tomorrow morning at 09:00 AM at the Auditorium.",
    recipientsSummary: "65 Licensing Supervisors",
    recipientType: "Group (Licensing Supervisors)",
    type: "Group",
    status: "Pending",
    deliveredCount: 44,
    pendingCount: 21,
    failedCount: 0,
    parts: 1,
    totalUnits: 65
  }
];

export const INITIAL_SCHEDULED = [
  {
    id: "SCH-104",
    message: "Public Holiday Notice: DVLA Offices nationwide will be closed on Friday for National Founder's Day.",
    recipientsSummary: "2,486 Staff Members (All Staff)",
    recipientType: "All Staff",
    scheduledDate: "2026-09-05",
    scheduledTime: "09:00 AM",
    senderId: "DVLA-HR",
    createdBy: "Emmanuel Osei",
    status: "Scheduled"
  },
  {
    id: "SCH-103",
    message: "Monthly HR Orientation for new contract staff joining in September. Meet at Room 302, Head Office.",
    recipientsSummary: "18 Contract Staff Members",
    recipientType: "Group (Contract Staff)",
    scheduledDate: "2026-09-08",
    scheduledTime: "10:30 AM",
    senderId: "DVLA-HR",
    createdBy: "Grace Addo",
    status: "Scheduled"
  }
];

export const DELIVERY_STATS = {
  totalStaff: 0,
  smsSentToday: 0,
  deliveredToday: 0,
  failedToday: 0,
  pendingToday: 0,
  monthlySent: 0,
  deliveryRate: 100,
  dailyVolume: [],
  failureReasons: []
};
