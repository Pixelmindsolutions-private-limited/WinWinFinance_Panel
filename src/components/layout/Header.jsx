import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import { getAuth } from "../../services/auth";

export default function Header({ onMenu }) {
  const auth = getAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 md:flex">
          <Search size={16} className="text-slate-400" />
          <input
            className="w-52 bg-transparent text-sm outline-none"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={19} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-winwin-100 text-sm font-bold text-winwin-700">
            {auth?.name?.charAt(0) || "W"}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{auth?.name}</p>
            <p className="text-[11px] capitalize text-slate-400">
              {auth?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}