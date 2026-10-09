import { CalendarClock, Clock } from "lucide-react";
import LogsTable from "../../components/common/LogsTable";
import AdminAPI from "../../services/AdminAPI";
import { StaffAvatar } from "../admin/Staff Management/Staff/SingleStaff";
import { formatLogDate, formatLogTime } from "../../utils/logFormat";

const fetchLogs = () => AdminAPI.getLogs();

const AdminCell = ({ log }) => {
  const name = log.adminName || "Super Admin";
  return (
    <div className="flex min-w-0 items-center gap-3">
      <StaffAvatar name={name} size="h-9 w-9" text="text-sm" />
      <span className="truncate font-medium text-slate-800">{name}</span>
    </div>
  );
};

const columns = [
  { header: "Admin", cell: (l) => <AdminCell log={l} /> },
  { header: "Date", cell: formatLogDate },
  { header: "Time", cell: formatLogTime },
];

const renderCard = (log) => (
  <div className="space-y-3">
    <AdminCell log={log} />
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

export default function AdminLogs() {
  return (
    <LogsTable
      title="Admin Logs"
      description="Login activity of super admins."
      fetchLogs={fetchLogs}
      columns={columns}
      renderCard={renderCard}
      emptyText="No admin logs yet."
    />
  );
}