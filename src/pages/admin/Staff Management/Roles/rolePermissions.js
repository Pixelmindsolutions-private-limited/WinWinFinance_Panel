export const ROLES_BASE_PATH = "/admin/roles";

export const PERMISSION_MODULES = [
  { module: "Dashboard", path: "/staff/dashboard", subModules: [] },
  {
    module: "Customers",
    path: "",
    subModules: [
      { label: "My Customers", path: "/staff/customers" },
      { label: "Add Customer", path: "/staff/customers/new" },
    ],
  },
  {
    module: "My Tasks",
    path: "",
    subModules: [
      { label: "Pending", path: "/staff/tasks" },
      { label: "Completed", path: "/staff/tasks/completed" },
    ],
  },
  { module: "Profile", path: "/staff/profile", subModules: [] },
];

// Paths that belong to a module (its own path if it has no children)
export const getModulePaths = (mod) =>
  mod.subModules.length ? mod.subModules.map((s) => s.path) : [mod.path];

// Selected Set of paths -> rolesAndPermission array for the API
export const buildPermissionPayload = (selected) =>
  PERMISSION_MODULES.reduce((acc, mod) => {
    if (mod.subModules.length) {
      const subs = mod.subModules.filter((s) => selected.has(s.path));
      if (subs.length) acc.push({ module: mod.module, path: "", subModules: subs });
    } else if (selected.has(mod.path)) {
      acc.push({ module: mod.module, path: mod.path, subModules: [] });
    }
    return acc;
  }, []);

// rolesAndPermission array from the API -> Set of selected paths
export const extractSelectedPaths = (rolesAndPermission = []) => {
  const set = new Set();
  rolesAndPermission.forEach((p) => {
    if (p?.path) set.add(p.path);
    (p?.subModules || p?.children || []).forEach((s) => s?.path && set.add(s.path));
  });
  return set;
};

export const countPermissions = (rolesAndPermission = []) =>
  rolesAndPermission.reduce(
    (n, p) => n + ((p?.subModules || []).length || (p?.path ? 1 : 0)),
    0
  );