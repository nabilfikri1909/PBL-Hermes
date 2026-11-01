import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { RoleSelect } from "@/components/admin-forms";
import { Avatar, Badge } from "@/components/ui";
import { requireStaffPage } from "@/lib/auth";
import { getStore } from "@/lib/store";
import { formatDate, ROLE_META } from "@/lib/utils";

export const metadata: Metadata = { title: "Peran & Akun" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const user = await requireStaffPage("/admin/admins");
  const users = getStore().users;
  const isSuper = user.role === "super_admin";

  return (
    <AppShell
      user={{ fullName: user.fullName, email: user.email, role: user.role, department: user.department }}
      area="admin"
      title="Peran & akun pengelola"
      subtitle={isSuper ? "Super Admin dapat mengubah peran pengguna. Setiap perubahan tercatat pada log audit." : "Hanya Super Admin yang dapat mengubah peran pengguna."}
    >
      <div className="rounded-card-lg bg-white shadow-[0_16px_40px_-38px_rgb(13_26_21_/_0.5)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left text-[0.8125rem]">
            <thead>
              <tr className="border-b border-hairline bg-canvas-soft text-[0.6875rem] uppercase tracking-[0.07em] text-ink-mute">
                <th className="px-5 py-3 font-semibold">Pengguna</th>
                <th className="px-4 py-3 font-semibold">NIM / NIP</th>
                <th className="px-4 py-3 font-semibold">Unit</th>
                <th className="px-4 py-3 font-semibold">Peran</th>
                <th className="px-4 py-3 font-semibold">Terdaftar</th>
                <th className="px-4 py-3 font-semibold">Ubah peran</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row) => (
                <tr key={row.id} className="border-b border-hairline-soft last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={row.fullName} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{row.fullName}</p>
                        <p className="truncate text-[0.6875rem] text-ink-mute">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 tabular text-ink-soft">{row.nim ?? "—"}</td>
                  <td className="px-4 py-3.5 text-ink-soft">{row.department}</td>
                  <td className="px-4 py-3.5">
                    <Badge tone={row.role.includes("admin") ? "forest" : "neutral"}>{ROLE_META[row.role].label}</Badge>
                  </td>
                  <td className="px-4 py-3.5 text-ink-soft">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3.5">
                    <RoleSelect userId={row.id} role={row.role} disabled={!isSuper || row.id === user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 text-[0.75rem] text-ink-mute">
        Akun demo memiliki kata sandi bawaan: <span className="font-semibold text-ink-soft">demo123</span> untuk mahasiswa/dosen dan{" "}
        <span className="font-semibold text-ink-soft">admin123</span> untuk staf KUI.
      </p>
    </AppShell>
  );
}