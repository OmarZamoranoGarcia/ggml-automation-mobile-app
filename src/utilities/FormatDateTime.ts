export function FormatDateTime(isoDate: string) {
  if (!isoDate) return "";

  // Algunos strings vienen como "YYYY-MM-DD HH:mm:ss+00"
  // Convertimos el espacio entre fecha y hora a "T"
  const normalized = isoDate.replace(" ", "T");

  const date = new Date(normalized);

  return date.toLocaleString("es-MX", {
    timeZone: "America/Tijuana",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
