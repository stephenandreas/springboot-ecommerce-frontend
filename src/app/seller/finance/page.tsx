"use client";

import { useCallback, useEffect, useState } from "react";
import { Wallet, Plus, Trash2, Star, Landmark } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import {
  getSellerBalance, getBankAccounts, createBankAccount, deleteBankAccount, setDefaultBankAccount,
  requestWithdrawal, getWithdrawals, type BankAccount, type Withdrawal,
} from "@/lib/seller";
import { formatIDR } from "@/lib/format";
import { ApiError } from "@/lib/api";

export default function FinancePage() {
  const { token } = useAuth();
  const [balance, setBalance] = useState<number | null>(null);
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [newBank, setNewBank] = useState({ bankName: "", accountNumber: "", accountHolder: "" });
  const [wd, setWd] = useState({ amount: "", bankId: "" });
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    if (!token) return;
    getSellerBalance(token).then((b) => setBalance(Number(b.balance ?? b.available ?? 0))).catch(() => setBalance(0));
    getBankAccounts(token).then(setBanks).catch(() => setBanks([]));
    getWithdrawals(token).then(setWithdrawals).catch(() => setWithdrawals([]));
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function act(fn: () => Promise<unknown>, msg: string) {
    if (!token) return;
    setBusy(true);
    try { await fn(); toast.success(msg); load(); }
    catch (err) { toast.error(err instanceof ApiError ? err.message : "Gagal"); }
    finally { setBusy(false); }
  }

  async function addBank(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    await act(() => createBankAccount(newBank, token), "Rekening ditambahkan");
    setNewBank({ bankName: "", accountNumber: "", accountHolder: "" });
  }

  async function withdraw(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    const bank = banks.find((b) => b.id === wd.bankId);
    if (!bank) return toast.error("Pilih rekening");
    await act(() => requestWithdrawal({ amount: Number(wd.amount), bankName: bank.bankName, bankAccount: bank.accountNumber }, token), "Penarikan diajukan");
    setWd({ amount: "", bankId: "" });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Keuangan</h1>

      <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
        <div className="flex items-center gap-2 text-sm opacity-80"><Wallet className="size-4" /> Saldo</div>
        {balance === null ? <Skeleton className="mt-2 h-8 w-40 bg-primary-foreground/20" /> : <p className="mt-1 text-3xl font-bold">{formatIDR(balance)}</p>}
      </div>

      {/* Bank accounts */}
      <section className="space-y-3 rounded-2xl bg-muted/50 p-5">
        <p className="font-medium">Rekening Bank</p>
        {banks.map((b) => (
          <div key={b.id} className="flex items-center gap-3 rounded-xl bg-background p-3">
            <Landmark className="size-5 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{b.bankName} · {b.accountNumber}</p>
              <p className="text-xs text-muted-foreground">{b.accountHolder}</p>
            </div>
            {b.isDefault ? <Badge>Utama</Badge> : (
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => act(() => setDefaultBankAccount(b.id, token!), "Rekening utama diubah")}>
                <Star className="size-3.5" /> Utama
              </Button>
            )}
            <Button variant="ghost" size="icon" className="size-7 text-destructive" aria-label="Hapus" onClick={() => act(() => deleteBankAccount(b.id, token!), "Rekening dihapus")}><Trash2 className="size-4" /></Button>
          </div>
        ))}
        <form onSubmit={addBank} className="grid gap-3 rounded-xl bg-background p-3 sm:grid-cols-3">
          <Input placeholder="Bank (BCA)" value={newBank.bankName} onChange={(e) => setNewBank((b) => ({ ...b, bankName: e.target.value }))} required />
          <Input placeholder="No. rekening" value={newBank.accountNumber} onChange={(e) => setNewBank((b) => ({ ...b, accountNumber: e.target.value }))} required />
          <Input placeholder="Atas nama" value={newBank.accountHolder} onChange={(e) => setNewBank((b) => ({ ...b, accountHolder: e.target.value }))} required />
          <Button type="submit" size="sm" className="rounded-full sm:col-span-3" disabled={busy}><Plus className="size-4" /> Tambah Rekening</Button>
        </form>
      </section>

      {/* Withdraw */}
      <form onSubmit={withdraw} className="space-y-4 rounded-2xl bg-muted/50 p-5">
        <p className="font-medium">Tarik Saldo</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Jumlah</Label>
            <Input type="number" value={wd.amount} onChange={(e) => setWd((w) => ({ ...w, amount: e.target.value }))} required />
          </div>
          <div className="space-y-1.5">
            <Label>Rekening tujuan</Label>
            <Select value={wd.bankId} onValueChange={(v) => setWd((w) => ({ ...w, bankId: v ?? "" }))}>
              <SelectTrigger><SelectValue placeholder="Pilih rekening" /></SelectTrigger>
              <SelectContent>{banks.map((b) => <SelectItem key={b.id} value={b.id}>{b.bankName} · {b.accountNumber}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="rounded-full" disabled={busy || banks.length === 0}>Ajukan Penarikan</Button>
      </form>

      {/* History */}
      <section className="space-y-2">
        <p className="font-medium">Riwayat Penarikan</p>
        {withdrawals.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada penarikan.</p>
        ) : withdrawals.map((w) => (
          <div key={w.id} className="flex items-center justify-between rounded-xl bg-muted/50 p-3 text-sm">
            <span className="font-medium">{formatIDR(w.amount)}</span>
            <Badge variant="secondary">{w.status}</Badge>
          </div>
        ))}
      </section>
    </div>
  );
}
