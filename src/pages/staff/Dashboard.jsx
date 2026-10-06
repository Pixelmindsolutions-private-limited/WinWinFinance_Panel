import React from "react";
import { ClipboardList, IndianRupee, Users, Wallet } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";

export default function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Staff Dashboard"
        description="Your assigned operations and daily performance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Assigned Customers" value="184" change="+12 this week" icon={Users} />
        <StatCard title="Pending Tasks" value="26" change="8 due today" icon={ClipboardList} />
        <StatCard title="Collections" value="₹8.42 L" change="+6.4% this month" icon={IndianRupee} />
        <StatCard title="Disbursements" value="₹14.8 L" change="+11.2% this month" icon={Wallet} />
      </div>

      <div className="card mt-6 p-5">
        <h2 className="font-semibold text-slate-900">Today's Tasks</h2>
        <div className="mt-4 space-y-3">
          {[
            "Follow up with pending loan applications",
            "Verify customer KYC documents",
            "Update collection status",
            "Call assigned customers"
          ].map((task, index) => (
            <div key={task} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-winwin-50 text-xs font-bold text-winwin-700">
                {index + 1}
              </span>
              <span className="text-sm text-slate-700">{task}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}