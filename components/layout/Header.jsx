"use client";

import React, { useState } from "react";
import { useApp } from "@/lib/AppContext";
import Icon from "@/components/ui/Icons";

export default function Header({ mobileMenuOpen, setMobileMenuOpen }) {
  const { activeTab, currentUser, selectedRole, setSelectedRole, mnotifyConfig } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getPageTitle = (tab) => {
    switch (tab) {
      case "dashboard":
        return "Dashboard Overview";
      case "send-sms":
        return "Send SMS Communication";
      case "staff-directory":
        return "DVLA Staff Directory";
      case "staff-groups":
        return "Staff Groups & Teams";
      case "templates":
        return "Message Templates";
      case "sms-history":
        return "SMS Dispatch History";
      case "delivery-reports":
        return "Delivery & Analytics Reports";
      case "scheduled":
        return "Scheduled SMS Queue";
      case "settings":
        return "System Settings & Permissions";
      default:
        return "HR SMS System";
    }
  };

  const notificationList = [
    { id: 1, title: "Broadcast Complete", desc: "Performance Appraisal SMS delivered to 1,192 staff.", time: "10 mins ago", type: "success" },
    { id: 2, title: "Scheduled Alert", desc: "Public Holiday SMS set for 05 Sep at 09:00 AM.", time: "1 hour ago", type: "info" },
    { id: 3, title: "Delivery Warning", desc: "6 SMS messages failed due to invalid numbers.", time: "2 hours ago", type: "warning" }
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Strip */}
      <div className="bg-[#006B3F] text-white px-4 py-1.5 flex items-center justify-end text-xs font-medium">
        <div className="flex items-center gap-4 text-emerald-100">
          <span className="hidden md:flex items-center gap-1.5 font-semibold text-[#EAB308] bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            mNotify API: Connected ({mnotifyConfig.creditBalance.toLocaleString()} Credits)
          </span>
          <span>SYSTEM V2.4</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>

          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {getPageTitle(activeTab)}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Official DVLA Internal Communication Management Console
            </p>
          </div>
        </div>

        {/* Right Section: Role Switcher, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Active Role Selector (for testing RBAC UI) */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-medium pl-2">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 text-slate-800 rounded px-2 py-1 focus:outline-none focus:border-[#006B3F] cursor-pointer"
            >
              <option value="HR Administrator">HR Administrator (Full)</option>
              <option value="HR Officer">HR Officer</option>
              <option value="Communication Officer">Comm Officer</option>
              <option value="Viewer">Viewer (Read-Only)</option>
            </select>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-2 text-slate-600 hover:text-[#006B3F] hover:bg-emerald-50 rounded-lg transition-colors"
              title="Notifications"
            >
              <Icon name="Bell" className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#006B3F] ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Bell" className="w-4 h-4 text-[#006B3F]" />
                    <span className="font-semibold text-xs text-slate-800 uppercase tracking-wider">System Notifications</span>
                  </div>
                  <span className="text-xs font-medium bg-emerald-100 text-[#006B3F] px-2 py-0.5 rounded-full">3 New</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {notificationList.map((n) => (
                    <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center bg-slate-50 border-t border-slate-200">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-[#006B3F] hover:underline font-medium"
                  >
                    Close Panel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-full bg-[#006B3F] text-white flex items-center justify-center font-bold text-xs ring-2 ring-emerald-600/20 shadow-xs">
                EO
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-slate-900 leading-none mb-0.5">{currentUser.name}</div>
                <div className="text-[11px] font-medium text-slate-500 leading-none">{selectedRole}</div>
              </div>
              <Icon name="ChevronDown" className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="p-4 bg-emerald-950 text-white">
                  <p className="text-xs font-bold text-[#EAB308] uppercase tracking-wider">{selectedRole}</p>
                  <p className="text-sm font-bold text-white mt-1">{currentUser.name}</p>
                  <p className="text-xs text-emerald-200 mt-0.5">{currentUser.email}</p>
                  <p className="text-[11px] text-emerald-300 mt-1 font-mono">{currentUser.staffId} • {currentUser.department}</p>
                </div>
                <div className="p-2 space-y-1">
                  <div className="p-2 text-xs font-medium text-slate-500 border-b border-slate-100">
                    Switch Active Role:
                  </div>
                  {["HR Administrator", "HR Officer", "Communication Officer", "Viewer"].map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setSelectedRole(role);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded text-xs font-medium flex items-center justify-between ${
                        selectedRole === role ? "bg-emerald-50 text-[#006B3F] font-bold" : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {role}
                      {selectedRole === role && <Icon name="Check" className="w-3.5 h-3.5 text-[#006B3F]" />}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50">
                  <button
                    onClick={() => setShowUserMenu(false)}
                    className="w-full text-center text-xs text-slate-600 hover:text-slate-900 py-1"
                  >
                    Close Menu
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
