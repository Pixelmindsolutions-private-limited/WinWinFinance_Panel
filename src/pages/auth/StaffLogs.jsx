import { CalendarClock, Clock } from "lucide-react";
import LogsTable from "../../components/common/LogsTable";
import StaffAPI from "../../services/StaffAPI";
import { StaffAvatar } from "../admin/Staff Management/Staff/SingleStaff";
import { formatLogDate, formatLogTime } from "../../utils/logFormat";

const fetchLogs = () => StaffAPI.getLogs();

const StaffCell = ({ log }) => (
  <div className="flex min-w-0 items-center gap-3">
    <StaffAvatar name={log.staffName} size="h-9 w-9" text="text-sm" />
    <span className="truncate font-medium text-slate-800">
      {log.staffName || "-"}
    </span>
  </div>
);

const columns = [
  { header: "Staff", cell: (l) => <StaffCell log={l} /> },
  { header: "Role", cell: (l) => l.roleName || "-" },
  { header: "Department", cell: (l) => l.departmentName || "-" },
  { header: "Date", cell: formatLogDate },
  { header: "Time", cell: formatLogTime },
];

const renderCard = (log) => (
  <div className="space-y-3">
    <StaffCell log={log} />
    <p className="text-xs text-slate-500">
      {[log.roleName, log.departmentName].filter(Boolean).join(" · ") || "-"}
    </p>
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
      <span className="inline-flex items-center gap-1.5">
        <CalendarClock size={14} className="text-winwin-600" />
        {formatLogDate(log)}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock size={14} className="text-winwin-600" />
        {formatLogTime(log)}
      </span>
    </div>
  </div>
);

export default function StaffLogs() {
  return (
    <LogsTable
      title="Staff Logs"
      description="Login activity of all staff members."
      fetchLogs={fetchLogs}
      columns={columns}
      renderCard={renderCard}
      emptyText="No staff logs yet."
    />
  );
}