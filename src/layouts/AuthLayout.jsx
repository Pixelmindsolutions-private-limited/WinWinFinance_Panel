import React from "react";
import { Outlet } from "react-router-dom";
import { CircleDollarSign, ShieldCheck } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-winwin-900 via-winwin-700 to-winwin-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <CircleDollarSign size={24} />
            </div>
            <div>
              <p className="font-bold">WinWin Finance</p>
              <p className="text-xs text-white/70">Financial Management Platform</p>
            </div>
          </div>

          <div className="max-w-md">
            <ShieldCheck size={40} className="mb-5 text-white/90" />
            <h1 className="text-4xl font-bold leading-tight">
              Manage your finance operations securely.
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/75">
              A centralized workspace for administration, staff operations,
              customers, tasks and financial reporting.
            </p>
          </div>

          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} WinWin Finance
          </p>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}