"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, LogIn, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Btn, FieldLabel, inputClass, selectClass } from "./ui";
import { cn } from "@/lib/utils";

const DEMO_ROLES: Array<{ role: string; label: string; hint: string }> = [
  { role: "student", label: "Mahasiswa", hint: "Nabil · usr_1" },
  { role: "lecturer", label: "Dosen", hint: "Dr. Bagus" },
  { role: "foreign", label: "Mahasiswa asing", hint: "Emma, Lund" },
  { role: "admin", label: "Verifikator KUI", hint: "Rina" },
  { role: "super_admin", label: "Super Admin", hint: "Hendra" }
];

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading("form");
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const payload = (await response.json()) as { ok: boolean; redirect?: string; error?: string };
      if (!payload.ok) {
        setError(payload.error ?? "Gagal masuk.");
        setLoading(null);
        return;
      }
      toast.success("Berhasil masuk.");
      router.push(next || payload.redirect || "/dashboard");
      router.refresh();
    } catch {
      setError("Koneksi gagal. Coba lagi.");
      setLoading(null);
    }
  };

  const demo = async (role: string) => {
    setLoading(role);
    setError(null);
    try {
      const response = await fetch("/api/auth/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      const payload = (await response.json()) as { ok: boolean; redirect?: string; error?: string };
      if (!payload.ok) {
        setError(payload.error ?? "Akun demo tidak tersedia.");
        setLoading(null);
        return;
      }
      toast.success(`Masuk sebagai ${DEMO_ROLES.find((r) => r.role === role)?.label ?? role}.`);
      router.push(next || payload.redirect || "/dashboard");
      router.refresh();
    } catch {
      setError("Koneksi gagal. Coba lagi.");
      setLoading(null);
    }
  };

  return (
    <div>
      <form onSubmit={signIn} className="space-y-4">
        <div>
          <FieldLabel required>Email</FieldLabel>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@student.pnj.ac.id" className={inputClass} required />
        </div>
        <div>
          <FieldLabel required>Kata sandi</FieldLabel>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required />
        </div>

        {error ? <p className="rounded-xl bg-stop-50 px-3.5 py-2.5 text-[0.8125rem] font-medium text-stop-700">{error}</p> : null}

        <Btn type="submit" className="w-full" size="lg" disabled={loading === "form"}>
          {loading === "form" ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
          Masuk ke portal
        </Btn>
      </form>

      <div className="mt-7">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-hairline" />
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-mute">Masuk cepat akun demo</span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {DEMO_ROLES.map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => demo(item.role)}
              disabled={Boolean(loading)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-xl border border-hairline bg-white px-3.5 py-2.5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-forest-300 hover:shadow-[0_12px_26px_-20px_rgb(13_26_21_/_0.5)]",
                item.role === "super_admin" && "sm:col-span-2"
              )}
            >
              <span className="min-w-0">
                <span className="block truncate text-[0.8125rem] font-semibold text-ink">{item.label}</span>
                <span className="block truncate text-[0.6875rem] text-ink-mute">{item.hint}</span>
              </span>
              {loading === item.role ? <Loader2 className="size-4 animate-spin text-forest-700" /> : <ArrowRight className="size-3.5 text-ink-mute" />}
            </button>
          ))}
        </div>
        <p className="mt-3 text-[0.75rem] text-ink-mute">
          Akun demo memakai data contoh. Kata sandi akun demo: <span className="font-semibold text-ink-soft">demo123</span> (mahasiswa) atau{" "}
          <span className="font-semibold text-ink-soft">admin123</span> (staf KUI).
        </p>
      </div>

      <p className="mt-6 text-[0.8125rem] text-ink-mute">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-forest-800 underline-grow">
          Daftar sebagai mahasiswa
        </Link>
      </p>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", nim: "", department: "Teknik Informatika", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const payload = (await response.json()) as { ok: boolean; redirect?: string; error?: string };
      if (!payload.ok) {
        setError(payload.error ?? "Pendaftaran gagal.");
        setLoading(false);
        return;
      }
      toast.success("Akun dibuat. Lengkapi profil Anda.");
      router.push(payload.redirect ?? "/dashboard");
      router.refresh();
    } catch {
      setError("Koneksi gagal. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <FieldLabel required>Nama lengkap</FieldLabel>
        <input className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Nama sesuai KTM" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel required>Email kampus</FieldLabel>
          <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama@student.pnj.ac.id" required />
        </div>
        <div>
          <FieldLabel>NIM</FieldLabel>
          <input className={inputClass} value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} placeholder="22074210xx" />
        </div>
        <div>
          <FieldLabel>Jurusan / program studi</FieldLabel>
          <select className={selectClass} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            {["Teknik Informatika", "Teknik Mesin", "Teknik Elektro", "Teknik Sipil", "Administrasi Bisnis", "Akuntansi", "Teknik Grafika"].map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Nomor WhatsApp</FieldLabel>
          <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+62 812 …" />
        </div>
      </div>
      <div>
        <FieldLabel required>Kata sandi</FieldLabel>
        <input type="password" className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimal 6 karakter" required minLength={6} />
      </div>

      {error ? <p className="rounded-xl bg-stop-50 px-3.5 py-2.5 text-[0.8125rem] font-medium text-stop-700">{error}</p> : null}

      <Btn type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
        Buat akun
      </Btn>
      <p className="text-[0.75rem] text-ink-mute">
        Dengan mendaftar Anda menyetujui{" "}
        <Link href="/terms" className="font-semibold text-forest-800">
          syarat & ketentuan
        </Link>{" "}
        serta{" "}
        <Link href="/privacy" className="font-semibold text-forest-800">
          kebijakan privasi
        </Link>
        .
      </p>
    </form>
  );
}

export function OnboardingForm({
  initial
}: {
  initial: { nim: string | null; department: string; phone: string; fullName: string };
}) {
  const router = useRouter();
  const [form, setForm] = useState({ nim: initial.nim ?? "", department: initial.department === "Belum diisi" ? "Teknik Informatika" : initial.department, phone: initial.phone });
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "profile-save", ...form })
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!payload.ok) {
        toast.error(payload.error ?? "Gagal menyimpan profil.");
        setLoading(false);
        return;
      }
      toast.success("Profil lengkap. Selamat menggunakan portal.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Koneksi gagal.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="rounded-xl bg-canvas-soft px-3.5 py-2.5 text-[0.8125rem] text-ink-soft">
        Hai <span className="font-semibold text-ink">{initial.fullName}</span> — lengkapi dua data ini agar surat rekomendasi tercetak benar.
      </div>
      <div>
        <FieldLabel required>NIM / NIP</FieldLabel>
        <input className={inputClass} value={form.nim} onChange={(e) => setForm({ ...form, nim: e.target.value })} placeholder="22074210xx" required />
      </div>
      <div>
        <FieldLabel required>Jurusan / unit kerja</FieldLabel>
        <select className={selectClass} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
          {["Teknik Informatika", "Teknik Mesin", "Teknik Elektro", "Teknik Sipil", "Administrasi Bisnis", "Akuntansi", "Teknik Grafika", "Kantor Urusan Internasional"].map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel>Nomor WhatsApp</FieldLabel>
        <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+62 812 …" />
      </div>
      <Btn type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        Simpan profil
      </Btn>
    </form>
  );
}