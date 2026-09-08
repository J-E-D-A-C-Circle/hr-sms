"use client";

import React, { useState, useRef } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function SettingsView() {
  const {
    addToast,
    selectedRole,
    setSelectedRole,
    importStaffRecords,
    mnotifyConfig,
    departmentsList,
    regionsList,
    stationsList,
    addDepartment,
    editDepartment,
    deleteDepartment,
    addRegion,
    editRegion,
    deleteRegion,
    addStation,
    editStation,
    deleteStation,
    systemUsers,
    addSystemUser,
    updateSystemUser,
    deleteSystemUser,
    publicRegistrationEnabled,
    togglePublicRegistrationPortal
  } = useApp();

  const [activeTab, setActiveTab] = useState("import");

  // Import State
  const [importedFile, setImportedFile] = useState(null);
  const [parsedRecords, setParsedRecords] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Add/Edit Department State
  const [newDeptInput, setNewDeptInput] = useState("");
  const [editingDeptItem, setEditingDeptItem] = useState(null);
  const [editDeptValue, setEditDeptValue] = useState("");

  // Add/Edit Region State
  const [newRegionInput, setNewRegionInput] = useState("");
  const [editingRegionItem, setEditingRegionItem] = useState(null);
  const [editRegionValue, setEditRegionValue] = useState("");

  // Add/Edit Station State
  const [newStationInput, setNewStationInput] = useState("");
  const [editingStationItem, setEditingStationItem] = useState(null);
  const [editStationValue, setEditStationValue] = useState("");

  // System User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "HR Officer",
    department: "Human Resources",
    status: "Active"
  });
  const [editingUser, setEditingUser] = useState(null);

  // Department Handlers
  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptInput.trim()) return;
    addDepartment(newDeptInput.trim());
    setNewDeptInput("");
  };

  const handleSaveEditDept = (oldName) => {
    if (!editDeptValue.trim()) return;
    editDepartment(oldName, editDeptValue.trim());
    setEditingDeptItem(null);
    setEditDeptValue("");
  };

  // Region Handlers
  const handleAddRegion = (e) => {
    e.preventDefault();
    if (!newRegionInput.trim()) return;
    addRegion(newRegionInput.trim());
    setNewRegionInput("");
  };

  const handleSaveEditRegion = (oldName) => {
    if (!editRegionValue.trim()) return;
    editRegion(oldName, editRegionValue.trim());
    setEditingRegionItem(null);
    setEditRegionValue("");
  };

  // Station Handlers
  const handleAddStation = (e) => {
    e.preventDefault();
    if (!newStationInput.trim()) return;
    addStation(newStationInput.trim());
    setNewStationInput("");
  };

  const handleSaveEditStation = (oldName) => {
    if (!editStationValue.trim()) return;
    editStation(oldName, editStationValue.trim());
    setEditingStationItem(null);
    setEditStationValue("");
  };

  // System User Handlers
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) return;
    addSystemUser(newUser);
    setShowAddUserModal(false);
    setNewUser({
      name: "",
      email: "",
      role: "HR Officer",
      department: "Human Resources",
      status: "Active"
    });
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    if (!editingUser || !editingUser.name.trim() || !editingUser.email.trim()) return;
    updateSystemUser(editingUser.id, editingUser);
    setShowEditUserModal(false);
    setEditingUser(null);
  };

  // Download Sample CSV / Excel Template
  const handleDownloadTemplate = () => {
    const headers = [
      "Staff ID",
      "Full Name",
      "Department",
      "Position",
      "Region",
      "Station",
      "Phone Number",
      "Email",
      "Employment Category",
      "Status"
    ];

    const sampleRows = [
      ["DVLA-03701", "Kwadwo Baah", "Human Resources", "HR Officer", "Greater Accra", "Head Office (14th Ave, Accra)", "024 XXX 9988", "k.baah@dvla.gov.gh", "Permanent Staff", "Active"],
      ["DVLA-03702", "Serwaa Akoto", "Information Technology", "Systems Analyst", "Ashanti", "Kumasi Regional Office (Asokwa)", "020 XXX 1122", "s.akoto@dvla.gov.gh", "Permanent Staff", "Active"],
      ["DVLA-03703", "Kofi Mensah-Bonsu", "Finance", "Accounts Supervisor", "Western", "Takoradi Regional Office", "055 XXX 3344", "k.bonsu@dvla.gov.gh", "Supervisors", "Active"],
      ["DVLA-03704", "Yaa Asantewaa", "Operations", "Licensing Inspector", "Northern", "Tamale Station", "027 XXX 5566", "y.asantewaa@dvla.gov.gh", "Officers", "Active"]
    ];

    const csvContent = [
      headers.join(","),
      ...sampleRows.map((row) => row.map((field) => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "DVLA_Staff_Import_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("DVLA Staff Import Excel/CSV template downloaded.", "success");
  };

  // Handle File Upload and CSV Parsing
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImportedFile(file);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split(/\r\n|\n/).filter((line) => line.trim().length > 0);

        if (lines.length <= 1) {
          addToast("The uploaded file appears to be empty or missing data rows.", "error");
          setIsProcessing(false);
          return;
        }

        const parseCSVLine = (str) => {
          const arr = [];
          let quote = false;
          let col = "";
          for (let c = 0; c < str.length; c++) {
            const char = str[c];
            if (char === '"') {
              quote = !quote;
            } else if (char === "," && !quote) {
              arr.push(col.replace(/^"|"$/g, "").trim());
              col = "";
            } else {
              col += char;
            }
          }
          arr.push(col.replace(/^"|"$/g, "").trim());
          return arr;
        };

        const records = [];
        for (let i = 1; i < lines.length; i++) {
          const currentLine = lines[i].trim();
          if (!currentLine) continue;
          const cleanRow = parseCSVLine(currentLine);

          if (cleanRow.length >= 2) {
            records.push({
              id: cleanRow[0] || `DVLA-${Math.floor(3000 + Math.random() * 1000)}`,
              name: cleanRow[1] || "Unnamed Staff",
              department: cleanRow[2] || "Operations",
              position: cleanRow[3] || "Staff Officer",
              region: cleanRow[4] || "Greater Accra",
              station: cleanRow[5] || "Head Office (14th Ave, Accra)",
              phone: cleanRow[6] || "024 XXX 0000",
              email: cleanRow[7] || "staff@dvla.gov.gh",
              employmentType: cleanRow[8] || "Permanent Staff",
              status: cleanRow[9] || "Active"
            });
          }
        }

        setParsedRecords(records);
        setIsProcessing(false);
        addToast(`Parsed ${records.length} staff record(s) from ${file.name}. Review preview below.`, "success");
      } catch (err) {
        addToast("Error parsing file. Please ensure valid CSV/Excel format.", "error");
        setIsProcessing(false);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSampleImport = () => {
    const samples = [
      { id: "DVLA-04101", name: "Kwabena Adjei", department: "Human Resources", position: "HR Officer", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "024 XXX 8811", email: "k.adjei@dvla.gov.gh", employmentType: "Officers", status: "Active" },
      { id: "DVLA-04102", name: "Akosua Mansah", department: "Information Technology", position: "Software Developer", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "020 XXX 4499", email: "a.mansah@dvla.gov.gh", employmentType: "Permanent Staff", status: "Active" },
      { id: "DVLA-04103", name: "Osei Tutu", department: "Operations", position: "Licensing Examiner", region: "Ashanti", station: "Kumasi Regional Office (Asokwa)", phone: "055 XXX 7722", email: "o.tutu@dvla.gov.gh", employmentType: "Supervisors", status: "Active" },
      { id: "DVLA-04104", name: "Adwoa Safo", department: "Finance", position: "Payroll Accountant", region: "Greater Accra", station: "Head Office (14th Ave, Accra)", phone: "027 XXX 3300", email: "a.safo@dvla.gov.gh", employmentType: "Permanent Staff", status: "Active" },
      { id: "DVLA-04105", name: "Kofi Frimpong", department: "Administration", position: "Logistics Manager", region: "Western", station: "Takoradi Regional Office", phone: "024 XXX 9944", email: "k.frimpong@dvla.gov.gh", employmentType: "Management", status: "Active" }
    ];
    setParsedRecords(samples);
    setImportedFile({ name: "Sample_DVLA_Staff_List.csv" });
    addToast("Sample Excel/CSV staff records loaded into import preview.", "success");
  };

  const handleConfirmImport = () => {
    if (parsedRecords.length === 0) return;
    importStaffRecords(parsedRecords);
    setParsedRecords([]);
    setImportedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isReadOnly = selectedRole === "Viewer";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="Settings" className="w-5 h-5 text-[#006B3F]" />
            System Administration & Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage System Users & Admin Roles, Organization Structures, and Import Staff.
          </p>
        </div>

        {/* mNotify Live Credit Badge */}
        <div className="flex items-center gap-3 bg-emerald-950 text-white p-3 rounded-xl border border-emerald-800 shadow-sm shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#006B3F] text-[#EAB308] flex items-center justify-center font-bold text-xs">
            mN
          </div>
          <div>
            <div className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">mNotify SMS Balance</div>
            <div className="text-sm font-extrabold text-[#EAB308]">
              {mnotifyConfig.creditBalance.toLocaleString()} SMS Credits
            </div>
          </div>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("import")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === "import"
              ? "border-[#006B3F] text-[#006B3F]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Icon name="FileSpreadsheet" className="w-4 h-4" />
          Import Staff (Excel/CSV)
        </button>

        <button
          onClick={() => setActiveTab("org")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === "org"
              ? "border-[#006B3F] text-[#006B3F]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Icon name="Building2" className="w-4 h-4" />
          Organization Structure (Depts, Regions, Stations)
        </button>

        <button
          onClick={() => setActiveTab("portal")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === "portal"
              ? "border-[#006B3F] text-[#006B3F]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Icon name="Globe" className="w-4 h-4" />
          Public Staff Registration Portal
          <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
            publicRegistrationEnabled ? "bg-emerald-100 text-[#006B3F]" : "bg-rose-100 text-rose-700"
          }`}>
            {publicRegistrationEnabled ? "Active" : "Closed"}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 shrink-0 ${
            activeTab === "users"
              ? "border-[#006B3F] text-[#006B3F]"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Icon name="ShieldCheck" className="w-4 h-4" />
          User Management & Roles ({systemUsers.length})
        </button>
      </div>

      {/* TAB: PUBLIC REGISTRATION PORTAL CONTROLS */}
      {activeTab === "portal" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
                  publicRegistrationEnabled
                    ? "bg-emerald-50 text-[#006B3F] border-emerald-200"
                    : "bg-rose-50 text-rose-600 border-rose-200"
                }`}>
                  <Icon name={publicRegistrationEnabled ? "Globe" : "Lock"} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Public Staff Self-Registration Portal
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Allow DVLA staff nationwide to access a public page and submit their official staff records directly into the HR database.
                  </p>
                </div>
              </div>

              {/* Master Enable / Disable Toggle Switch */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 shrink-0">
                <span className="text-xs font-bold text-slate-700">Portal Access Status:</span>
                <button
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => togglePublicRegistrationPortal(!publicRegistrationEnabled)}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none ${
                    publicRegistrationEnabled ? "bg-[#006B3F]" : "bg-slate-300"
                  } ${isReadOnly ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      publicRegistrationEnabled ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg ${
                  publicRegistrationEnabled
                    ? "bg-emerald-100 text-[#006B3F]"
                    : "bg-rose-100 text-rose-700"
                }`}>
                  {publicRegistrationEnabled ? "ENABLED" : "DISABLED"}
                </span>
              </div>
            </div>

            {/* Portal Link Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Public Shareable Portal URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={typeof window !== "undefined" ? `${window.location.origin}/register` : "http://localhost:3000/register"}
                    className="w-full p-3 text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-800 shadow-inner select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const url = typeof window !== "undefined" ? `${window.location.origin}/register` : "http://localhost:3000/register";
                      navigator.clipboard.writeText(url);
                      addToast("Public Registration Portal URL copied to clipboard!", "success");
                    }}
                    className="px-4 py-3 bg-[#006B3F] hover:bg-[#005432] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Icon name="Copy" className="w-4 h-4" />
                    Copy Link
                  </button>
                  <a
                    href="/register"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shrink-0 transition-colors border border-slate-300"
                  >
                    <Icon name="ExternalLink" className="w-4 h-4" />
                    Preview Portal
                  </a>
                </div>
                <p className="text-xs text-slate-500">
                  Share this link via SMS or email to staff members when data collection is active.
                </p>
              </div>

              {/* Status Info Card */}
              <div className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                publicRegistrationEnabled
                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-900"
                  : "bg-amber-50/60 border-amber-200 text-amber-900"
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  <Icon name={publicRegistrationEnabled ? "CheckCircle" : "AlertTriangle"} className="w-4 h-4" />
                  {publicRegistrationEnabled ? "Portal is Live & Receiving Data" : "Portal Access Restricted"}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {publicRegistrationEnabled
                    ? "Any staff member with the link can submit their details. Records will automatically register in the Staff Directory."
                    : "Public visitors attempting to access /register will see an official DVLA 'Registration Closed' maintenance page."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: EXCEL / CSV STAFF IMPORT & TEMPLATE DOWNLOAD */}
      {activeTab === "import" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Download Template Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#006B3F] flex items-center justify-center border border-emerald-200">
                    <Icon name="Download" className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">1. Download Excel Template</h3>
                    <p className="text-xs text-slate-500">Official DVLA staff data format</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  Download the pre-formatted Excel / CSV template containing standard column headers (Staff ID, Full Name, Department, Station, Phone Number, etc.).
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Format: .CSV / .XLSX</span>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="px-4 py-2.5 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all"
                >
                  <Icon name="Download" className="w-4 h-4" />
                  Download Excel Template
                </button>
              </div>
            </div>

            {/* Import Excel / CSV Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
                    <Icon name="UploadCloud" className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">2. Import Staff Records</h3>
                    <p className="text-xs text-slate-500">Upload completed Excel or CSV file</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pt-2">
                  Upload your populated staff spreadsheet to automatically register new employees in the Staff Directory.
                </p>
              </div>

              {/* Upload Drop Area */}
              <div className="space-y-3 pt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv, .xlsx, .xls, .txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-staff-file"
                />

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="excel-staff-file"
                    className="flex-1 p-3 border-2 border-dashed border-slate-300 hover:border-[#006B3F] rounded-xl text-center cursor-pointer transition-colors bg-slate-50 hover:bg-emerald-50/50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2"
                  >
                    <Icon name="FileSpreadsheet" className="w-4 h-4 text-[#006B3F]" />
                    {importedFile ? importedFile.name : "Choose Excel / CSV File to Import..."}
                  </label>

                  <button
                    type="button"
                    onClick={handleLoadSampleImport}
                    className="px-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold shrink-0 border border-slate-200"
                    title="Load sample staff data for quick testing"
                  >
                    Load Sample
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PARSED RECORDS IMPORT PREVIEW TABLE */}
          {parsedRecords.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Icon name="CheckCircle" className="w-5 h-5 text-[#006B3F]" />
                    Import Preview — {parsedRecords.length} Staff Members Ready
                  </h3>
                  <p className="text-xs text-slate-500">Review the records below before finalizing import into the Directory</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setParsedRecords([])}
                    className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200"
                  >
                    Clear Preview
                  </button>
                  <button
                    type="button"
                    disabled={isReadOnly}
                    onClick={handleConfirmImport}
                    className="px-5 py-2.5 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
                  >
                    <Icon name="UserPlus" className="w-4 h-4" />
                    Confirm & Populate Directory ({parsedRecords.length})
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Staff ID</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Department</th>
                      <th className="py-3 px-4">Station / Location</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {parsedRecords.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-[#006B3F]">{r.id}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{r.name}</td>
                        <td className="py-3 px-4">{r.department}</td>
                        <td className="py-3 px-4">{r.station}</td>
                        <td className="py-3 px-4 font-mono">{r.phone}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ORGANIZATION STRUCTURE (DYNAMIC DEPARTMENTS, REGIONS, STATIONS) */}
      {activeTab === "org" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CARD 1: DEPARTMENTS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Icon name="Building2" className="w-4 h-4 text-[#006B3F]" />
                  DVLA Departments ({departmentsList.length})
                </h3>
                <p className="text-[11px] text-slate-400">Add & edit organizational departments</p>
              </div>
            </div>

            {/* Add Department Form */}
            <form onSubmit={handleAddDept} className="flex gap-2">
              <input
                type="text"
                value={newDeptInput}
                onChange={(e) => setNewDeptInput(e.target.value)}
                placeholder="New department name..."
                className="flex-1 p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#006B3F]"
              />
              <button
                type="submit"
                disabled={isReadOnly || !newDeptInput.trim()}
                className="px-3 py-2 bg-[#006B3F] hover:bg-[#005432] text-white rounded-lg text-xs font-bold shrink-0 disabled:opacity-50"
              >
                + Add
              </button>
            </form>

            {/* Departments List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {departmentsList.map((dept, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200 transition-all flex items-center justify-between text-xs group"
                >
                  {editingDeptItem === dept ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editDeptValue}
                        onChange={(e) => setEditDeptValue(e.target.value)}
                        className="flex-1 p-1 border border-slate-300 rounded bg-white font-bold"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditDept(dept)}
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingDeptItem(null)}
                        className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-800">{dept}</span>
                      {!isReadOnly && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingDeptItem(dept);
                              setEditDeptValue(dept);
                            }}
                            className="p-1 hover:bg-white text-slate-600 rounded border border-transparent hover:border-slate-300"
                            title="Edit department name"
                          >
                            <Icon name="Edit" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteDepartment(dept)}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded border border-transparent hover:border-rose-200"
                            title="Delete department"
                          >
                            <Icon name="Trash2" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CARD 2: ADMINISTRATIVE REGIONS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Icon name="MapPin" className="w-4 h-4 text-[#006B3F]" />
                  Administrative Regions ({regionsList.length})
                </h3>
                <p className="text-[11px] text-slate-400">Add & edit regional administrative zones</p>
              </div>
            </div>

            {/* Add Region Form */}
            <form onSubmit={handleAddRegion} className="flex gap-2">
              <input
                type="text"
                value={newRegionInput}
                onChange={(e) => setNewRegionInput(e.target.value)}
                placeholder="New region name..."
                className="flex-1 p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#006B3F]"
              />
              <button
                type="submit"
                disabled={isReadOnly || !newRegionInput.trim()}
                className="px-3 py-2 bg-[#006B3F] hover:bg-[#005432] text-white rounded-lg text-xs font-bold shrink-0 disabled:opacity-50"
              >
                + Add
              </button>
            </form>

            {/* Regions List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {regionsList.map((region, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200 transition-all flex items-center justify-between text-xs group"
                >
                  {editingRegionItem === region ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editRegionValue}
                        onChange={(e) => setEditRegionValue(e.target.value)}
                        className="flex-1 p-1 border border-slate-300 rounded bg-white font-bold"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditRegion(region)}
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingRegionItem(null)}
                        className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-800">{region} Region</span>
                      {!isReadOnly && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRegionItem(region);
                              setEditRegionValue(region);
                            }}
                            className="p-1 hover:bg-white text-slate-600 rounded border border-transparent hover:border-slate-300"
                            title="Edit region name"
                          >
                            <Icon name="Edit" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteRegion(region)}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded border border-transparent hover:border-rose-200"
                            title="Delete region"
                          >
                            <Icon name="Trash2" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CARD 3: LICENSING STATIONS */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Icon name="Building" className="w-4 h-4 text-[#006B3F]" />
                  Licensing Stations ({stationsList.length})
                </h3>
                <p className="text-[11px] text-slate-400">Add & edit station offices nationwide</p>
              </div>
            </div>

            {/* Add Station Form */}
            <form onSubmit={handleAddStation} className="flex gap-2">
              <input
                type="text"
                value={newStationInput}
                onChange={(e) => setNewStationInput(e.target.value)}
                placeholder="New station location..."
                className="flex-1 p-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-[#006B3F]"
              />
              <button
                type="submit"
                disabled={isReadOnly || !newStationInput.trim()}
                className="px-3 py-2 bg-[#006B3F] hover:bg-[#005432] text-white rounded-lg text-xs font-bold shrink-0 disabled:opacity-50"
              >
                + Add
              </button>
            </form>

            {/* Stations List */}
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {stationsList.map((station, i) => (
                <div
                  key={i}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200 transition-all flex items-center justify-between text-xs group"
                >
                  {editingStationItem === station ? (
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="text"
                        value={editStationValue}
                        onChange={(e) => setEditStationValue(e.target.value)}
                        className="flex-1 p-1 border border-slate-300 rounded bg-white font-bold"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveEditStation(station)}
                        className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingStationItem(null)}
                        className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-800 line-clamp-1 flex-1 pr-2">{station}</span>
                      {!isReadOnly && (
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStationItem(station);
                              setEditStationValue(station);
                            }}
                            className="p-1 hover:bg-white text-slate-600 rounded border border-transparent hover:border-slate-300"
                            title="Edit station location"
                          >
                            <Icon name="Edit" className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteStation(station)}
                            className="p-1 hover:bg-rose-50 text-rose-600 rounded border border-transparent hover:border-rose-200"
                            title="Delete station"
                          >
                            <Icon name="Trash2" className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT & ROLES */}
      {activeTab === "users" && (
        <div className="space-y-6">
          {/* SYSTEM USERS MANAGEMENT DIRECTORY CARD */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="ShieldCheck" className="w-5 h-5 text-[#006B3F]" />
                  System Administrators & Managing Officers ({systemUsers.length})
                </h3>
                <p className="text-xs text-slate-500">Register and manage administrative accounts for the SMS platform</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isReadOnly}
                  onClick={() => setShowAddUserModal(true)}
                  className="px-4 py-2 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Icon name="UserPlus" className="w-4 h-4" />
                  + Add System User
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Officer Name</th>
                    <th className="py-3 px-4">Official Email</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {systemUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#006B3F] font-bold text-[10px] flex items-center justify-center">
                            {u.name.charAt(0)}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[#006B3F] font-bold text-xs border border-emerald-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{u.department}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isReadOnly && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingUser({ ...u });
                                setShowEditUserModal(true);
                              }}
                              className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold rounded-lg border border-amber-200 text-[11px] flex items-center gap-1"
                            >
                              <Icon name="Edit" className="w-3 h-3" />
                              Edit Role
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteSystemUser(u.id)}
                              className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-lg border border-rose-200 text-[11px] flex items-center gap-1"
                            >
                              <Icon name="Trash2" className="w-3 h-3" />
                              Remove
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RBAC MATRIX TABLE */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
                <p className="text-xs text-slate-500">Privileges matrix for DVLA HR officers and system administrators</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Test Active Preview Role:</span>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-3 py-1 bg-[#006B3F] text-white font-bold text-xs rounded-lg focus:outline-none"
                >
                  <option value="HR Administrator">HR Administrator</option>
                  <option value="HR Officer">HR Officer</option>
                  <option value="Comm Officer">Comm Officer</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Permission / Action</th>
                    <th className="py-3 px-4 text-center">HR Administrator</th>
                    <th className="py-3 px-4 text-center">HR Officer</th>
                    <th className="py-3 px-4 text-center">Comm Officer</th>
                    <th className="py-3 px-4 text-center">Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                  {[
                    { perm: "Send Individual / Group SMS", admin: true, officer: true, comm: true, viewer: false },
                    { perm: "Broadcast SMS to All Staff", admin: true, officer: false, comm: false, viewer: false },
                    { perm: "Manage Staff Directory Records", admin: true, officer: true, comm: false, viewer: false },
                    { perm: "Create & Edit Staff Groups", admin: true, officer: true, comm: false, viewer: false },
                    { perm: "Manage Message Templates", admin: true, officer: true, comm: true, viewer: false },
                    { perm: "View Delivery Analytics & Reports", admin: true, officer: true, comm: true, viewer: true },
                    { perm: "Manage System Settings & Users", admin: true, officer: false, comm: false, viewer: false }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.perm}</td>
                      <td className="py-3 px-4 text-center">
                        {row.admin ? <span className="text-emerald-700 font-bold">✓ Full</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.officer ? <span className="text-emerald-700 font-bold">✓ Allowed</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.comm ? <span className="text-emerald-700 font-bold">✓ Approved Only</span> : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {row.viewer ? <span className="text-emerald-700 font-bold">✓ Read-Only</span> : <span className="text-rose-500 font-bold">✕ Denied</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD SYSTEM USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="UserPlus" className="w-5 h-5 text-[#006B3F]" />
                  Add New System Administrator / User
                </h3>
                <p className="text-xs text-slate-500">Register administrative account and assign platform permissions</p>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Officer Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel Mensah"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="s.mensah@dvla.gov.gh"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assign System Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-bold text-slate-900"
                  >
                    <option value="HR Administrator">HR Administrator (Full Access)</option>
                    <option value="HR Officer">HR Officer</option>
                    <option value="Comm Officer">Comm Officer</option>
                    <option value="Viewer">Viewer (Read Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newUser.department}
                    onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {departmentsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Icon name="Check" className="w-4 h-4" />
                  Create System User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT SYSTEM USER MODAL */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="Edit" className="w-5 h-5 text-amber-600" />
                  Edit System User Role — {editingUser.name}
                </h3>
                <p className="text-xs text-slate-500">Update account role assignment and privileges</p>
              </div>
              <button
                onClick={() => setShowEditUserModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Officer Full Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-bold text-slate-900"
                  >
                    <option value="HR Administrator">HR Administrator (Full Access)</option>
                    <option value="HR Officer">HR Officer</option>
                    <option value="Comm Officer">Comm Officer</option>
                    <option value="Viewer">Viewer (Read Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={editingUser.department}
                    onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {departmentsList.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Icon name="Check" className="w-4 h-4" />
                  Save User Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
