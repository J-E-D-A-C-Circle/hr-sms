"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function TemplatesView() {
  const { templates, createTemplate, updateTemplate, deleteTemplate, navigateToSendSmsWithDraft, selectedRole } = useApp();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Staff Meeting");
  const [message, setMessage] = useState("");

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setTitle("");
    setCategory("Staff Meeting");
    setMessage("");
    setShowCreateModal(true);
  };

  const handleOpenEdit = (tpl) => {
    setEditingTemplate(tpl);
    setTitle(tpl.title);
    setCategory(tpl.category);
    setMessage(tpl.message);
    setShowCreateModal(true);
  };

  const handleDuplicate = (tpl) => {
    createTemplate({
      title: `${tpl.title} (Copy)`,
      category: tpl.category,
      message: tpl.message
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    if (editingTemplate) {
      updateTemplate(editingTemplate.id, { title, category, message });
    } else {
      createTemplate({ title, category, message });
    }

    setShowCreateModal(false);
  };

  const isReadOnly = selectedRole === "Viewer";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon name="FileText" className="w-5 h-5 text-[#006B3F]" />
            HR Message Templates
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Predefined official HR messaging templates for quick dispatch during meetings, emergencies, and payroll notices.
          </p>
        </div>

        <button
          disabled={isReadOnly}
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#006B3F] hover:bg-[#005432] text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <Icon name="Plus" className="w-4 h-4" />
          Create New Template
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-snug">{tpl.title}</h3>
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-md border shrink-0">
                  {tpl.category}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans italic">
                "{tpl.message}"
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Modified: {tpl.lastModified}</span>
                <span>By: {tpl.createdBy.split(" ")[0]}</span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    navigateToSendSmsWithDraft({
                      message: tpl.message
                    })
                  }
                  className="px-3 py-1.5 bg-emerald-50 text-[#006B3F] hover:bg-emerald-100 font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5 text-xs transition-colors"
                >
                  <Icon name="Send" className="w-3.5 h-3.5" />
                  Use in SMS
                </button>

                <div className="flex items-center gap-1">
                  <button
                    disabled={isReadOnly}
                    onClick={() => handleDuplicate(tpl)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Duplicate Template"
                  >
                    <Icon name="Copy" className="w-4 h-4" />
                  </button>

                  <button
                    disabled={isReadOnly}
                    onClick={() => handleOpenEdit(tpl)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Template"
                  >
                    <Icon name="Edit" className="w-4 h-4" />
                  </button>

                  <button
                    disabled={isReadOnly}
                    onClick={() => deleteTemplate(tpl.id)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Template"
                  >
                    <Icon name="Trash2" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT TEMPLATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Icon name="FileText" className="w-5 h-5 text-[#006B3F]" />
                  {editingTemplate ? "Edit Template" : "Create HR Template"}
                </h3>
                <p className="text-xs text-slate-500">Formulate standardized message for future dispatches</p>
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
                <label className="block font-bold text-slate-700 mb-1">Template Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Staff Meeting Reminder"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white font-medium text-slate-900"
                >
                  <option value="Staff Meeting">Staff Meeting</option>
                  <option value="General Announcement">General Announcement</option>
                  <option value="Training">Training & Workshop</option>
                  <option value="Emergency">Emergency Alert</option>
                  <option value="Payroll">Payroll Notice</option>
                  <option value="Holiday">Holiday Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Text *</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type official message body..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:outline-none focus:border-[#006B3F] bg-white text-slate-900 leading-relaxed font-sans"
                />
                <p className="text-[10px] text-slate-400 mt-1">Characters: {message.length} / 160</p>
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
                Save Template
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
