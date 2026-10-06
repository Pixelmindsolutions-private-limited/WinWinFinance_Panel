import React from "react";
import { ArrowUpRight, CircleDollarSign, CreditCard, Users, Wallet } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="Overview of WinWin Finance operations."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Customers" value="12,840" change="+8.2% this month" icon={Users} />
        <StatCard title="Total Disbursed" value="₹4.82 Cr" change="+12.4% this month" icon={Wallet} />
        <StatCard title="Active Loans" value="3,218" change="+5.6% this month" icon={CreditCard} />
        <StatCard title="Collections" value="₹86.4 L" change="+9.1% this month" icon={CircleDollarSign} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Loan Overview</h2>
              <p className="mt-1 text-xs text-slate-500">Monthly performance</p>
            </div>
            <button className="text-sm font-medium text-winwin-600">View Report</button>
          </div>

          <div className="mt-6 flex h-64 items-end gap-3">
            {[42, 55, 48, 72, 64, 81, 68, 92, 74, 88, 96, 84].map((height, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full max-w-10 rounded-t-lg bg-winwin-500/80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-slate-400">
                  {["J","F","M","A","M","J","J","A","S","O","N","D"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-slate-900">Recent Activity</h2>
          <div className="mt-5 space-y-4">
            {[
              ["New customer registered", "2 minutes ago"],
              ["Loan application approved", "18 minutes ago"],
              ["Staff member added", "42 minutes ago"],
              ["Collection received", "1 hour ago"]
            ].map(([title, time]) => (
              <div key={title} className="flex gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-winwin-500" />
                <div>
                  <p className="text-sm font-medium text-slate-700">{title}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-900">Recent Applications</h2>
          <ArrowUpRight size={18} className="text-slate-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Loan Amount</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Rahul Kumar", "₹4,50,000", "Personal", "Approved"],
                ["Priya Sharma", "₹8,00,000", "Business", "Pending"],
                ["Arjun Reddy", "₹2,50,000", "Personal", "Review"],
                ["Sneha Rao", "₹12,00,000", "Business", "Approved"]
              ].map((row) => (
                <tr key={row[0]} className="border-t border-slate-100">
                  {row.map((value, index) => (
                    <td key={index} className="px-5 py-3.5">
                      {index === 3 ? (
                        <span className="rounded-full bg-winwin-50 px-2.5 py-1 text-xs font-medium text-winwin-700">
                          {value}
                        </span>
                      ) : (
                        <span className={index === 0 ? "font-medium text-slate-800" : "text-slate-600"}>
                          {value}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}