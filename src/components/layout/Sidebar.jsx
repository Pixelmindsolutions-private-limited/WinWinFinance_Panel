// import React, { useEffect, useRef, useState } from "react";
// import { NavLink, useLocation, useNavigate } from "react-router-dom";
// import {
//   BarChart3,
//   ChevronDown,
//   ClipboardList,
//   LayoutDashboard,
//   LogOut,
//   Settings,
//   UserCog,
//   Users,
//   X
// } from "lucide-react";
// import { logout } from "../../services/auth";

// /*
//   Menu config.
//   - An item with `children` becomes a dropdown (desktop) / accordion (mobile).
//   - An item without `children` is a normal link.
// */
// const adminItems = [
//   { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
//   {
//     label: "Customers",
//     icon: Users,
//     children: [
//       { label: "All Customers", path: "/admin/users" },
//       { label: "Add Customer", path: "/admin/users/new" }
//     ]
//   },
//   {
//     label: "Staff Management",
//     icon: UserCog,
//     children: [
//       { label: "Departments", path: "/admin/departments" },
//       { label: "Roles", path: "/admin/roles" },
//       { label: "All Staff", path: "/admin/staff" }
//     ]
//   },
//   {
//     label: "Logs",
//     icon: BarChart3,
//     children: [
//       { label: "Admin Login logs", path: "/admin/login/admin-logs" },
//       { label: "Staff Login logs", path: "/admin/login/staff-logs" }
//     ]
//   },
//   {
//     label: "Settings",
//     icon: Settings,
//     children: [
//       { label: "Admin Profile", path: "/admin/settings" },
//       { label: "Policies", path: "/admin/policies" },
//       { label: "FAQs", path: "/admin/faqs" }
//     ]
//   }
// ];

// const staffItems = [
//   { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
//   {
//     label: "Customers",
//     icon: Users,
//     children: [
//       { label: "My Customers", path: "/staff/customers" },
//       { label: "Add Customer", path: "/staff/customers/new" }
//     ]
//   },
//   {
//     label: "My Tasks",
//     icon: ClipboardList,
//     children: [
//       { label: "Pending", path: "/staff/tasks" },
//       { label: "Completed", path: "/staff/tasks/completed" }
//     ]
//   },
//   { label: "Profile", path: "/staff/profile", icon: UserCog }
// ];

// const matchesPath = (pathname, path) =>
//   pathname === path || pathname.startsWith(`${path}/`);

// const isGroupActive = (item, pathname) =>
//   Boolean(item.children?.some((child) => matchesPath(pathname, child.path)));

// export default function Sidebar({ role, mobileOpen, onClose }) {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//   const items = role === "admin" ? adminItems : staffItems;

//   const activeGroupLabel =
//     items.find((item) => isGroupActive(item, pathname))?.label ?? null;

//   const [dropdown, setDropdown] = useState(null); // desktop dropdown
//   const [openGroup, setOpenGroup] = useState(activeGroupLabel); // mobile accordion
//   const navRef = useRef(null);

//   // Close dropdown on route change; sync mobile accordion with active section.
//   useEffect(() => {
//     setDropdown(null);
//     setOpenGroup(activeGroupLabel);
//   }, [pathname, activeGroupLabel]);

//   // Close desktop dropdown on outside click / Escape.
//   useEffect(() => {
//     const onClick = (e) => {
//       if (navRef.current && !navRef.current.contains(e.target)) {
//         setDropdown(null);
//       }
//     };
//     const onKey = (e) => e.key === "Escape" && setDropdown(null);
//     document.addEventListener("mousedown", onClick);
//     document.addEventListener("keydown", onKey);
//     return () => {
//       document.removeEventListener("mousedown", onClick);
//       document.removeEventListener("keydown", onKey);
//     };
//   }, []);

//   // Lock body scroll while mobile drawer is open.
//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? "hidden" : "";
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [mobileOpen]);

//   const linkBase =
//     "relative flex items-center gap-2 whitespace-nowrap px-4 py-4 text-sm font-medium transition";

//   return (
//     <>
//       {/* ================= Desktop horizontal menu ================= */}
//       <nav
//         ref={navRef}
//         className="hidden border-b border-slate-200 bg-white shadow-sm lg:block"
//       >
//         <ul className="mx-auto flex max-w-[1400px] items-center gap-1 px-4 sm:px-6">
//           {items.map((item) => {
//             const Icon = item.icon;

//             if (item.children) {
//               const active = isGroupActive(item, pathname);
//               const isOpen = dropdown === item.label;

//               return (
//                 <li key={item.label} className="relative">
//                   <button
//                     type="button"
//                     onClick={() => setDropdown(isOpen ? null : item.label)}
//                     aria-expanded={isOpen}
//                     className={[
//                       linkBase,
//                       active
//                         ? "text-winwin-700"
//                         : "text-slate-600 hover:text-winwin-700"
//                     ].join(" ")}
//                   >
//                     <Icon size={17} />
//                     {item.label}
//                     <ChevronDown
//                       size={14}
//                       className={[
//                         "transition-transform duration-200",
//                         isOpen ? "rotate-180" : ""
//                       ].join(" ")}
//                     />
//                     {active && (
//                       <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-winwin-600" />
//                     )}
//                   </button>

//                   {isOpen && (
//                     <ul className="absolute left-0 top-full z-50 mt-0 min-w-[210px] overflow-hidden rounded-b-xl border border-slate-200 bg-white py-2 shadow-xl">
//                       {item.children.map((child) => (
//                         <li key={child.path}>
//                           <NavLink
//                             to={child.path}
//                             end
//                             className={({ isActive }) =>
//                               [
//                                 "flex items-center gap-2.5 px-4 py-2.5 text-[13px] transition",
//                                 isActive
//                                   ? "bg-winwin-50 font-semibold text-winwin-700"
//                                   : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                               ].join(" ")
//                             }
//                           >
//                             {({ isActive }) => (
//                               <>
//                                 <span
//                                   className={[
//                                     "h-1.5 w-1.5 shrink-0 rounded-full",
//                                     isActive ? "bg-winwin-600" : "bg-slate-300"
//                                   ].join(" ")}
//                                 />
//                                 {child.label}
//                               </>
//                             )}
//                           </NavLink>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </li>
//               );
//             }

//             return (
//               <li key={item.path}>
//                 <NavLink
//                   to={item.path}
//                   className={({ isActive }) =>
//                     [
//                       linkBase,
//                       isActive
//                         ? "text-winwin-700"
//                         : "text-slate-600 hover:text-winwin-700"
//                     ].join(" ")
//                   }
//                 >
//                   {({ isActive }) => (
//                     <>
//                       <Icon size={17} />
//                       {item.label}
//                       {isActive && (
//                         <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-winwin-600" />
//                       )}
//                     </>
//                   )}
//                 </NavLink>
//               </li>
//             );
//           })}
//         </ul>
//       </nav>

//       {/* ================= Mobile drawer ================= */}
//       <div
//         className={[
//           "fixed inset-0 z-50 lg:hidden",
//           mobileOpen ? "pointer-events-auto" : "pointer-events-none"
//         ].join(" ")}
//       >
//         {/* Backdrop */}
//         <button
//           aria-label="Close menu"
//           onClick={onClose}
//           className={[
//             "absolute inset-0 bg-slate-950/50 transition-opacity duration-300",
//             mobileOpen ? "opacity-100" : "opacity-0"
//           ].join(" ")}
//         />

//         {/* Panel */}
//         <aside
//           className={[
//             "absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col bg-white shadow-2xl transition-transform duration-300",
//             mobileOpen ? "translate-x-0" : "-translate-x-full"
//           ].join(" ")}
//         >
//           <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
//             <div>
//               <p className="text-sm font-bold text-slate-900">WinWin Finance</p>
//               <p className="text-[11px] text-slate-400">
//                 {role === "admin" ? "Administration" : "Staff Portal"}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               aria-label="Close menu"
//               className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <nav className="flex-1 space-y-1 overflow-y-auto p-3">
//             {items.map((item) => {
//               const Icon = item.icon;

//               if (item.children) {
//                 const active = isGroupActive(item, pathname);
//                 const isOpen = openGroup === item.label;

//                 return (
//                   <div key={item.label}>
//                     <button
//                       type="button"
//                       onClick={() => setOpenGroup(isOpen ? null : item.label)}
//                       aria-expanded={isOpen}
//                       className={[
//                         "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
//                         active
//                           ? "bg-winwin-50 text-winwin-700"
//                           : "text-slate-600 hover:bg-slate-50"
//                       ].join(" ")}
//                     >
//                       <Icon size={18} />
//                       <span className="flex-1 text-left">{item.label}</span>
//                       <ChevronDown
//                         size={16}
//                         className={[
//                           "transition-transform duration-200",
//                           isOpen ? "rotate-180" : ""
//                         ].join(" ")}
//                       />
//                     </button>

//                     <div
//                       className={[
//                         "grid transition-[grid-template-rows] duration-200 ease-out",
//                         isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
//                       ].join(" ")}
//                     >
//                       <div className="overflow-hidden">
//                         <ul className="ml-5 mt-1 space-y-0.5 border-l border-slate-200 pl-3">
//                           {item.children.map((child) => (
//                             <li key={child.path}>
//                               <NavLink
//                                 to={child.path}
//                                 end
//                                 onClick={onClose}
//                                 tabIndex={isOpen ? 0 : -1}
//                                 className={({ isActive }) =>
//                                   [
//                                     "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition",
//                                     isActive
//                                       ? "bg-winwin-50 font-semibold text-winwin-700"
//                                       : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
//                                   ].join(" ")
//                                 }
//                               >
//                                 {({ isActive }) => (
//                                   <>
//                                     <span
//                                       className={[
//                                         "h-1.5 w-1.5 shrink-0 rounded-full",
//                                         isActive
//                                           ? "bg-winwin-600"
//                                           : "bg-slate-300"
//                                       ].join(" ")}
//                                     />
//                                     <span className="truncate">{child.label}</span>
//                                   </>
//                                 )}
//                               </NavLink>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               }

//               return (
//                 <NavLink
//                   key={item.path}
//                   to={item.path}
//                   onClick={onClose}
//                   className={({ isActive }) =>
//                     [
//                       "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
//                       isActive
//                         ? "bg-winwin-50 text-winwin-700"
//                         : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
//                     ].join(" ")
//                   }
//                 >
//                   <Icon size={18} />
//                   <span>{item.label}</span>
//                 </NavLink>
//               );
//             })}
//           </nav>

//           <div className="border-t border-slate-100 p-3">
//             <button
//               onClick={() => {
//                 onClose();
//                 logout(navigate);
//               }}
//               className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         </aside>
//       </div>
//     </>
//   );
// }


import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  ChevronDown,
  ChevronLeft,
  CircleDollarSign,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCog,
  Users
} from "lucide-react";
import { logout } from "../../services/auth";

/*
  Menu config.
  - An item with `children` becomes an expandable section.
  - An item without `children` is a normal link.
  Update the child paths below so they match your router.
*/
const adminItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "Customers",
    icon: Users,
    children: [
      { label: "All Customers", path: "/admin/users" },
      { label: "Add Customer", path: "/admin/users/new" }
    ]
  },
  {
    label: "Staff Management",
    icon: UserCog,
    children: [
      { label: "Departments", path: "/admin/departments" },
      { label: "Roles", path: "/admin/roles" },
      { label: "All Staff", path: "/admin/staff" },
    ]
  },
  {
    label: "Logs",
    icon: BarChart3,
    children: [
      { label: "Admin Login logs", path: "/admin/login/admin-logs" },
      { label: "Staff Login logs", path: "/admin/login/staff-logs" }
    ]
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Admin Profile", path: "/admin/settings" },
      { label: "Policies", path: "/admin/policies" },
      { label: "FAQs", path: "/admin/faqs" }
    ]
  }
];

const staffItems = [
  { label: "Dashboard", path: "/staff/dashboard", icon: LayoutDashboard },
  {
    label: "Customers",
    icon: Users,
    children: [
      { label: "My Customers", path: "/staff/customers" },
      { label: "Add Customer", path: "/staff/customers/new" }
    ]
  },
  {
    label: "My Tasks",
    icon: ClipboardList,
    children: [
      { label: "Pending", path: "/staff/tasks" },
      { label: "Completed", path: "/staff/tasks/completed" }
    ]
  },
  { label: "Profile", path: "/staff/profile", icon: UserCog }
];

// A path is "inside" a section when it matches exactly or is nested below it.
const matchesPath = (pathname, path) =>
  pathname === path || pathname.startsWith(`${path}/`);

// A section is active when any of its children matches the current URL.
const isGroupActive = (item, pathname) =>
  Boolean(item.children?.some((child) => matchesPath(pathname, child.path)));

export default function Sidebar({ role, open, onClose, collapsed, onToggle }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const items = role === "admin" ? adminItems : staffItems;

  const activeGroupLabel =
    items.find((item) => isGroupActive(item, pathname))?.label ?? null;

  // Only one section is expanded at a time; the active one opens automatically.
  const [openGroup, setOpenGroup] = useState(activeGroupLabel);

  useEffect(() => {
    setOpenGroup(activeGroupLabel);
  }, [activeGroupLabel]);

  const handleLogout = () => {
    logout(navigate);
  };

  const handleGroupClick = (label) => {
    // In the collapsed rail there is no room for sub-items, so expand first.
    if (collapsed) {
      onToggle?.();
      setOpenGroup(label);
      return;
    }
    setOpenGroup((current) => (current === label ? null : label));
  };

  return (
    <>
      {open && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-200 bg-white transition-all duration-300",
          collapsed ? "w-[76px]" : "w-64",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        ].join(" ")}
      >
        <div className="flex h-16 items-center border-b border-slate-100 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-winwin-600 text-white shadow-sm">
              <CircleDollarSign size={21} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900">
                  WinWin Finance
                </p>
                <p className="text-[11px] text-slate-400">
                  {role === "admin" ? "Administration" : "Staff Portal"}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {role === "admin" ? "Admin Panel" : "Staff Panel"}
            </p>
          )}

          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;

              /* ---------- Section with sub-items ---------- */
              if (item.children) {
                const groupActive = isGroupActive(item, pathname);
                const groupOpen = !collapsed && openGroup === item.label;
                const panelId = `submenu-${item.label.replace(/\s+/g, "-").toLowerCase()}`;

                return (
                  <div key={item.label}>
                    <button
                      type="button"
                      onClick={() => handleGroupClick(item.label)}
                      title={collapsed ? item.label : undefined}
                      aria-expanded={groupOpen}
                      aria-controls={panelId}
                      className={[
                        "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                        groupActive
                          ? "bg-winwin-50 text-winwin-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        collapsed ? "justify-center" : ""
                      ].join(" ")}
                    >
                      {groupActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-winwin-600" />
                      )}
                      <Icon size={18} />
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={[
                              "shrink-0 transition-transform duration-200",
                              groupOpen ? "rotate-180" : ""
                            ].join(" ")}
                          />
                        </>
                      )}
                    </button>

                    {!collapsed && (
                      <div
                        id={panelId}
                        className={[
                          "grid transition-[grid-template-rows] duration-200 ease-out",
                          groupOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        ].join(" ")}
                      >
                        <div className="overflow-hidden">
                          <ul className="ml-5 mt-1 space-y-0.5 border-l border-slate-200 pl-3">
                            {item.children.map((child) => (
                              <li key={child.path}>
                                <NavLink
                                  to={child.path}
                                  end
                                  onClick={onClose}
                                  tabIndex={groupOpen ? 0 : -1}
                                  className={({ isActive }) =>
                                    [
                                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition",
                                      isActive
                                        ? "bg-winwin-50 font-semibold text-winwin-700"
                                        : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                    ].join(" ")
                                  }
                                >
                                  {({ isActive }) => (
                                    <>
                                      <span
                                        className={[
                                          "h-1.5 w-1.5 shrink-0 rounded-full transition",
                                          isActive ? "bg-winwin-600" : "bg-slate-300"
                                        ].join(" ")}
                                      />
                                      <span className="truncate">{child.label}</span>
                                    </>
                                  )}
                                </NavLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              /* ---------- Single link ---------- */
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    [
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-winwin-50 text-winwin-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      collapsed ? "justify-center" : ""
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-winwin-600" />
                      )}
                      <Icon size={18} />
                      {!collapsed && <span>{item.label}</span>}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-100 p-3">
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={[
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50",
              collapsed ? "justify-center" : ""
            ].join(" ")}
          >
            <LogOut size={18} />
            {!collapsed && "Logout"}
          </button>

          <button
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mt-2 hidden w-full items-center justify-center rounded-xl border border-slate-200 py-2 text-slate-500 hover:bg-slate-50 lg:flex"
          >
            <ChevronLeft
              size={17}
              className={collapsed ? "rotate-180" : ""}
            />
          </button>
        </div>
      </aside>
    </>
  );
}