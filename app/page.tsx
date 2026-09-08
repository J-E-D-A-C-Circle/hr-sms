"use client";

import React, { useState } from "react";
import { AppProvider, useApp } from "@/lib/AppContext";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Toast from "@/components/layout/Toast";

import DashboardView from "@/components/dashboard/DashboardView";
import SendSmsView from "@/components/sms/SendSmsView";
import StaffDirectoryView from "@/components/staff/StaffDirectoryView";
import StaffGroupsView from "@/components/groups/StaffGroupsView";
import TemplatesView from "@/components/templates/TemplatesView";
import SmsHistoryView from "@/components/history/SmsHistoryView";
import DeliveryReportsView from "@/components/reports/DeliveryReportsView";
import ScheduledMessagesView from "@/components/scheduled/ScheduledMessagesView";
import SettingsView from "@/components/settings/SettingsView";

interface MainContentProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function MainContent({ mobileMenuOpen, setMobileMenuOpen }: MainContentProps) {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "send-sms":
        return <SendSmsView />;
      case "staff-directory":
        return <StaffDirectoryView />;
      case "staff-groups":
        return <StaffGroupsView />;
      case "templates":
        return <TemplatesView />;
      case "sms-history":
        return <SmsHistoryView />;
      case "delivery-reports":
        return <DeliveryReportsView />;
      case "scheduled":
        return <ScheduledMessagesView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-50 min-w-0">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {renderActiveView()}
      </main>

      {/* Enterprise Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#006B3F]"></span>
          <span className="font-semibold text-slate-800">Driver and Vehicle Licensing Authority (DVLA)</span>
          <span>© {new Date().getFullYear()} — Official HR SMS Portal</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Official DVLA HR System</span>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AppProvider>
      <div className="h-screen overflow-hidden flex bg-slate-50 font-sans antialiased text-slate-900">
        <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <MainContent mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        <Toast />
      </div>
    </AppProvider>
  );
}
