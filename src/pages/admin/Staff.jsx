import React from "react";
import { Plus, UserCog } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

export default function Staff() {
  const staff = [
    ["STF-001", "Amit Verma", "Loan Officer", "Active"],
    ["STF-002", "Kavya Singh", "Collection Executive", "Active"],
    ["STF-003", "Ravi Kumar", "Support Executive", "Inactive"]
  ];

  return (
    <div>
      <PageHeader
        title="Staff Management"
        description="Manage staff accounts, roles and access."
        action={
          <button className="btn-primary">
            <Plus size={16} />
            Add Staff
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {staff.map((item) => (
          <div key={item[0]} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-winwin-50 text-winwin-600">
                <UserCog size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{item[1]}</p>
                <p className="text-xs text-slate-400">{item[0]}</p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-slate-600">{item[2]}</span>
              <span className="rounded-full bg-winwin-50 px-2.5 py-1 text-xs font-medium text-winwin-700">
                {item[3]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}