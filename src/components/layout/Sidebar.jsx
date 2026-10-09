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