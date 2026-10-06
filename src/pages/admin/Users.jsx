import React from "react";
import { Plus, Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";

const customers = [
  ["CUST-1001", "Rahul Kumar", "rahul@example.com", "₹4,50,000", "Active"],
  ["CUST-1002", "Priya Sharma", "priya@example.com", "₹8,00,000", "Active"],
  ["CUST-1003", "Arjun Reddy", "arjun@example.com", "₹2,50,000", "Pending"],
  ["CUST-1004", "Sneha Rao", "sneha@example.com", "₹12,00,000", "Active"]
];

export default function Users() {
  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage registered WinWin Finance customers."
        action={
          <button className="btn-primary">
            <Plus size={16} />
            Add Customer
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <div className="flex max-w-sm items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search customers..." />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Loan</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer[0]} className="border-t border-slate-100">
                  {customer.map((value, index) => (
                    <td key={index} className="px-5 py-3.5">
                      {index === 4 ? (
                        <span className="rounded-full bg-winwin-50 px-2.5 py-1 text-xs font-medium text-winwin-700">
                          {value}
                        </span>
                      ) : (
                        <span className={index === 1 ? "font-medium text-slate-800" : "text-slate-600"}>
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