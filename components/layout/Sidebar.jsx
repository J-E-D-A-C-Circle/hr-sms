"use client";

import React from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function Sidebar({ mobileMenuOpen, setMobileMenuOpen }) {
  const { activeTab, setActiveTab, currentUser, selectedRole } = useApp();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { id: "send-sms", label: "Send SMS", icon: "MessageSquare", badge: "Core" },
    { id: "staff-directory", label: "Staff Directory", icon: "Users" },
    { id: "staff-groups", label: "Staff Groups", icon: "FolderUsers" },
    { id: "templates", label: "Message Templates", icon: "FileText" },
    { id: "sms-history", label: "SMS History", icon: "History" },
    { id: "delivery-reports", label: "Delivery Reports", icon: "BarChart3" },
    { id: "scheduled", label: "Scheduled Messages", icon: "CalendarClock", badge: "2" },
    { id: "settings", label: "Settings", icon: "Settings" }
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 h-screen bg-[#004D2C] text-white flex flex-col border-r border-emerald-900/50 shadow-xl transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 shrink-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-emerald-800/60 bg-[#003D24]">
          <div className="flex items-center gap-3">
            <img src="/oop.png" alt="DVLA Logo" className="w-10 h-10 rounded-full object-contain bg-white p-0.5 border border-[#EAB308] shadow-md shrink-0" />
            <div>
              <h2 className="font-bold text-sm text-white tracking-wide leading-snug">DVLA HR SMS</h2>
              <p className="text-[11px] text-emerald-200 font-medium">Staff Communication</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-xs font-bold text-emerald-300/80 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 group ${
                  isActive
                    ? "bg-[#006B3F] text-white font-semibold shadow-sm ring-1 ring-[#EAB308]/40"
                    : "text-emerald-100/90 hover:bg-emerald-800/50 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    name={item.icon}
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-[#EAB308]" : "text-emerald-300 group-hover:text-emerald-100"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      isActive
                        ? "bg-[#EAB308] text-slate-950"
                        : "bg-emerald-800 text-emerald-200 border border-emerald-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="p-3.5 m-3 rounded-xl bg-emerald-950/70 border border-emerald-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#006B3F] border border-emerald-400 text-white flex items-center justify-center font-bold text-xs">
              EO
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-[#EAB308] truncate font-medium">{selectedRole}</p>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Online
            </span>
            <button
              onClick={() => handleNavClick("settings")}
              className="text-emerald-200 hover:text-white flex items-center gap-1 font-medium transition-colors"
            >
              <Icon name="LogOut" className="w-3.5 h-3.5 text-[#EAB308]" />
              Role Config
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
