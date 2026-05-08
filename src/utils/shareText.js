import { formatCurrency, formatDate } from "./formatCurrency.js";

export function buildShareText(estimate, totals, settings) {
  const lines = [
    settings.shopName || "Al-Estimate",
    settings.phone ? `Phone: ${settings.phone}` : "",
    "",
    `Estimate${estimate.clientName ? ` for ${estimate.clientName}` : ""}`,
    `Date: ${formatDate(estimate.date || new Date().toISOString())}`,
    ""
  ].filter(Boolean);

  totals.windowBreakdowns.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.label} - ${item.typeName}`,
      `${item.widthFt}ft x ${item.heightFt}ft x ${item.quantity}`,
      `Amount: ${formatCurrency(item.total, settings.currency)}`,
      "",
    );
  });

  lines.push(
    `Materials: ${formatCurrency(totals.materialsSubtotal, settings.currency)}`,
    `Glass: ${formatCurrency(totals.glassSubtotal, settings.currency)}`,
    `Labour: ${formatCurrency(totals.labour, settings.currency)}`,
    `GST: ${formatCurrency(totals.gst, settings.currency)}`,
    `Grand Total: ${formatCurrency(totals.grandTotal, settings.currency)}`,
  );

  if (estimate.notes) {
    lines.push("", `Notes: ${estimate.notes}`);
  }

  return lines.join("\n");
}

