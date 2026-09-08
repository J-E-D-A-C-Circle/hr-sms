"use client";

import React, { useState, useEffect } from "react";
import Icon from "@/components/ui/Icons";
import {
  DEPARTMENTS,
  REGIONS,
  STATIONS,
  EMPLOYMENT_CATEGORIES
} from "@/lib/mockData";

export default function PublicStaffRegisterPage() {
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    department: DEPARTMENTS[0] || "Human Resources",
    position: "",
    region: REGIONS[0] || "Greater Accra",
    station: STATIONS[0] || "Head Office (14th Ave, Accra)",
    phone: "",
    email: "",
    employmentType: EMPLOYMENT_CATEGORIES[0] || "Permanent Staff",
    status: "Active"
  });

  const [registeredData, setRegisteredData] = useState<any>(null);

  // Fetch portal enabled/disabled status on load
  useEffect(() => {
    fetch("/api/system/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.publicRegistrationEnabled !== undefined) {
          setPortalEnabled(data.publicRegistrationEnabled);
        }
      })
      .catch((err) => console.log("Status fetch error:", err))
      .finally(() => setLoadingStatus(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.id.trim()) {
      setErrorMessage("Please enter your official Staff ID (e.g. DVLA-01234).");
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your Full Name.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please enter your mobile Phone Number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/public/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        setErrorMessage(result.error || "Failed to submit registration. Please try again.");
      } else {
        setRegisteredData(result.staff || formData);
        setSubmitted(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingStatus) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="flex items-center gap-3 text-[#006B3F] font-bold text-sm">
          <Icon name="RefreshCw" className="w-6 h-6 animate-spin" />
          <span>Loading DVLA HR Portal...</span>
        </div>
      </div>
    );
  }

  // DISABLED PORTAL VIEW
  if (!portalEnabled) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300">
            <Icon name="Lock" className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-block px-3 py-1 bg-[#006B3F] text-white text-[10px] font-bold tracking-wider uppercase rounded-full mb-3">
              Driver & Vehicle Licensing Authority
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Staff Registration Closed
            </h1>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              The public staff data collection portal is currently <strong>disabled</strong> or under administrative review by the DVLA HR Directorate.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2 text-slate-600">
            <div className="font-bold text-slate-800 border-b border-slate-200 pb-1 flex items-center gap-1.5">
              <Icon name="Info" className="w-4 h-4 text-[#006B3F]" />
              Need Assistance?
            </div>
            <p>If you need to submit or update your staff records, please contact your Station HR Officer or the main Directorate.</p>
            <div className="font-mono text-[11px] text-[#006B3F] pt-1 font-semibold">
              Email: hr@dvla.gov.gh
            </div>
          </div>

          <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-4">
            © {new Date().getFullYear()} Driver and Vehicle Licensing Authority (DVLA) • All Rights Reserved
          </div>
        </div>
      </div>
    );
  }

  // SUBMITTED SUCCESS VIEW
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-8 space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#006B3F] flex items-center justify-center mx-auto border border-emerald-300">
              <Icon name="CheckCircle" className="w-9 h-9" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Registration Received!
            </h1>
            <p className="text-xs text-slate-600">
              Your staff details have been registered into the official DVLA HR Staff Database.
            </p>
          </div>

          {/* Submission Summary Breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs space-y-2.5">
            <div className="font-bold text-[#006B3F] border-b border-slate-200 pb-1 flex justify-between">
              <span>STAFF ID:</span>
              <span className="font-mono text-slate-900">{registeredData?.id}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Full Name:</span>
              <span className="font-semibold text-slate-900">{registeredData?.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Department:</span>
              <span className="font-semibold text-slate-900">{registeredData?.department}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Position:</span>
              <span className="font-semibold text-slate-900">{registeredData?.position}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Station / Location:</span>
              <span className="font-semibold text-slate-900">{registeredData?.station}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1">
              <span className="text-slate-500">Mobile Phone:</span>
              <span className="font-mono text-slate-900">{registeredData?.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-emerald-700">{registeredData?.status || "Active"}</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  id: "",
                  name: "",
                  department: DEPARTMENTS[0] || "Human Resources",
                  position: "",
                  region: REGIONS[0] || "Greater Accra",
                  station: STATIONS[0] || "Head Office (14th Ave, Accra)",
                  phone: "",
                  email: "",
                  employmentType: EMPLOYMENT_CATEGORIES[0] || "Permanent Staff",
                  status: "Active"
                });
              }}
              className="w-full py-3 bg-[#006B3F] hover:bg-[#005432] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Icon name="PlusCircle" className="w-4 h-4" />
              Register Another Staff Member
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PUBLIC FORM VIEW
  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Branding Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/oop.png" alt="DVLA Logo" className="w-14 h-14 rounded-full object-contain bg-white p-0.5 border border-[#D4A017] shadow-md shrink-0" />
            <div>
              <div className="text-[10px] font-bold text-[#D4A017] uppercase tracking-wider">
                Official HR Portal
              </div>
              <h1 className="text-lg font-extrabold text-slate-900">
                Staff Data Collection Form
              </h1>
              <p className="text-xs text-slate-500">
                Driver and Vehicle Licensing Authority • Human Resources Directorate
              </p>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 text-[#006B3F] border border-emerald-200 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1.5">
            <Icon name="ShieldCheck" className="w-4 h-4" />
            Verified Portal
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Icon name="UserCheck" className="w-4 h-4 text-[#006B3F]" />
              Official Staff Information Submission
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Please complete all mandatory fields accurately to update your HR record.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2 font-medium animate-in fade-in">
              <Icon name="AlertCircle" className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Grid Row 1: Staff ID & Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Staff ID Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="id"
                  required
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="e.g. DVLA-01234"
                  className="w-full p-3 text-xs font-mono font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white uppercase placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Mensah"
                  className="w-full p-3 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Grid Row 2: Department & Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Department <span className="text-rose-600">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-3 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white text-slate-800"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Position / Designation <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  placeholder="e.g. HR Officer / Licensing Officer"
                  className="w-full p-3 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Grid Row 3: Region & Station */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Region <span className="text-rose-600">*</span>
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full p-3 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white text-slate-800"
                >
                  {REGIONS.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Station / Operational Center <span className="text-rose-600">*</span>
                </label>
                <select
                  name="station"
                  value={formData.station}
                  onChange={handleChange}
                  className="w-full p-3 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white text-slate-800"
                >
                  {STATIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid Row 4: Phone Number & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Phone Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 024XXXXXXX or 050XXXXXXX"
                  className="w-full p-3 text-xs font-mono font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. j.mensah@dvla.gov.gh"
                  className="w-full p-3 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Grid Row 5: Employment Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Employment Category <span className="text-rose-600">*</span>
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full p-3 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white text-slate-800"
                >
                  {EMPLOYMENT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Staff Status <span className="text-rose-600">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 text-xs font-semibold border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white text-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Seconded">Seconded</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#006B3F] hover:bg-[#005432] text-white text-sm font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Icon name={isSubmitting ? "RefreshCw" : "Send"} className={`w-5 h-5 ${isSubmitting ? "animate-spin" : ""}`} />
                {isSubmitting ? "Submitting Registration..." : "Submit Staff Data Record"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} Driver and Vehicle Licensing Authority (DVLA) • Ghana</p>
          <p className="text-[11px] text-slate-400 font-mono">Official HR Data Collection & SMS Communications Platform</p>
        </div>
      </div>
    </div>
  );
}
