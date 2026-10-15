import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions, FormField, inputCls } from "../../components/FormField";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import {
  ownersService,
  type Owner,
  type CreateOwnerPayload,
} from "../../services/owners";
import { Loader2 } from "lucide-react";

const emptyOwner: CreateOwnerPayload = {
  full_name: "",
  owner_type: "individual",
  contact_info: "",
  email: "",
  phone: "",
  address: "",
};

export function OwnersTab() {
  const [rows, setRows] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CreateOwnerPayload>(emptyOwner);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const { open, openModal, closeModal } = useCrudModal();

  const fetchOwners = async (query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await ownersService.getAll(query);
      setRows(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal memuat data pemilik";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOwners(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(emptyOwner);
    setErrorMsg(null);
    openModal();
  };

  const handleOpenEdit = (owner: Owner) => {
    setEditingId(owner.id);
    setForm({
      full_name: owner.full_name,
      owner_type:
        (owner.owner_type as "individual" | "company") || "individual",
      contact_info: owner.contact_info || "",
      email: owner.email || "",
      phone: owner.phone || "",
      address: owner.address || "",
    });
    setErrorMsg(null);
    openModal();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus pemilik "${name}"?`)) return;

    try {
      await ownersService.delete(id);
      setToastMsg(`Pemilik "${name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      fetchOwners(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus data pemilik";
      alert(msg);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      if (editingId) {
        await ownersService.update(editingId, form);
        setToastMsg(`Data pemilik "${form.full_name}" berhasil diperbarui.`);
      } else {
        await ownersService.create(form);
        setToastMsg(`Pemilik baru "${form.full_name}" berhasil didaftarkan.`);
      }

      setTimeout(() => setToastMsg(null), 3000);
      closeModal();
      fetchOwners(search);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan data pemilik";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const cols: Column<Owner>[] = [
    {
      key: "name",
      header: "Nama / Tipe",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.full_name}</div>
          <div className="text-xs text-soft">
            {r.owner_type === "company" ? "Perusahaan" : "Perorangan"}
            {r.ships && r.ships.length > 0 && ` · ${r.ships.length} Kapal`}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      flex: 2,
      render: (r) => <span className="text-sm">{r.email || "—"}</span>,
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
      key: "address",
      header: "Alamat",
      flex: 2,
      render: (r) => (
        <span className="text-xs text-soft truncate max-w-40 block">
          {r.address || "—"}
        </span>
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
        title="Pemilik"
        desc="Kelola data pemilik kapal (perorangan atau perusahaan) terintegrasi API backend."
        searchPlaceholder="Cari pemilik kapal..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Tambah pemilik"
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
          emptyText="Belum ada data pemilik terdaftar di server."
        />
      </section>

      <CrudModal
        open={open}
        title={editingId ? "Ubah data pemilik" : "Tambah pemilik baru"}
        subtitle={
          editingId
            ? "Perbarui informasi profil pemilik kapal."
            : "Daftarkan pemilik kapal perorangan atau perusahaan."
        }
        onClose={closeModal}
        onSubmit={handleSubmit}
        submitLabel={
          submitting
            ? "Menyimpan..."
            : editingId
              ? "Perbarui pemilik"
              : "Simpan pemilik"
        }
      >
        <FormField label="Nama lengkap / Perusahaan" htmlFor="o-name" required>
          <input
            id="o-name"
            required
            disabled={submitting}
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Contoh: PT Samudra Makmur atau H. Ahmad"
            className={inputCls}
          />
        </FormField>

        <FormField label="Tipe pemilik" htmlFor="o-type" required>
          <select
            id="o-type"
            disabled={submitting}
            value={form.owner_type}
            onChange={(e) =>
              setForm({
                ...form,
                owner_type: e.target.value as "individual" | "company",
              })
            }
            className={inputCls}
          >
            <option value="individual">Perorangan (Individual)</option>
            <option value="company">Perusahaan (Company)</option>
          </select>
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Email" htmlFor="o-email">
            <input
              id="o-email"
              type="email"
              disabled={submitting}
              value={form.email || ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="nama@email.com"
              className={inputCls}
            />
          </FormField>

          <FormField label="Telepon" htmlFor="o-phone">
            <input
              id="o-phone"
              disabled={submitting}
              value={form.phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="08xxxxxxxxxx"
              className={inputCls}
            />
          </FormField>
        </div>

        <FormField label="Kontak tambahan" htmlFor="o-contact">
          <input
            id="o-contact"
            disabled={submitting}
            value={form.contact_info || ""}
            onChange={(e) => setForm({ ...form, contact_info: e.target.value })}
            placeholder="WhatsApp / Telepon kantor alternatif"
            className={inputCls}
          />
        </FormField>

        <FormField label="Alamat" htmlFor="o-addr">
          <textarea
            id="o-addr"
            rows={2}
            disabled={submitting}
            value={form.address || ""}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Alamat kantor / domisili pemilik"
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
