"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";
import { DEPARTMENTS, REGIONS, STATIONS, EMPLOYMENT_CATEGORIES } from "@/lib/mockData";

export default function StaffDirectoryView() {
  const { staff, history, navigateToSendSmsWithDraft, selectedRole, addStaffMember, updateStaffMember } = useApp();

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [selectedEmployment, setSelectedEmployment] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Selected staff profile drawer state
  const [activeProfile, setActiveProfile] = useState(null);

  // Add Staff Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    id: `DVLA-0${Math.floor(3500 + Math.random() * 1000)}`,
    name: "",
    department: DEPARTMENTS[0],
    position: "",
    region: REGIONS[0],
    station: STATIONS[0],
    phone: "",
    email: "",
    employmentType: EMPLOYMENT_CATEGORIES[0],
    status: "Active"
  });

  // Edit Staff Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter staff list
  const filteredStaff = staff.filter((member) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      member.name.toLowerCase().includes(q) ||
      member.id.toLowerCase().includes(q) ||
      member.phone.includes(q) ||
      member.department.toLowerCase().includes(q) ||
      member.station.toLowerCase().includes(q);

    const matchesDept = selectedDept === "ALL" || member.department === selectedDept;
    const matchesRegion = selectedRegion === "ALL" || member.region === selectedRegion;
    const matchesEmployment = selectedEmployment === "ALL" || member.employmentType === selectedEmployment;
    const matchesStatus = selectedStatus === "ALL" || member.status === selectedStatus;

    return matchesSearch && matchesDept && matchesRegion && matchesEmployment && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage) || 1;
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStaffHistory = (staffId) => {
    return history.filter(
      (h) => h.recipientsSummary.includes(staffId) || h.recipientsSummary.includes(activeProfile?.name) || h.type === "Broadcast"
    );
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.phone.trim()) return;

    addStaffMember({
      ...newStaff,
      email: newStaff.email.trim() || `${newStaff.name.toLowerCase().replace(/\s+/g, ".")}@dvla.gov.gh`
    });

    setShowAddModal(false);
    setNewStaff({
      id: `DVLA-0${Math.floor(3500 + Math.random() * 1000)}`,
      name: "",
      department: DEPARTMENTS[0],
      position: "",
      region: REGIONS[0],
      station: STATIONS[0],
      phone: "",
      email: "",
      employmentType: EMPLOYMENT_CATEGORIES[0],
      status: "Active"
    });
  };

  const handleOpenEditModal = (member, e) => {
    if (e) e.stopPropagation();
    setEditingStaff({ ...member });
    setShowEditModal(true);
  };

  const handleEditStaffSubmit = (e) => {
    e.preventDefault();
    if (!editingStaff || !editingStaff.name.trim() || !editingStaff.phone.trim()) return;

    updateStaffMember(editingStaff.id, editingStaff);
    setShowEditModal(false);

    if (activeProfile && activeProfile.id === editingStaff.id) {
      setActiveProfile(editingStaff);
    }
    setEditingStaff(null);
  };

  const isReadOnly = selectedRole === "Viewer";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="Users" className="w-5 h-5 text-[#006B3F]" />
            Staff Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            View, edit, and manage official DVLA staff communication records and phone numbers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold bg-emerald-50 text-[#006B3F] px-3 py-2 rounded-xl border border-emerald-200">
            Showing {filteredStaff.length} of {staff.length} Staff
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            disabled={isReadOnly}
            className="px-4 py-2.5 bg-[#006B3F] hover:bg-[#005432] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Icon name="UserPlus" className="w-4 h-4" />
            + Add Staff Member
          </button>
        </div>
      </div>

      {/* Search & Filters Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Icon name="Search" className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by staff name, ID (e.g. DVLA-00125), department, or phone number..."
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white"
            />
          </div>

          {/* Quick Filter Reset */}
          {(searchQuery || selectedDept !== "ALL" || selectedRegion !== "ALL" || selectedEmployment !== "ALL" || selectedStatus !== "ALL") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDept("ALL");
                setSelectedRegion("ALL");
                setSelectedEmployment("ALL");
                setSelectedStatus("ALL");
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none focus:border-[#006B3F]"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Region</label>
            <select
              value={selectedRegion}
              onChange={(e) => {
                setSelectedRegion(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none focus:border-[#006B3F]"
            >
              <option value="ALL">All Regions</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Employment Type</label>
            <select
              value={selectedEmployment}
              onChange={(e) => {
                setSelectedEmployment(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none focus:border-[#006B3F]"
            >
              <option value="ALL">All Employment Categories</option>
              {EMPLOYMENT_CATEGORIES.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none focus:border-[#006B3F]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Staff ID</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Location / Station</th>
                <th className="py-3.5 px-4">Phone Number</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {paginatedStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Icon name="UserX" className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-700">No staff members found</p>
                    <p className="text-slate-400 text-xs mt-1">Try adjusting your search criteria or resetting filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedStaff.map((member) => (
                  <tr
                    key={member.id}
                    onClick={() => setActiveProfile(member)}
                    className="hover:bg-emerald-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#006B3F] whitespace-nowrap">
                      {member.id}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-[#006B3F] font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div>{member.name}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{member.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                      {member.department}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap max-w-xs truncate">
                      {member.station}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {member.phone}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                          member.status === "Active"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : member.status === "On Leave"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-rose-100 text-rose-800 border-rose-200"
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {!isReadOnly && (
                          <button
                            onClick={(e) => handleOpenEditModal(member, e)}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1"
                            title="Edit staff details"
                          >
                            <Icon name="Edit" className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveProfile(member);
                          }}
                          className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold rounded-lg text-xs transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-medium">
            Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 disabled:opacity-40 hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ADD STAFF MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="UserPlus" className="w-5 h-5 text-[#006B3F]" />
                  Add New DVLA Staff Member
                </h3>
                <p className="text-xs text-slate-500">Register employee details directly into database</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff ID</label>
                  <input
                    type="text"
                    required
                    value={newStaff.id}
                    onChange={(e) => setNewStaff({ ...newStaff, id: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-mono font-bold text-[#006B3F] bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kwadwo Mensah"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Position / Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Licensing Officer"
                    value={newStaff.position}
                    onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Region</label>
                  <select
                    value={newStaff.region}
                    onChange={(e) => setNewStaff({ ...newStaff, region: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r} Region
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Licensing Station</label>
                  <select
                    value={newStaff.station}
                    onChange={(e) => setNewStaff({ ...newStaff, station: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {STATIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number (Ghana SMS)</label>
                  <input
                    type="text"
                    required
                    placeholder="024 XXX 1234"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="k.mensah@dvla.gov.gh"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employment Category</label>
                  <select
                    value={newStaff.employmentType}
                    onChange={(e) => setNewStaff({ ...newStaff, employmentType: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {EMPLOYMENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={newStaff.status}
                    onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Icon name="Check" className="w-4 h-4" />
                  Save & Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF MEMBER MODAL */}
      {showEditModal && editingStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="Edit" className="w-5 h-5 text-amber-600" />
                  Edit Staff Details — {editingStaff.id}
                </h3>
                <p className="text-xs text-slate-500">Update employee details in database</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditStaffSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff ID (Read-only)</label>
                  <input
                    type="text"
                    disabled
                    value={editingStaff.id}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono font-bold text-slate-500 bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={editingStaff.department}
                    onChange={(e) => setEditingStaff({ ...editingStaff, department: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Position / Job Title</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.position}
                    onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Region</label>
                  <select
                    value={editingStaff.region}
                    onChange={(e) => setEditingStaff({ ...editingStaff, region: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r} Region
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Licensing Station</label>
                  <select
                    value={editingStaff.station}
                    onChange={(e) => setEditingStaff({ ...editingStaff, station: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {STATIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number (Ghana SMS)</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employment Category</label>
                  <select
                    value={editingStaff.employmentType}
                    onChange={(e) => setEditingStaff({ ...editingStaff, employmentType: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    {EMPLOYMENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={editingStaff.status}
                    onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Icon name="Check" className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STAFF PROFILE DRAWER / MODAL */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-end">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right duration-300 flex flex-col justify-between">
            <div className="space-y-6">
              {/* Profile Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#006B3F] text-white font-bold text-lg flex items-center justify-center border border-emerald-400 shadow-sm">
                    {activeProfile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{activeProfile.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{activeProfile.id} • {activeProfile.position}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveProfile(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <Icon name="X" className="w-6 h-6" />
                </button>
              </div>

              {/* Action Buttons: Send SMS & Edit Details */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const staffToDispatch = activeProfile;
                    setActiveProfile(null);
                    navigateToSendSmsWithDraft({
                      type: "individual",
                      staffMember: staffToDispatch
                    });
                  }}
                  className="py-3 px-4 bg-[#006B3F] hover:bg-[#005432] text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Icon name="Send" className="w-4 h-4" />
                  Send SMS
                </button>

                {!isReadOnly && (
                  <button
                    onClick={() => handleOpenEditModal(activeProfile)}
                    className="py-3 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Icon name="Edit" className="w-4 h-4 text-amber-600" />
                    Edit Details
                  </button>
                )}
              </div>

              {/* Staff Details Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-2">
                  Staff Information
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block font-medium">Department</span>
                    <span className="font-bold text-slate-800">{activeProfile.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Employment Category</span>
                    <span className="font-bold text-slate-800">{activeProfile.employmentType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Region</span>
                    <span className="font-bold text-slate-800">{activeProfile.region}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Station</span>
                    <span className="font-bold text-slate-800">{activeProfile.station}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Phone Number</span>
                    <span className="font-bold font-mono text-slate-900">{activeProfile.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Official Email</span>
                    <span className="font-medium text-slate-800">{activeProfile.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Account Status</span>
                    <span className="font-semibold text-emerald-700">{activeProfile.status}</span>
                  </div>
                </div>
              </div>

              {/* Communication History Section */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center justify-between">
                  <span>Communication History</span>
                  <span className="text-[10px] text-slate-400 font-normal">Past dispatches</span>
                </h4>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {getStaffHistory(activeProfile.id).length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      No direct messages recorded for this staff member yet.
                    </div>
                  ) : (
                    getStaffHistory(activeProfile.id).map((item) => (
                      <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-500 text-[10px]">
                          <span>{item.date} at {item.time}</span>
                          <span className="font-semibold text-emerald-700">{item.status}</span>
                        </div>
                        <p className="text-slate-900 font-medium line-clamp-2">{item.message}</p>
                        <div className="text-[10px] text-slate-400">Sender: {item.sender} ({item.senderId})</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveProfile(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
