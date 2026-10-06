import React from "react";
import PageHeader from "../../components/common/PageHeader";

export default function Customers() {
  const customers = [
    ["Rahul Kumar", "Personal Loan", "₹4,50,000", "Pending"],
    ["Priya Sharma", "Business Loan", "₹8,00,000", "Verified"],
    ["Arjun Reddy", "Personal Loan", "₹2,50,000", "Follow-up"],
    ["Sneha Rao", "Business Loan", "₹12,00,000", "Verified"]
  ];

  return (
    <div>
      <PageHeader title="My Customers" description="Customers assigned to you." />

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Loan Type</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((row) => (
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