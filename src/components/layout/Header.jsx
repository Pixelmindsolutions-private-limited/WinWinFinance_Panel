// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Bell,
//   ChevronDown,
//   CircleDollarSign,
//   LogOut,
//   Maximize,
//   Menu,
//   Search
// } from "lucide-react";
// import { getAuth, logout } from "../../services/auth";

// export default function Header({ role, onMenu }) {
//   const auth = getAuth();
//   const navigate = useNavigate();
//   const [userOpen, setUserOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const userRef = useRef(null);

//   // Close the user dropdown when clicking outside.
//   useEffect(() => {
//     const handler = (e) => {
//       if (userRef.current && !userRef.current.contains(e.target)) {
//         setUserOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen?.();
//     } else {
//       document.exitFullscreen?.();
//     }
//   };

//   return (
//     <header className="bg-slate-800 text-white">
//       <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:px-6">
//         {/* Left: hamburger + logo + search */}
//         <div className="flex min-w-0 items-center gap-3 sm:gap-5">
//           <button
//             onClick={onMenu}
//             aria-label="Open menu"
//             className="rounded-lg p-2 text-slate-200 hover:bg-white/10 lg:hidden"
//           >
//             <Menu size={22} />
//           </button>

//           <div className="flex min-w-0 items-center gap-2.5">
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-winwin-600 text-white">
//               <CircleDollarSign size={20} />
//             </div>
//             <div className="min-w-0 leading-tight">
//               <p className="truncate text-base font-bold tracking-wide">
//                 WinWin Finance
//               </p>
//               <p className="hidden text-[10px] uppercase tracking-wider text-slate-400 sm:block">
//                 {role === "admin" ? "Administration" : "Staff Portal"}
//               </p>
//             </div>
//           </div>

//           {/* <div className="ml-2 hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 md:flex">
//             <Search size={15} className="text-slate-300" />
//             <input
//               className="w-44 bg-transparent text-sm text-white outline-none placeholder:text-slate-400 lg:w-56"
//               placeholder="Search..."
//             />
//           </div> */}
//         </div>

//         {/* Right: actions */}
//         <div className="flex items-center gap-1 sm:gap-2">
//           {/* <button
//             onClick={() => setSearchOpen((v) => !v)}
//             aria-label="Search"
//             className="rounded-lg p-2 text-slate-200 hover:bg-white/10 md:hidden"
//           >
//             <Search size={19} />
//           </button> */}

//           <button
//             onClick={toggleFullscreen}
//             aria-label="Toggle fullscreen"
//             className="hidden rounded-lg p-2 text-slate-200 hover:bg-white/10 sm:block"
//           >
//             <Maximize size={19} />
//           </button>

//           <button
//             aria-label="Notifications"
//             className="relative rounded-lg p-2 text-slate-200 hover:bg-white/10"
//           >
//             <Bell size={19} />
//             <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
//           </button>

//           {/* User dropdown */}
//           <div className="relative ml-1" ref={userRef}>
//             <button
//               onClick={() => setUserOpen((v) => !v)}
//               aria-expanded={userOpen}
//               className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-white/10"
//             >
//               <div className="flex h-9 w-9 items-center justify-center rounded-full bg-winwin-100 text-sm font-bold text-winwin-700">
//                 {auth?.name?.charAt(0)?.toUpperCase() || "W"}
//               </div>
//               <span className="hidden text-sm font-medium sm:block">
//                 {auth?.name}
//               </span>
//               <ChevronDown
//                 size={15}
//                 className={[
//                   "hidden transition-transform sm:block",
//                   userOpen ? "rotate-180" : ""
//                 ].join(" ")}
//               />
//             </button>

//             {userOpen && (
//               <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xl">
//                 <div className="border-b border-slate-100 px-4 py-3">
//                   <p className="truncate text-sm font-semibold text-slate-900">
//                     {auth?.name}
//                   </p>
//                   <p className="text-[11px] capitalize text-slate-400">
//                     {auth?.role}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => logout(navigate)}
//                   className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
//                 >
//                   <LogOut size={16} />
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Mobile search row */}
//       {searchOpen && (
//         <div className="border-t border-white/10 px-4 pb-3 pt-2 md:hidden">
//           <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2">
//             <Search size={15} className="text-slate-300" />
//             <input
//               autoFocus
//               className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-400"
//               placeholder="Search..."
//             />
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }


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