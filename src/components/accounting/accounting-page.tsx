"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  CircleDollarSign,
  CreditCard,
  Download,
  ReceiptText,
  RotateCcw,
  Search,
} from "lucide-react";

import { EmptyState, LoadingState } from "@/components/ui/ui-states";
import {
  accountingSummary,
  accountingTransactions,
  computePaymentMix,
  filterTransactions,
  formatCurrency,
  type AccountingFilters,
  type AccountingTransaction,
  type DatePreset,
  type PaymentMethod,
  type TransactionCategory,
  type TransactionStatus,
} from "@/lib/accounting";
import { cn } from "@/lib/utils";

const methodFilters: Array<{ label: string; value: PaymentMethod | "all" }> = [
  { label: "All", value: "all" },
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "Online", value: "online" },
];

const categoryFilters: Array<{ label: string; value: TransactionCategory | "all" }> = [
  { label: "All", value: "all" },
  { label: "Membership", value: "Membership" },
  { label: "Personal Training", value: "Personal Training" },
  { label: "Day Pass", value: "Day Pass" },
  { label: "Merchandise", value: "Merchandise" },
];

const statusFilters: Array<{ label: string; value: TransactionStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Refunded", value: "refunded" },
  { label: "Void", value: "void" },
];

const datePresets: Array<{ label: string; value: DatePreset }> = [
  { label: "Today", value: "today" },
  { label: "Last 7", value: "last7" },
  { label: "Month", value: "month" },
];

export function AccountingPage() {
  const [filters, setFilters] = useState<AccountingFilters>({
    query: "",
    method: "all",
    category: "all",
    status: "all",
    datePreset: "today",
  });

  const [selected, setSelected] = useState<AccountingTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(
    () => filterTransactions(accountingTransactions, filters),
    [filters]
  );

  const mix = computePaymentMix(accountingSummary);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <p className="text-sm uppercase text-white/60">Accounting</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">Reconcile revenue at a glance</h1>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.35em] text-white/60">
            <ReceiptText className="h-3 w-3" /> {filtered.length} transactions
          </span>
        </div>
        <p className="text-white/70">
          Review daily summaries, payment mix, and recent receipts. Actions like refunds and receipt exports are
          placeholders until backend services are wired.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-4">
        <SummaryCard
          label="Gross revenue"
          value={formatCurrency(accountingSummary.grossRevenue)}
          hint={accountingSummary.reportingLabel}
          icon={<CircleDollarSign className="h-5 w-5" />}
        />
        <SummaryCard
          label="Net revenue"
          value={formatCurrency(accountingSummary.netRevenue)}
          hint="After refunds"
          icon={<BadgeCheck className="h-5 w-5" />}
        />
        <SummaryCard
          label="Refunds"
          value={formatCurrency(accountingSummary.refunds)}
          hint="Processed today"
          icon={<RotateCcw className="h-5 w-5" />}
        />
        <SummaryCard
          label="Payment mix"
          value={`${Math.round(mix.cash * 100)}% cash / ${Math.round(mix.card * 100)}% card`}
          hint={`${Math.round(mix.online * 100)}% online`}
          icon={<CreditCard className="h-5 w-5" />}
        />
      </section>

      <Toolbar filters={filters} onChange={setFilters} />

      {isLoading ? (
        <LoadingState label="Loading transactions..." />
      ) : filtered.length === 0 ? (
        <EmptyState title="No transactions match" description="Adjust filters or clear the search query." />
      ) : (
        <section className="overflow-hidden rounded-3xl border border-white/5 bg-white/5/30 shadow-card backdrop-blur">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-white/5 px-6 py-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">Transaction log</h2>
              <p className="text-sm text-white/60">Deterministic mock receipts for UI review.</p>
            </div>
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/60"
            >
              <Download className="h-4 w-4" /> Export (coming soon)
            </button>
          </div>

          <ul className="divide-y divide-white/5">
            {filtered.map((txn) => (
              <li key={txn.id}>
                <button
                  type="button"
                  onClick={() => setSelected(txn)}
                  className="grid w-full grid-cols-1 gap-3 px-6 py-4 text-left transition hover:bg-white/5 sm:grid-cols-[1.1fr_1fr_auto]"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{txn.payerName}</p>
                    <p className="text-xs text-white/50">{txn.payerEmail}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
                      {txn.category}
                    </span>
                    <span className={cn("rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em]", statusBadge(txn.status))}>
                      {txn.status}
                    </span>
                    <span className="text-white/50">{txn.receiptId}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/50">{txn.timestamp}</span>
                    <span className="text-sm font-semibold text-white">{formatCurrency(txn.total)}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <TransactionDrawer transaction={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Toolbar({
  filters,
  onChange,
}: {
  filters: AccountingFilters;
  onChange: (next: AccountingFilters) => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5/40 p-5 shadow-card backdrop-blur">
      <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white/70">
        <Search className="h-4 w-4" />
        <input
          type="search"
          value={filters.query}
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="Search by payer, email, or receipt"
          className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
        />
      </label>

      <div className="flex flex-wrap gap-3">
        {datePresets.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange({ ...filters, datePreset: preset.value })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.3em] transition",
              filters.datePreset === preset.value
                ? "border-primary bg-primary/20 text-white"
                : "border-white/10 bg-transparent text-white/60 hover:border-white/30"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {methodFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange({ ...filters, method: filter.value })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.3em] transition",
              filters.method === filter.value
                ? "border-white bg-white/20 text-black"
                : "border-white/10 bg-transparent text-white/60 hover:border-white/30"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {categoryFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange({ ...filters, category: filter.value })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.3em] transition",
              filters.category === filter.value
                ? "border-white bg-white/20 text-black"
                : "border-white/10 bg-transparent text-white/60 hover:border-white/30"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange({ ...filters, status: filter.value })}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.3em] transition",
              filters.status === filter.value
                ? "border-white bg-white/20 text-black"
                : "border-white/10 bg-transparent text-white/60 hover:border-white/30"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-3xl border border-white/5 bg-white/5/30 p-5 shadow-card backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/70">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">{hint}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white/70">{icon}</div>
      </div>
    </article>
  );
}

function TransactionDrawer({
  transaction,
  onClose,
}: {
  transaction: AccountingTransaction | null;
  onClose: () => void;
}) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden />
      <aside className="relative ml-auto flex h-full w-full max-w-md flex-col bg-canvas-subtle p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">Receipt</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{transaction.receiptId}</h2>
            <p className="text-white/60">{transaction.timestamp}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60"
          >
            Close
          </button>
        </div>

        <div className="mt-6 space-y-5 text-sm text-white/70">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Payer</p>
            <p className="mt-2 text-white">{transaction.payerName}</p>
            <p className="text-white/60">{transaction.payerEmail}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Payment</p>
            <p className="mt-2 text-white">Method: {transaction.method}</p>
            <p className="text-white/60">Status: {transaction.status}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Line items</p>
            <ul className="mt-3 space-y-2 text-white/80">
              {transaction.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between">
                  <span>
                    {item.label} × {item.quantity}
                  </span>
                  <span className="text-white">{formatCurrency(item.quantity * item.unitAmount)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-white/70">
              <div className="flex items-center justify-between">
                <dt>Subtotal</dt>
                <dd>{formatCurrency(transaction.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Discount</dt>
                <dd>-{formatCurrency(transaction.discount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Tax</dt>
                <dd>{formatCurrency(transaction.tax)}</dd>
              </div>
              <div className="flex items-center justify-between text-white">
                <dt className="font-semibold">Total</dt>
                <dd className="font-semibold">{formatCurrency(transaction.total)}</dd>
              </div>
              {transaction.refundedAmount > 0 ? (
                <div className="flex items-center justify-between text-rose-200">
                  <dt>Refunded</dt>
                  <dd>{formatCurrency(transaction.refundedAmount)}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white/60"
          >
            <RotateCcw className="h-4 w-4" /> Issue refund (coming soon)
          </button>
          <button
            type="button"
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white/60"
          >
            <Download className="h-4 w-4" /> Export receipt (coming soon)
          </button>
        </div>
      </aside>
    </div>
  );
}

function statusBadge(status: TransactionStatus) {
  if (status === "completed") return "border border-emerald-400/40 bg-emerald-400/10 text-emerald-100";
  if (status === "refunded") return "border border-amber-300/40 bg-amber-300/10 text-amber-100";
  return "border border-white/10 bg-white/5 text-white/60";
}
