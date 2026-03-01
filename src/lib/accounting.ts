export type PaymentMethod = "cash" | "card" | "online";
export type TransactionCategory = "Membership" | "Personal Training" | "Day Pass" | "Merchandise";
export type TransactionStatus = "completed" | "refunded" | "void";

export type AccountingLineItem = {
  id: string;
  label: string;
  quantity: number;
  unitAmount: number;
};

export type AccountingTransaction = {
  id: string;
  receiptId: string;
  timestamp: string;
  payerName: string;
  payerEmail: string;
  category: TransactionCategory;
  method: PaymentMethod;
  status: TransactionStatus;
  items: AccountingLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  refundedAmount: number;
};

export type AccountingSummary = {
  reportingLabel: string;
  grossRevenue: number;
  netRevenue: number;
  refunds: number;
  cash: number;
  card: number;
  online: number;
};

export const accountingSummary: AccountingSummary = {
  reportingLabel: "Today · Feb 09",
  grossRevenue: 48560,
  netRevenue: 46120,
  refunds: 2440,
  cash: 12840,
  card: 31220,
  online: 4500,
};

export const accountingTransactions: AccountingTransaction[] = [
  {
    id: "txn-001",
    receiptId: "RCPT-10482",
    timestamp: "09:12 AM",
    payerName: "Andre Lin",
    payerEmail: "andre.lin@email.com",
    category: "Membership",
    method: "card",
    status: "completed",
    items: [{ id: "li-001", label: "Premium monthly", quantity: 1, unitAmount: 3200 }],
    subtotal: 3200,
    discount: 0,
    tax: 0,
    total: 3200,
    refundedAmount: 0,
  },
  {
    id: "txn-002",
    receiptId: "RCPT-10483",
    timestamp: "09:26 AM",
    payerName: "Noelle Park",
    payerEmail: "noelle.park@email.com",
    category: "Personal Training",
    method: "online",
    status: "completed",
    items: [
      { id: "li-002", label: "PT session pack (5)", quantity: 1, unitAmount: 7500 },
      { id: "li-003", label: "Recovery add-on", quantity: 1, unitAmount: 900 },
    ],
    subtotal: 8400,
    discount: 400,
    tax: 0,
    total: 8000,
    refundedAmount: 0,
  },
  {
    id: "txn-003",
    receiptId: "RCPT-10484",
    timestamp: "10:03 AM",
    payerName: "Jamie Velasco",
    payerEmail: "jamie.velasco@email.com",
    category: "Day Pass",
    method: "cash",
    status: "completed",
    items: [{ id: "li-004", label: "Day pass", quantity: 1, unitAmount: 450 }],
    subtotal: 450,
    discount: 0,
    tax: 0,
    total: 450,
    refundedAmount: 0,
  },
  {
    id: "txn-004",
    receiptId: "RCPT-10485",
    timestamp: "10:38 AM",
    payerName: "Hana Cruz",
    payerEmail: "hana.cruz@email.com",
    category: "Merchandise",
    method: "card",
    status: "refunded",
    items: [
      { id: "li-005", label: "Elevate shaker", quantity: 1, unitAmount: 350 },
      { id: "li-006", label: "Protein bar", quantity: 2, unitAmount: 85 },
    ],
    subtotal: 520,
    discount: 0,
    tax: 0,
    total: 520,
    refundedAmount: 520,
  },
  {
    id: "txn-005",
    receiptId: "RCPT-10486",
    timestamp: "11:11 AM",
    payerName: "Maya Lopez",
    payerEmail: "maya.lopez@email.com",
    category: "Membership",
    method: "card",
    status: "completed",
    items: [{ id: "li-007", label: "Student monthly", quantity: 1, unitAmount: 2200 }],
    subtotal: 2200,
    discount: 0,
    tax: 0,
    total: 2200,
    refundedAmount: 0,
  },
  {
    id: "txn-006",
    receiptId: "RCPT-10487",
    timestamp: "11:44 AM",
    payerName: "Theo Alvarez",
    payerEmail: "theo.alvarez@email.com",
    category: "Personal Training",
    method: "cash",
    status: "completed",
    items: [{ id: "li-008", label: "PT single session", quantity: 1, unitAmount: 1800 }],
    subtotal: 1800,
    discount: 0,
    tax: 0,
    total: 1800,
    refundedAmount: 0,
  },
];

export type DatePreset = "today" | "last7" | "month";

export type AccountingFilters = {
  query: string;
  method: PaymentMethod | "all";
  category: TransactionCategory | "all";
  status: TransactionStatus | "all";
  datePreset: DatePreset;
};

export function filterTransactions(list: AccountingTransaction[], filters: AccountingFilters) {
  const normalizedQuery = filters.query.trim().toLowerCase();

  return list.filter((txn) => {
    const matchesQuery = normalizedQuery
      ? txn.payerName.toLowerCase().includes(normalizedQuery) ||
        txn.payerEmail.toLowerCase().includes(normalizedQuery) ||
        txn.receiptId.toLowerCase().includes(normalizedQuery)
      : true;

    const matchesMethod = filters.method === "all" ? true : txn.method === filters.method;
    const matchesCategory = filters.category === "all" ? true : txn.category === filters.category;
    const matchesStatus = filters.status === "all" ? true : txn.status === filters.status;

    return matchesQuery && matchesMethod && matchesCategory && matchesStatus;
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function computePaymentMix(summary: AccountingSummary) {
  const total = summary.cash + summary.card + summary.online;
  if (total === 0) {
    return { cash: 0, card: 0, online: 0 };
  }

  return {
    cash: summary.cash / total,
    card: summary.card / total,
    online: summary.online / total,
  };
}
