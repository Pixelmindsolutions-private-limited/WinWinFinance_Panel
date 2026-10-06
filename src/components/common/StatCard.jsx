import React from "react";

export default function StatCard({ title, value, change, icon: Icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-2 text-xs font-medium text-winwin-600">{change}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-winwin-50 text-winwin-600">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}