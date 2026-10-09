const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const parse = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatLogDate = (log) => {
  const d = parse(log.createdAt);
  return d ? dateFmt.format(d) : log.date || "-";
};

export const formatLogTime = (log) => {
  const d = parse(log.createdAt);
  return d ? timeFmt.format(d).toUpperCase() : log.time || "-";
};