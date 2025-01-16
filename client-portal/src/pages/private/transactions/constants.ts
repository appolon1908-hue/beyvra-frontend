export const statusAndTypesList: { value: string; label: string; type: string }[] = [
  { value: "P", label: "PENDING", type: "status" },
  { value: "S", label: "SUCCESSFUL", type: "status" },
  { value: "F", label: "FAILED", type: "status" },
  { value: "R", label: "REFUNDED", type: "status" },

  { value: "D", label: "DEPOSIT", type: "type" },
  { value: "W", label: "WITHDRAWAL", type: "type" },
  { value: "TD", label: "TRADE", type: "type" },
  { value: "TN", label: "TRANSFER", type: "type" },
];
