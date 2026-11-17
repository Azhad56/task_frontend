const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isRealDateOnly(value: string): boolean {
  const match = DATE_ONLY.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function toDateInputValue(iso: string | null): string {
  if (!iso) {
    return "";
  }
  return iso.slice(0, 10);
}

export function formatDateOnly(iso: string | null): string {
  if (!iso) {
    return "No due date";
  }

  const value = iso.slice(0, 10);
  const match = DATE_ONLY.exec(value);
  if (!match) {
    return "No due date";
  }

  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
