import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function AppLayout({ role }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        role={role}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />

      <div
        className={[
          "min-h-screen transition-all duration-300",
          collapsed ? "lg:pl-[76px]" : "lg:pl-64"
        ].join(" ")}
      >
        <Header onMenu={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}