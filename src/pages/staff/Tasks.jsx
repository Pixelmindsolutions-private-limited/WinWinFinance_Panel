import React from "react";
import { CheckCircle2, Clock3 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

export default function Tasks() {
  const tasks = [
    ["Verify KYC - Rahul Kumar", "Today, 11:00 AM", "Pending"],
    ["Collection follow-up - Priya Sharma", "Today, 1:30 PM", "In Progress"],
    ["Loan document review - Arjun Reddy", "Tomorrow", "Pending"],
    ["Customer callback - Sneha Rao", "Tomorrow", "Completed"]
  ];

  return (
    <div>
      <PageHeader title="My Tasks" description="Track your assigned work." />

      <div className="space-y-3">
        {tasks.map(([title, time, status]) => (
          <div key={title} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-winwin-50 text-winwin-600">
                {status === "Completed" ? <CheckCircle2 size={19} /> : <Clock3 size={19} />}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="mt-1 text-xs text-slate-400">{time}</p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}