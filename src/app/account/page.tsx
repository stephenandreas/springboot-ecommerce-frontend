"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Camera, MapPin, Heart, Package, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";
import { getProfile, updateProfile, changePassword, uploadAvatar } from "@/lib/account";
import { ApiError } from "@/lib/api";
import type { UserProfile } from "@/types";

export default function AccountPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "" });
  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!token) {
      router.replace("/login?next=/account");
      return;
    }
    getProfile(token).then((p) => {
      setProfile(p);
      setForm({ fullName: p.fullName ?? "", phone: p.phone ?? "" });
    });
  }, [isReady, token, router]);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSavingProfile(true);
    try {
      setProfile(await updateProfile(form, token));
      toast.success("Profil diperbarui");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal");
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSavingPwd(true);
    try {
      await changePassword(pwd, token);
      setPwd({ currentPassword: "", newPassword: "" });
      toast.success("Password diperbarui");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Gagal mengganti password");
    } finally {
      setSavingPwd(false);
    }
  }

  async function onAvatar(file: File) {
    if (!token) return;
    try {
      setProfile(await uploadAvatar(file, token));
      toast.success("Foto diperbarui");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Upload gagal");
    }
  }

  if (!profile) return <div className="mx-auto max-w-2xl px-4 py-6"><Skeleton className="h-80 rounded-2xl" /></div>;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      <h1 className="text-xl font-semibold">Akun Saya</h1>

      {/* Avatar + identity */}
      <div className="flex items-center gap-4 rounded-2xl bg-muted/50 p-5">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-background">
          {profile.avatarUrl ? (
            <Image src={profile.avatarUrl} alt={profile.fullName} fill sizes="80px" className="object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-muted-foreground"><User className="size-8" /></div>
          )}
          <button type="button" onClick={() => avatarRef.current?.click()} className="absolute inset-x-0 bottom-0 grid place-items-center bg-foreground/60 py-1 text-background" aria-label="Ganti foto">
            <Camera className="size-3.5" />
          </button>
          <input ref={avatarRef} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && onAvatar(e.target.files[0])} />
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-1 font-semibold">
            {profile.fullName}
            {profile.emailVerified && <BadgeCheck className="size-4 text-success" />}
          </p>
          <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        <QuickLink href="/orders" icon={Package} label="Pesanan" />
        <QuickLink href="/account/addresses" icon={MapPin} label="Alamat" />
        <QuickLink href="/wishlist" icon={Heart} label="Wishlist" />
      </div>

      {/* Edit profile */}
      <form onSubmit={saveProfile} className="space-y-4 rounded-2xl bg-muted/50 p-5">
        <p className="font-medium">Data Diri</p>
        <div className="space-y-1.5">
          <Label>Nama lengkap</Label>
          <Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
        </div>
        <div className="space-y-1.5">
          <Label>No. telepon</Label>
          <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        </div>
        <Button type="submit" className="rounded-full" disabled={savingProfile}>{savingProfile ? "Menyimpan…" : "Simpan"}</Button>
      </form>

      {/* Change password */}
      <form onSubmit={savePassword} className="space-y-4 rounded-2xl bg-muted/50 p-5">
        <p className="font-medium">Ganti Password</p>
        <div className="space-y-1.5">
          <Label>Password saat ini</Label>
          <Input type="password" value={pwd.currentPassword} onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))} required />
        </div>
        <div className="space-y-1.5">
          <Label>Password baru</Label>
          <Input type="password" value={pwd.newPassword} onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))} required />
        </div>
        <Button type="submit" variant="secondary" className="rounded-full bg-background" disabled={savingPwd}>
          {savingPwd ? "Menyimpan…" : "Ubah Password"}
        </Button>
      </form>
    </div>
  );
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-1.5 rounded-2xl bg-muted/50 py-4 text-sm transition-colors hover:bg-muted">
      <Icon className="size-5" /> {label}
    </Link>
  );
}
