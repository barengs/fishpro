import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions, FormField, inputCls } from "../../components/FormField";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import {
  captainsService,
  type Captain,
  type CreateCaptainPayload,
} from "../../services/captains";
import { ownersService, type Owner } from "../../services/owners";
import { Loader2 } from "lucide-react";

const emptyCaptain: CreateCaptainPayload = {
  full_name: "",
  license_number: "",
  owner: 0,
  date_of_birth: null,
  contact_info: "",
  email: "",
  phone: "",
  address: "",
  years_of_experience: null,
};

export function CaptainsTab() {
  const [rows, setRows] = useState<Captain[]>([]);
  const [ownersList, setOwnersList] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CreateCaptainPayload>(emptyCaptain);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { open, openModal, closeModal } = useCrudModal();

  const fetchCaptains = async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [captainsData, ownersData] = await Promise.all([
        captainsService.getAll(query),
        ownersService.getAll(),
      ]);
      setRows(captainsData);
      setOwnersList(ownersData);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data nahkoda";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCaptains(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyCaptain,
      owner: ownersList.length > 0 ? ownersList[0].id : 0,
    });
    setErrorMsg(null);
    openModal();
  };

  const handleOpenEdit = (captain: Captain) => {
    setEditingId(captain.id);
    setForm({
      full_name: captain.full_name,
      license_number: captain.license_number,
      owner: captain.owner,
      date_of_birth: captain.date_of_birth || null,
      contact_info: captain.contact_info || "",
      email: captain.email || "",
      phone: captain.phone || "",
      address: captain.address || "",
      years_of_experience: captain.years_of_experience || null,
    });
    setErrorMsg(null);
    openModal();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus nahkoda "${name}"?`)) return;

    try {
      await captainsService.delete(id);
      setToastMsg(`Nahkoda "${name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      fetchCaptains(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus data nahkoda";
      alert(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.license_number.trim() || !form.owner) {
      setErrorMsg(
        "Nama nahkoda, nomor lisensi, dan pemilik kapal wajib diisi.",
      );
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (editingId) {
        await captainsService.update(editingId, form);
        setToastMsg(`Data nahkoda "${form.full_name}" berhasil diperbarui.`);
      } else {
        await captainsService.create(form);
        setToastMsg(`Nahkoda baru "${form.full_name}" berhasil ditambahkan.`);
      }

      setTimeout(() => setToastMsg(null), 3000);
      closeModal();
      fetchCaptains(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan data nahkoda";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const cols: Column<Captain>[] = [
    {
      key: "name",
      header: "Nahkoda / Lisensi",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.full_name}</div>
          <div className="text-xs text-soft tabular-nums">
            {r.license_number}
            {r.ships &&
              r.ships.length > 0 &&
              ` · ${r.ships.map((s) => s.name).join(", ")}`}
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      header: "Pemilik",
      flex: 2,
      render: (r) => (
        <span className="text-sm">{r.owner_name || `Owner #${r.owner}`}</span>
      ),
    },
    {
      key: "exp",
      header: "Pengalaman",
      flex: 1,
      align: "right",
      render: (r) => (
        <span className="text-sm tabular-nums">
          {r.years_of_experience ? `${r.years_of_experience} th` : "—"}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Telepon",
      flex: 2,
      render: (r) => (
        <span className="text-sm tabular-nums">{r.phone || "—"}</span>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onEdit={() => handleOpenEdit(r)}
          onDelete={() => handleDelete(r.id, r.full_name)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        title="Nahkoda"
        desc="Kelola data nahkoda kapal dan lisensi resmi terintegrasi API backend."
        searchPlaceholder="Cari nahkoda / lisensi..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah nahkoda"
        onAdd={handleOpenAdd}
      />

      {toastMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold mb-5 border border-emerald-200 dark:border-emerald-500/20">
          ✓ {toastMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 px-4.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-sm font-semibold mb-5 border border-red-200 dark:border-red-500/20">
          ⚠ {errorMsg}
        </div>
      )}

      <section className="surface-card border rounded-2xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={rows}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data nahkoda terdaftar di server."
        />
      </section>

      <CrudModal
        open={open}
        title={editingId ? "Ubah data nahkoda" : "Tambah nahkoda baru"}
        subtitle={
          editingId
            ? "Perbarui informasi lisensi dan pemilik nahkoda."
            : "Daftarkan nahkoda baru dengan lisensi resmi."
        }
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={
          submitting
            ? "Menyimpan..."
            : editingId
              ? "Perbarui nahkoda"
              : "Simpan nahkoda"
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Nama nahkoda" htmlFor="c-name" required>
            <input
              id="c-name"
              required
              disabled={submitting}
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              placeholder="Contoh: Budi Hartono"
              className={inputCls}
            />
          </FormField>

          <FormField label="Nomor lisensi (unik)" htmlFor="c-lic" required>
            <input
              id="c-lic"
              required
              disabled={submitting}
              value={form.license_number}
              onChange={(e) =>
                setForm({ ...form, license_number: e.target.value })
              }
              placeholder="Contoh: SKN-2024-0012"
              className={inputCls}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Pemilik kapal (Owner)" htmlFor="c-owner" required>
            <select
              id="c-owner"
              required
              disabled={submitting || ownersList.length === 0}
              value={form.owner || ""}
              onChange={(e) =>
                setForm({ ...form, owner: Number(e.target.value) })
              }
              className={inputCls}
            >
              {ownersList.length === 0 ? (
                <option value="">
                  Belum ada pemilik (tambahkan pemilik dulu)
                </option>
              ) : (
                ownersList.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.full_name} (
                    {o.owner_type === "company" ? "PT" : "Pribadi"})
                  </option>
                ))
              )}
            </select>
          </FormField>

          <FormField label="Tanggal lahir (opsional)" htmlFor="c-dob">
            <input
              id="c-dob"
              type="date"
              disabled={submitting}
              value={form.date_of_birth || ""}
              onChange={(e) =>
                setForm({ ...form, date_of_birth: e.target.value || null })
              }
              className={inputCls}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Email (opsional)" htmlFor="c-email">
            <input
              id="c-email"
              type="email"
              disabled={submitting}
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="nahkoda@email.com"
              className={inputCls}
            />
          </FormField>

          <FormField label="Telepon (opsional)" htmlFor="c-phone">
            <input
              id="c-phone"
              disabled={submitting}
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
              className={inputCls}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Kontak tambahan (opsional)" htmlFor="c-contact">
            <input
              id="c-contact"
              disabled={submitting}
              value={form.contact_info || ""}
              onChange={(e) =>
                setForm({ ...form, contact_info: e.target.value })
              }
              placeholder="Radio panggilan / SSB"
              className={inputCls}
            />
          </FormField>

          <FormField label="Pengalaman (tahun)" htmlFor="c-exp">
            <input
              id="c-exp"
              type="number"
              min="0"
              disabled={submitting}
              value={form.years_of_experience ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  years_of_experience: e.target.value
                    ? Number(e.target.value)
                    : null,
                })
              }
              placeholder="Contoh: 5"
              className={inputCls}
            />
          </FormField>
        </div>

        <FormField label="Alamat (opsional)" htmlFor="c-addr">
          <textarea
            id="c-addr"
            rows={2}
            disabled={submitting}
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Alamat domisili nahkoda"
            className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue resize-none"
          />
        </FormField>

        {submitting && (
          <div className="flex items-center justify-center gap-2 text-sm text-fco-blue pt-1">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            <span>Menghubungi server backend...</span>
          </div>
        )}
      </CrudModal>
    </div>
  );
}
