import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, RefreshCw, ScrollText } from "lucide-react";
import PageHeader from "./PageHeader";
import Pagination from "./Pagination";

const PAGE_SIZE = 10;

export default function LogsTable({
  title,
  description,
  fetchLogs, // must be a stable reference (define outside the component)
  columns, // [{ header, cell(log) }]
  renderCard, // mobile layout: (log) => JSX
  emptyText = "No logs found.",
}) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchLogs();
      setLogs(Array.isArray(res?.logs) ? res.logs : []);
      setPage(1);
    } catch (err) {
      setError(err.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  }, [fetchLogs]);

  useEffect(() => {
    load();
  }, [load]);

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const rows = useMemo(
    () => logs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [logs, currentPage]
  );

  const hasData = logs.length > 0;

  return (
    <div className="w-full min-w-0">
      <PageHeader
        title={title}
        description={description}
        action={
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        }
      />

      {loading && !hasData ? (
        <div className="flex items-center justify-center py-20 text-slate-400">
          <Loader2 className="mr-2 animate-spin" size={20} />
          Loading logs...
        </div>
      ) : error && !hasData ? (
        <div className="card mx-auto flex max-w-2xl flex-col items-center gap-3 p-8 text-center">
          <AlertCircle className="text-red-500" size={28} />
          <p className="text-sm text-slate-600">{error}</p>
          <button className="btn-primary" onClick={load}>
            Try Again
          </button>
        </div>
      ) : (
        <div className="w-full min-w-0 space-y-4">
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}. Showing previously loaded logs.</span>
            </div>
          )}

          <div className="card w-full min-w-0 overflow-hidden">
            {!hasData ? (
              <div className="flex flex-col items-center gap-2 py-16 text-slate-400">
                <ScrollText size={28} />
                <p className="text-sm">{emptyText}</p>
              </div>
            ) : (
              <>
                {/* Desktop table (cards are used below lg so it always fits) */}
                <div className="hidden w-full overflow-x-auto lg:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        {columns.map((c) => (
                          <th
                            key={c.header}
                            className="px-4 py-3 font-semibold xl:px-5"
                          >
                            {c.header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {rows.map((log) => (
                        <tr key={log._id} className="hover:bg-slate-50/60">
                          {columns.map((c) => (
                            <td
                              key={c.header}
                              className="break-words px-4 py-3.5 align-middle text-slate-600 xl:px-5"
                            >
                              {c.cell(log)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile / tablet cards */}
                <ul className="divide-y divide-slate-100 lg:hidden">
                  {rows.map((log) => (
                    <li key={log._id} className="p-4">
                      {renderCard(log)}
                    </li>
                  ))}
                </ul>

                <Pagination
                  page={currentPage}
                  totalPages={totalPages}
                  totalItems={logs.length}
                  pageSize={PAGE_SIZE}
                  onChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}