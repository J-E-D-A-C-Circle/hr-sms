-- =========================================================================
-- DVLA HR SMS SYSTEM — SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT
-- Copy and paste this script directly into the Supabase SQL Editor
-- (https://supabase.com/dashboard/project/_/sql)
-- =========================================================================

-- 1. Create Staff Directory Table
CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY, -- e.g. 'DVLA-00125'
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    position TEXT NOT NULL,
    region TEXT NOT NULL,
    station TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    employment_type TEXT NOT NULL DEFAULT 'Permanent Staff',
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Staff Groups Table
CREATE TABLE IF NOT EXISTS public.staff_groups (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- Department, Location, Employment Category
    description TEXT,
    count INTEGER DEFAULT 0,
    created_date TEXT,
    last_updated TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Message Templates Table
CREATE TABLE IF NOT EXISTS public.message_templates (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    message TEXT NOT NULL,
    created_by TEXT,
    last_modified TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create SMS History & Dispatch Table
CREATE TABLE IF NOT EXISTS public.sms_history (
    id TEXT PRIMARY KEY, -- e.g. 'SMS-9083'
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    sender TEXT NOT NULL,
    sender_id TEXT NOT NULL DEFAULT 'DVLA-HR',
    message TEXT NOT NULL,
    recipients_summary TEXT NOT NULL,
    recipient_type TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Delivered',
    delivered_count INTEGER DEFAULT 0,
    pending_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    parts INTEGER DEFAULT 1,
    total_units INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Scheduled Messages Queue
CREATE TABLE IF NOT EXISTS public.scheduled_sms (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    message TEXT NOT NULL,
    recipients_summary TEXT NOT NULL,
    recipient_type TEXT NOT NULL,
    scheduled_date TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    sender_id TEXT NOT NULL DEFAULT 'DVLA-HR',
    created_by TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create mNotify Configuration Table
CREATE TABLE IF NOT EXISTS public.mnotify_config (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    provider_name TEXT NOT NULL DEFAULT 'mNotify Ghana Enterprise API Gateway (v3)',
    api_key TEXT NOT NULL DEFAULT 'mn_live_9f82d7a31b4e05c829d1045e',
    sender_id TEXT NOT NULL DEFAULT 'DVLA-HR',
    credit_balance INTEGER NOT NULL DEFAULT 45280,
    sms_rate_ghc NUMERIC(5,3) NOT NULL DEFAULT 0.035,
    status TEXT NOT NULL DEFAULT 'Connected & Active',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create System Users Management Table
CREATE TABLE IF NOT EXISTS public.system_users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'HR Officer',
    department TEXT NOT NULL DEFAULT 'Human Resources',
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) & Public Access Policies for API
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_sms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mnotify_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read staff" ON public.staff;
DROP POLICY IF EXISTS "Allow public insert staff" ON public.staff;
DROP POLICY IF EXISTS "Allow public update staff" ON public.staff;
CREATE POLICY "Allow public read staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Allow public insert staff" ON public.staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update staff" ON public.staff FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read groups" ON public.staff_groups;
DROP POLICY IF EXISTS "Allow public insert groups" ON public.staff_groups;
CREATE POLICY "Allow public read groups" ON public.staff_groups FOR SELECT USING (true);
CREATE POLICY "Allow public insert groups" ON public.staff_groups FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read templates" ON public.message_templates;
DROP POLICY IF EXISTS "Allow public insert templates" ON public.message_templates;
CREATE POLICY "Allow public read templates" ON public.message_templates FOR SELECT USING (true);
CREATE POLICY "Allow public insert templates" ON public.message_templates FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read history" ON public.sms_history;
DROP POLICY IF EXISTS "Allow public insert history" ON public.sms_history;
CREATE POLICY "Allow public read history" ON public.sms_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert history" ON public.sms_history FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read scheduled" ON public.scheduled_sms;
DROP POLICY IF EXISTS "Allow public insert scheduled" ON public.scheduled_sms;
CREATE POLICY "Allow public read scheduled" ON public.scheduled_sms FOR SELECT USING (true);
CREATE POLICY "Allow public insert scheduled" ON public.scheduled_sms FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read mnotify" ON public.mnotify_config;
DROP POLICY IF EXISTS "Allow public update mnotify" ON public.mnotify_config;
CREATE POLICY "Allow public read mnotify" ON public.mnotify_config FOR SELECT USING (true);
CREATE POLICY "Allow public update mnotify" ON public.mnotify_config FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public read users" ON public.system_users;
DROP POLICY IF EXISTS "Allow public insert users" ON public.system_users;
DROP POLICY IF EXISTS "Allow public update users" ON public.system_users;
CREATE POLICY "Allow public read users" ON public.system_users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.system_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.system_users FOR UPDATE USING (true);

-- Insert Default mNotify Config row
INSERT INTO public.mnotify_config (id, provider_name, api_key, sender_id, credit_balance, sms_rate_ghc, status)
VALUES (1, 'mNotify Ghana Enterprise API Gateway (v3)', 'mn_live_9f82d7a31b4e05c829d1045e', 'DVLA-HR', 45280, 0.035, 'Connected & Active')
ON CONFLICT (id) DO NOTHING;

-- Seed System Users
INSERT INTO public.system_users (id, name, email, role, department, status) VALUES
('usr-101', 'Emmanuel Osei', 'e.osei@dvla.gov.gh', 'HR Administrator', 'Human Resources', 'Active'),
('usr-102', 'Grace Addo', 'g.addo@dvla.gov.gh', 'HR Officer', 'Human Resources', 'Active'),
('usr-103', 'Kwame Asante', 'k.asante@dvla.gov.gh', 'Comm Officer', 'Information Technology', 'Active')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial DVLA Staff Members
INSERT INTO public.staff (id, name, department, position, region, station, phone, email, employment_type, status) VALUES
('DVLA-00125', 'John Mensah', 'Human Resources', 'HR Director', 'Greater Accra', 'Head Office (14th Ave, Accra)', '024 XXX 1234', 'j.mensah@dvla.gov.gh', 'Management', 'Active'),
('DVLA-00452', 'Ama Boateng', 'Finance', 'Senior Accountant', 'Greater Accra', 'Head Office (14th Ave, Accra)', '020 XXX 5678', 'a.boateng@dvla.gov.gh', 'Permanent Staff', 'Active'),
('DVLA-00983', 'Kwame Asante', 'Information Technology', 'Head of IT Systems', 'Greater Accra', 'Head Office (14th Ave, Accra)', '055 XXX 9012', 'k.asante@dvla.gov.gh', 'Management', 'Active'),
('DVLA-01104', 'Kofi Annan Baah', 'Operations', 'Licensing Officer', 'Greater Accra', '37 Driver & Vehicle Licensing Center', '024 XXX 3344', 'k.baah@dvla.gov.gh', 'Officers', 'Active'),
('DVLA-01290', 'Abena Owusu-Ansah', 'Administration', 'Administrative Officer', 'Greater Accra', 'Tema Station', '027 XXX 8890', 'a.owusu@dvla.gov.gh', 'Permanent Staff', 'Active'),
('DVLA-01455', 'Kwesi Appiah', 'Operations', 'Vehicle Inspection Supervisor', 'Ashanti', 'Kumasi Regional Office (Asokwa)', '020 XXX 7711', 'k.appiah@dvla.gov.gh', 'Supervisors', 'Active'),
('DVLA-01622', 'Efua Kyei', 'Legal', 'Legal Counsel', 'Greater Accra', 'Head Office (14th Ave, Accra)', '054 XXX 4422', 'e.kyei@dvla.gov.gh', 'Permanent Staff', 'Active'),
('DVLA-01890', 'Yaw Ofori', 'Procurement', 'Procurement Manager', 'Greater Accra', 'Head Office (14th Ave, Accra)', '026 XXX 1155', 'y.ofori@dvla.gov.gh', 'Management', 'Active'),
('DVLA-02031', 'Akua Donkor', 'Human Resources', 'Training Coordinator', 'Greater Accra', 'Head Office (14th Ave, Accra)', '024 XXX 6677', 'a.donkor@dvla.gov.gh', 'Officers', 'Active'),
('DVLA-02219', 'Kojo Kyei-Baffour', 'Information Technology', 'Network Administrator', 'Greater Accra', 'Head Office (14th Ave, Accra)', '050 XXX 9988', 'k.baffour@dvla.gov.gh', 'Permanent Staff', 'Active'),
('DVLA-02380', 'Grace Addo', 'Human Resources', 'HR Officer', 'Greater Accra', 'Head Office (14th Ave, Accra)', '024 XXX 4433', 'g.addo@dvla.gov.gh', 'Officers', 'Active'),
('DVLA-02401', 'Emmanuel Osei', 'Human Resources', 'Chief HR Officer', 'Greater Accra', 'Head Office (14th Ave, Accra)', '024 XXX 1100', 'e.osei@dvla.gov.gh', 'Management', 'Active')
ON CONFLICT (id) DO NOTHING;
