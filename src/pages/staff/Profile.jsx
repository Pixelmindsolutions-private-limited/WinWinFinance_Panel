import React from "react";
import { getAuth } from "../../services/auth";
import PageHeader from "../../components/common/PageHeader";

export default function Profile() {
  const auth = getAuth();

  return (
    <div>
      <PageHeader title="My Profile" description="View your staff account details." />

      <div className="card max-w-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-winwin-100 text-xl font-bold text-winwin-700">
            {auth?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="font-bold text-slate-900">{auth?.name}</h2>
            <p className="text-sm text-slate-500">{auth?.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-slate-400">Role</p>
            <p className="mt-1 text-sm font-medium capitalize text-slate-800">{auth?.role}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Account Status</p>
            <p className="mt-1 text-sm font-medium text-winwin-600">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}