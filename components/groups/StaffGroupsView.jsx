"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function StaffGroupsView() {
  const { groups, staff, createGroup, updateGroup, navigateToSendSmsWithDraft, selectedRole } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);

  // Group Details Member Manage State
  const [manageTab, setManageTab] = useState("members"); // "members" | "add"
  const [groupMemberSearch, setGroupMemberSearch] = useState("");

  // New Group Form State
  const [groupName, setGroupName] = useState("");
  const [groupCategory, setGroupCategory] = useState("Department");
  const [groupDesc, setGroupDesc] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [staffSearch, setStaffSearch] = useState("");

  const isReadOnly = selectedRole === "Viewer";

  const getGroupMemberIds = (group) => {
    if (!group) return [];
    if (group.members && Array.isArray(group.members) && group.members.length > 0) {
      return group.members;
    }
    // Fallback resolution by category if members array is empty
    if (group.category === "Department") {
      return staff.filter((s) => s.department === group.name).map((s) => s.id);
    }
    if (group.category === "Location") {
      return staff.filter((s) => s.region === group.name || (s.station && s.station.includes(group.name))).map((s) => s.id);
    }
    if (group.category === "Employment Category") {
      return staff.filter((s) => s.employmentType === group.name).map((s) => s.id);
    }
    return [];
  };

  const handleAddMemberToGroup = (staffId) => {
    if (!selectedGroupDetails || isReadOnly) return;
    const currentMemberIds = getGroupMemberIds(selectedGroupDetails);
    if (currentMemberIds.includes(staffId)) return;

    const updatedMemberIds = [...currentMemberIds, staffId];
    const updatedGroup = {
      ...selectedGroupDetails,
      members: updatedMemberIds,
      count: updatedMemberIds.length
    };

    setSelectedGroupDetails(updatedGroup);
    updateGroup(selectedGroupDetails.id, updatedGroup);
  };

  const handleRemoveMemberFromGroup = (staffId) => {
    if (!selectedGroupDetails || isReadOnly) return;
    const currentMemberIds = getGroupMemberIds(selectedGroupDetails);
    const updatedMemberIds = currentMemberIds.filter((id) => id !== staffId);
    const updatedGroup = {
      ...selectedGroupDetails,
      members: updatedMemberIds,
      count: updatedMemberIds.length
    };

    setSelectedGroupDetails(updatedGroup);
    updateGroup(selectedGroupDetails.id, updatedGroup);
  };

  const filteredStaffForCreate = staff.filter((s) => {
    const q = staffSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  const toggleMemberPick = (id) => {
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((m) => m !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    createGroup({
      name: groupName,
      category: groupCategory,
      description: groupDesc || "Custom staff group created for HR communications.",
      count: selectedMemberIds.length,
      members: selectedMemberIds
    });

    setShowCreateModal(false);
    setGroupName("");
    setGroupDesc("");
    setSelectedMemberIds([]);
  };

  // Group Details Members & Non-members calculation
  const currentDetailsMemberIds = selectedGroupDetails ? getGroupMemberIds(selectedGroupDetails) : [];
  
  const currentMembersList = staff.filter((s) => currentDetailsMemberIds.includes(s.id));
  const filteredCurrentMembers = currentMembersList.filter((s) => {
    const q = groupMemberSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q) ||
      (s.station && s.station.toLowerCase().includes(q))
    );
  });

  const availableStaffToAdd = staff.filter((s) => !currentDetailsMemberIds.includes(s.id));
  const filteredAvailableStaff = availableStaffToAdd.filter((s) => {
    const q = groupMemberSearch.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="FolderUsers" className="w-5 h-5 text-[#006B3F]" />
            Staff Communication Groups
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Organize DVLA personnel by department, region, employment status, or custom teams for targeted messaging.
          </p>
        </div>

        <button
          disabled={isReadOnly}
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Icon name="Plus" className="w-4 h-4" />
          Create New Group
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => {
          const memberIds = getGroupMemberIds(group);
          const memberCount = memberIds.length || group.count || 0;

          return (
            <div
              key={group.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {group.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{group.name}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-[#006B3F] font-extrabold text-xs rounded-full border border-emerald-200 shrink-0">
                    {memberCount} Staff
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {group.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-400">
                  Created: {group.createdDate}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedGroupDetails(group);
                      setManageTab("members");
                      setGroupMemberSearch("");
                    }}
                    className="px-2.5 py-1 text-slate-700 hover:bg-slate-100 font-semibold rounded-lg flex items-center gap-1 border border-slate-200"
                  >
                    <Icon name="Users" className="w-3.5 h-3.5 text-slate-500" />
                    Manage Staff
                  </button>
                  <button
                    onClick={() => {
                      navigateToSendSmsWithDraft({
                        type: "group",
                        groupItem: {
                          ...group,
                          members: memberIds,
                          count: memberCount
                        }
                      });
                    }}
                    className="px-3 py-1 bg-emerald-50 text-[#006B3F] hover:bg-emerald-100 font-bold rounded-lg border border-emerald-200 flex items-center gap-1"
                  >
                    <Icon name="Send" className="w-3 h-3" />
                    SMS Group
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* VIEW & EDIT GROUP DETAILS MODAL */}
      {selectedGroupDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col justify-between">
            <div className="space-y-4 overflow-y-auto pr-1">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#006B3F] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {selectedGroupDetails.category} Group
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedGroupDetails.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{selectedGroupDetails.description}</p>
                </div>
                <button
                  onClick={() => setSelectedGroupDetails(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                >
                  <Icon name="X" className="w-5 h-5" />
                </button>
              </div>

              {/* Group Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Members</span>
                  <span className="font-extrabold text-sm text-[#006B3F]">{currentDetailsMemberIds.length} Staff</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
                  <span className="font-semibold text-slate-800">{selectedGroupDetails.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Last Updated</span>
                  <span className="font-semibold text-slate-800">{selectedGroupDetails.lastUpdated || "Today"}</span>
                </div>
              </div>

              {/* Tab Navigation & Search */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setManageTab("members")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        manageTab === "members"
                          ? "bg-[#006B3F] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <Icon name="Users" className="w-3.5 h-3.5" />
                      Current Members ({currentDetailsMemberIds.length})
                    </button>
                    {!isReadOnly && (
                      <button
                        onClick={() => setManageTab("add")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          manageTab === "add"
                            ? "bg-[#006B3F] text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        <Icon name="UserPlus" className="w-3.5 h-3.5" />
                        + Add Staff Member
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <Icon name="Search" className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={groupMemberSearch}
                      onChange={(e) => setGroupMemberSearch(e.target.value)}
                      placeholder={manageTab === "members" ? "Filter group members..." : "Search staff to add..."}
                      className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full sm:w-48 focus:bg-white focus:outline-none focus:border-[#006B3F]"
                    />
                  </div>
                </div>

                {/* TAB 1: CURRENT MEMBERS */}
                {manageTab === "members" && (
                  <div className="space-y-2">
                    {filteredCurrentMembers.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 space-y-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Icon name="Users" className="w-8 h-8 mx-auto text-slate-300" />
                        <p className="text-xs font-medium">
                          {currentDetailsMemberIds.length === 0
                            ? "No staff members in this group yet."
                            : "No members matching search query."}
                        </p>
                        {!isReadOnly && currentDetailsMemberIds.length === 0 && (
                          <button
                            onClick={() => setManageTab("add")}
                            className="px-3 py-1 bg-emerald-50 text-[#006B3F] font-bold text-xs rounded-lg border border-emerald-200 inline-flex items-center gap-1"
                          >
                            <Icon name="UserPlus" className="w-3.5 h-3.5" />
                            Add First Staff Member
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                        {filteredCurrentMembers.map((s) => (
                          <div
                            key={s.id}
                            className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-between gap-3 text-xs transition-all shadow-2xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#006B3F] font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                                {s.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join("")}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                  {s.name}
                                  <span className="font-mono text-[10px] text-slate-400 font-normal">({s.id})</span>
                                </div>
                                <div className="text-[11px] text-slate-500 truncate">
                                  {s.department} • {s.position || s.station || s.region}
                                </div>
                              </div>
                            </div>

                            {!isReadOnly && (
                              <button
                                onClick={() => handleRemoveMemberFromGroup(s.id)}
                                title="Remove staff from group"
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg border border-rose-200 text-[11px] shrink-0 flex items-center gap-1 transition-all"
                              >
                                <Icon name="UserMinus" className="w-3.5 h-3.5" />
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: ADD STAFF MEMBER */}
                {manageTab === "add" && (
                  <div className="space-y-2">
                    {filteredAvailableStaff.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 space-y-1 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <Icon name="UserCheck" className="w-8 h-8 mx-auto text-emerald-500" />
                        <p className="text-xs font-semibold text-slate-700">
                          {availableStaffToAdd.length === 0
                            ? "All DVLA staff members are already in this group!"
                            : "No available staff found matching search query."}
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                        {filteredAvailableStaff.map((s) => (
                          <div
                            key={s.id}
                            className="p-2.5 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl flex items-center justify-between gap-3 text-xs transition-all shadow-2xs"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                                {s.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join("")}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                                  {s.name}
                                  <span className="font-mono text-[10px] text-slate-400 font-normal">({s.id})</span>
                                </div>
                                <div className="text-[11px] text-slate-500 truncate">
                                  {s.department} • {s.region || "Accra"}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleAddMemberToGroup(s.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-[#006B3F] text-[#006B3F] hover:text-white font-bold rounded-lg border border-emerald-200 text-[11px] shrink-0 flex items-center gap-1 transition-all"
                            >
                              <Icon name="UserPlus" className="w-3.5 h-3.5" />
                              Add to Group
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => setSelectedGroupDetails(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const g = selectedGroupDetails;
                  setSelectedGroupDetails(null);
                  navigateToSendSmsWithDraft({
                    type: "group",
                    groupItem: {
                      ...g,
                      members: currentDetailsMemberIds,
                      count: currentDetailsMemberIds.length
                    }
                  });
                }}
                className="px-4 py-2 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Icon name="Send" className="w-4 h-4" />
                Dispatch SMS to ({currentDetailsMemberIds.length}) Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE GROUP FORM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="FolderPlus" className="w-5 h-5 text-[#006B3F]" />
                  Create New Staff Group
                </h3>
                <p className="text-xs text-slate-500">Form a new communication group for DVLA personnel</p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <Icon name="X" className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Group Name *</label>
                <input
                  type="text"
                  required
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Regional Licensing Managers"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Group Category</label>
                  <select
                    value={groupCategory}
                    onChange={(e) => setGroupCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium"
                  >
                    <option value="Department">Department</option>
                    <option value="Location">Location / Region</option>
                    <option value="Employment Category">Employment Category</option>
                    <option value="Special Project">Special Project</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Member Count</label>
                  <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-slate-800 font-bold">
                    {selectedMemberIds.length} Members Selected
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                  placeholder="Brief description of group purpose..."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white"
                />
              </div>

              {/* Add Members Picker */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700">Add Staff Members to Group:</label>
                <input
                  type="text"
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                  placeholder="Search staff to add..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                />

                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {filteredStaffForCreate.map((s) => {
                    const isPicked = selectedMemberIds.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleMemberPick(s.id)}
                        className="p-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{s.name}</span>{" "}
                          <span className="text-slate-400">({s.id} • {s.department})</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isPicked}
                          onChange={() => {}}
                          className="accent-[#006B3F]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-md"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
