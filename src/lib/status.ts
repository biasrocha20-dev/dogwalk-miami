export function statusBadgeClass(status: string) {
  switch (status) {
    case "confirmed":
      return "badge-confirmed";
    case "cancelled":
      return "badge-cancelled";
    case "completed":
      return "badge-completed";
    default:
      return "badge-pending";
  }
}
