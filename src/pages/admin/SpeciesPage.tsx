import { useEffect, useState } from "react";
import { PageToolbar } from "../../components/PageToolbar";
import { DataTable, type Column } from "../../components/DataTable";
import { CrudActions, FormField, inputCls } from "../../components/FormField";
import { CrudModal } from "../../components/CrudModal";
import { useCrudModal } from "../../components/useCrudModal";
import {
  fishService,
  fishSpeciesService,
  type CreateFishPayload,
  type CreateFishSpeciesPayload,
  type Fish,
  type FishSpecies,
} from "../../services/fish";
import { Download, FileUp, Loader2 } from "lucide-react";

type SpeciesTab = "species" | "individual";

export function SpeciesPage() {
  const [tab, setTab] = useState<SpeciesTab>("species");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Species state
  const [speciesList, setSpeciesList] = useState<FishSpecies[]>([]);
  const [speciesForm, setSpeciesForm] = useState<CreateFishSpeciesPayload>({
    name: "",
    scientific_name: "",
    description: "",
  });
  const [editingSpeciesId, setEditingSpeciesId] = useState<number | null>(null);
  const speciesModal = useCrudModal();

  // Fish (individual) state
  const [fishList, setFishList] = useState<Fish[]>([]);
  const [fishForm, setFishForm] = useState<CreateFishPayload>({
    species: 0,
    name: "",
    weight: "",
    notes: "",
  });
  const [editingFishId, setEditingFishId] = useState<number | null>(null);
  const fishModal = useCrudModal();

  // CSV Import Modal state
  const importModal = useCrudModal();
  const [csvText, setCsvText] = useState("");
  const [clearExisting, setClearExisting] = useState(false);
  const [importing, setImporting] = useState(false);

  const fetchData = async (currentTab: SpeciesTab, query?: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (currentTab === "species") {
        const data = await fishSpeciesService.getAll(query);
        setSpeciesList(data);
      } else {
        const [fishData, spData] = await Promise.all([
          fishService.getAll(),
          fishSpeciesService.getAll(),
        ]);
        setFishList(fishData);
        setSpeciesList(spData);
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memuat data ikan",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(tab, search);
    }, 300);
    return () => clearTimeout(timer);
  }, [tab, search]);

  // ================= Handlers =================

  const handleOpenAddSpecies = () => {
    setEditingSpeciesId(null);
    setSpeciesForm({ name: "", scientific_name: "", description: "" });
    speciesModal.openModal();
  };

  const handleOpenEditSpecies = (sp: FishSpecies) => {
    setEditingSpeciesId(sp.id);
    setSpeciesForm({
      name: sp.name,
      scientific_name: sp.scientific_name || "",
      description: sp.description || "",
    });
    speciesModal.openModal();
  };

  const handleDeleteSpecies = async (id: number, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus spesies "${name}"?`)) return;
    try {
      await fishSpeciesService.delete(id);
      setToastMsg(`Spesies "${name}" berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      fetchData("species", search);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus spesies");
    }
  };

  const handleSpeciesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!speciesForm.name.trim()) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      if (editingSpeciesId) {
        await fishSpeciesService.update(editingSpeciesId, speciesForm);
        setToastMsg(`Spesies "${speciesForm.name}" berhasil diperbarui.`);
      } else {
        await fishSpeciesService.create(speciesForm);
        setToastMsg(`Spesies baru "${speciesForm.name}" berhasil ditambahkan.`);
      }
      setTimeout(() => setToastMsg(null), 3000);
      speciesModal.closeModal();
      fetchData("species", search);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan spesies",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Individual Fish Handlers
  const handleOpenAddFish = () => {
    setEditingFishId(null);
    setFishForm({
      species: speciesList.length > 0 ? speciesList[0].id : 0,
      name: "",
      weight: "",
      notes: "",
    });
    fishModal.openModal();
  };

  const handleOpenEditFish = (f: Fish) => {
    setEditingFishId(f.id);
    setFishForm({
      species: f.species,
      name: f.name || "",
      weight: f.weight ?? "",
      notes: f.notes || "",
    });
    fishModal.openModal();
  };

  const handleDeleteFish = async (id: number, name?: string | null) => {
    const label = name || `#${id}`;
    if (!window.confirm(`Yakin ingin menghapus data ikan ${label}?`)) return;
    try {
      await fishService.delete(id);
      setToastMsg(`Data ikan ${label} berhasil dihapus.`);
      setTimeout(() => setToastMsg(null), 3000);
      fetchData("individual");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus data ikan");
    }
  };

  const handleFishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fishForm.species) {
      setErrorMsg("Harap pilih jenis spesies ikan.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload: CreateFishPayload = {
        ...fishForm,
        weight: fishForm.weight ? parseFloat(String(fishForm.weight)) : null,
      };
      if (editingFishId) {
        await fishService.update(editingFishId, payload);
        setToastMsg("Data ikan berhasil diperbarui.");
      } else {
        await fishService.create(payload);
        setToastMsg("Data ikan individu baru berhasil ditambahkan.");
      }
      setTimeout(() => setToastMsg(null), 3000);
      fishModal.closeModal();
      fetchData("individual");
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menyimpan data ikan",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // CSV Import Submit
  const handleCsvImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    setImporting(true);
    setErrorMsg(null);
    try {
      if (tab === "species") {
        const res = await fishSpeciesService.importSpecies(
          csvText,
          clearExisting,
        );
        setToastMsg(
          `Impor selesai: ${res.created} dibuat, ${res.updated} diperbarui, ${res.errors} kesalahan.`,
        );
      } else {
        const res = await fishService.importFish(csvText, clearExisting);
        setToastMsg(
          `Impor selesai: ${res.created} dibuat, ${res.updated} diperbarui, ${res.errors} kesalahan.`,
        );
      }
      setTimeout(() => setToastMsg(null), 4000);
      importModal.closeModal();
      setCsvText("");
      fetchData(tab);
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mengimpor data CSV",
      );
    } finally {
      setImporting(false);
    }
  };

  // ================= Columns =================

  const speciesCols: Column<FishSpecies>[] = [
    {
      key: "name",
      header: "Nama Ikan / Ilmiah",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">{r.name}</div>
          <div className="text-xs text-soft italic">
            {r.scientific_name || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "desc",
      header: "Deskripsi / Karakteristik",
      flex: 4,
      render: (r) => (
        <span className="text-sm text-soft">{r.description || "—"}</span>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onEdit={() => handleOpenEditSpecies(r)}
          onDelete={() => handleDeleteSpecies(r.id, r.name)}
        />
      ),
    },
  ];

  const fishCols: Column<Fish>[] = [
    {
      key: "name",
      header: "Nama Ikan / Spesies",
      flex: 3,
      render: (r) => (
        <div>
          <div className="text-sm font-semibold">
            {r.name || "Ikan Tanpa Label"}
          </div>
          <div className="text-xs text-fco-blue font-medium">
            {r.species_name || `Spesies #${r.species}`}
          </div>
        </div>
      ),
    },
    {
      key: "weight",
      header: "Berat",
      flex: 2,
      align: "right",
      render: (r) => (
        <span className="text-sm tabular-nums font-semibold">
          {r.weight ? `${r.weight} kg` : "—"}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Catatan",
      flex: 3,
      render: (r) => (
        <span className="text-xs text-soft">{r.notes || "—"}</span>
      ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onEdit={() => handleOpenEditFish(r)}
          onDelete={() => handleDeleteFish(r.id, r.name)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        title={
          tab === "species" ? "Katalog Spesies Ikan" : "Data Ikan Individu"
        }
        desc={
          tab === "species"
            ? "Katalog jenis ikan tangkapan laut dan air tawar (nama lokal, nama taksonomi ilmiah)."
            : "Pencatatan karakteristik sampel ikan individu (berat kg, catatan kualitas)."
        }
        searchPlaceholder={
          tab === "species" ? "Cari nama spesies..." : "Cari ikan..."
        }
        searchValue={search}
        onSearchChange={setSearch}
        tabs={[
          { key: "species", label: "1. Spesies Ikan (FishSpecies)" },
          { key: "individual", label: "2. Ikan Individu (Fish)" },
        ]}
        activeTab={tab}
        onTabChange={(k) => {
          setTab(k as SpeciesTab);
          setSearch("");
        }}
        addLabel={tab === "species" ? "Tambah Spesies" : "Tambah Ikan"}
        onAdd={tab === "species" ? handleOpenAddSpecies : handleOpenAddFish}
      />

      {/* CSV Action Buttons */}
      <div className="flex gap-2.5 mb-5 flex-wrap">
        <a
          href={
            tab === "species"
              ? fishSpeciesService.getTemplateUrl()
              : fishSpeciesService.getFishTemplateUrl()
          }
          download
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-fco-border surface-card hover:surface-inset transition-colors no-underline text-strong shadow-2xs"
        >
          <Download size={14} className="text-fco-blue" aria-hidden="true" />
          <span>
            Unduh Template CSV {tab === "species" ? "Spesies" : "Ikan"}
          </span>
        </a>
        <button
          type="button"
          onClick={importModal.openModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-fco-border surface-card hover:surface-inset transition-colors cursor-pointer text-strong shadow-2xs"
        >
          <FileUp size={14} className="text-emerald-600" aria-hidden="true" />
          <span>Impor {tab === "species" ? "Spesies" : "Ikan"} dari CSV</span>
        </button>
      </div>

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
        {tab === "species" ? (
          <DataTable
            columns={speciesCols}
            rows={speciesList}
            rowKey={(r) => String(r.id)}
            loading={loading}
            emptyText="Belum ada data spesies ikan terdaftar di server."
          />
        ) : (
          <DataTable
            columns={fishCols}
            rows={fishList}
            rowKey={(r) => String(r.id)}
            loading={loading}
            emptyText="Belum ada data sampel ikan individu."
          />
        )}
      </section>

      {/* Modal 1: Species CRUD */}
      <CrudModal
        open={speciesModal.open}
        title={editingSpeciesId ? "Ubah Spesies Ikan" : "Tambah Spesies Ikan"}
        subtitle="Daftarkan jenis ikan baru ke katalog resmi."
        onClose={speciesModal.closeModal}
        onSubmit={handleSpeciesSubmit}
        submitLabel={
          submitting
            ? "Menyimpan..."
            : editingSpeciesId
              ? "Perbarui Spesies"
              : "Simpan Spesies"
        }
      >
        <FormField label="Nama Ikan (Unik)" htmlFor="sp-name" required>
          <input
            id="sp-name"
            required
            disabled={submitting}
            value={speciesForm.name}
            onChange={(e) =>
              setSpeciesForm({ ...speciesForm, name: e.target.value })
            }
            placeholder="Contoh: Tuna Sirip Kuning"
            className={inputCls}
          />
        </FormField>
        <FormField label="Nama Ilmiah (Taksonomi)" htmlFor="sp-sci">
          <input
            id="sp-sci"
            disabled={submitting}
            value={speciesForm.scientific_name || ""}
            onChange={(e) =>
              setSpeciesForm({
                ...speciesForm,
                scientific_name: e.target.value,
              })
            }
            placeholder="Contoh: Thunnus albacares"
            className={inputCls}
          />
        </FormField>
        <FormField label="Deskripsi Spesies" htmlFor="sp-desc">
          <textarea
            id="sp-desc"
            rows={3}
            disabled={submitting}
            value={speciesForm.description || ""}
            onChange={(e) =>
              setSpeciesForm({ ...speciesForm, description: e.target.value })
            }
            placeholder="Karakteristik habitat, ukuran umum, atau musim..."
            className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue resize-none"
          />
        </FormField>
      </CrudModal>

      {/* Modal 2: Individual Fish CRUD */}
      <CrudModal
        open={fishModal.open}
        title={editingFishId ? "Ubah Data Ikan" : "Tambah Ikan Individu"}
        subtitle="Catat sampel ikan individu dengan spesifikasi berat."
        onClose={fishModal.closeModal}
        onSubmit={handleFishSubmit}
        submitLabel={
          submitting
            ? "Menyimpan..."
            : editingFishId
              ? "Perbarui Data"
              : "Simpan Data"
        }
      >
        <FormField label="Spesies Ikan" htmlFor="fi-species" required>
          <select
            id="fi-species"
            required
            disabled={submitting || speciesList.length === 0}
            value={fishForm.species}
            onChange={(e) =>
              setFishForm({ ...fishForm, species: Number(e.target.value) })
            }
            className={inputCls}
          >
            {speciesList.length === 0 ? (
              <option value="">
                Belum ada spesies (tambahkan spesies dulu)
              </option>
            ) : (
              speciesList.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.name}{" "}
                  {sp.scientific_name ? `(${sp.scientific_name})` : ""}
                </option>
              ))
            )}
          </select>
        </FormField>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField label="Nama / Label Sampel" htmlFor="fi-name">
            <input
              id="fi-name"
              disabled={submitting}
              value={fishForm.name || ""}
              onChange={(e) =>
                setFishForm({ ...fishForm, name: e.target.value })
              }
              placeholder="Contoh: Tuna Grade A"
              className={inputCls}
            />
          </FormField>
          <FormField label="Berat (kg)" htmlFor="fi-weight">
            <input
              id="fi-weight"
              type="number"
              step="0.01"
              disabled={submitting}
              value={fishForm.weight ?? ""}
              onChange={(e) =>
                setFishForm({ ...fishForm, weight: e.target.value })
              }
              placeholder="Contoh: 15.5"
              className={inputCls}
            />
          </FormField>
        </div>
        <FormField label="Catatan Kualitas / Kondisi" htmlFor="fi-notes">
          <textarea
            id="fi-notes"
            rows={2}
            disabled={submitting}
            value={fishForm.notes || ""}
            onChange={(e) =>
              setFishForm({ ...fishForm, notes: e.target.value })
            }
            placeholder="Kualitas kesegaran, lokasi penangkapan khusus, dll..."
            className="w-full border rounded-xl p-3 text-fco-md field-input focus:outline-none focus:border-fco-blue resize-none"
          />
        </FormField>
      </CrudModal>

      {/* Modal 3: CSV Import */}
      <CrudModal
        open={importModal.open}
        title={`Impor ${tab === "species" ? "Spesies" : "Ikan"} dari CSV`}
        subtitle={`Kirim data CSV teks sesuai header resmi backend.`}
        onClose={importModal.closeModal}
        onSubmit={handleCsvImportSubmit}
        submitLabel={importing ? "Mengimpor..." : "Mulai Impor CSV"}
      >
        <FormField
          label={`Konten CSV (Header: ${
            tab === "species"
              ? "name,scientific_name,description"
              : "nama_jenis,nama_ikan,berat_kg,catatan"
          })`}
          htmlFor="csv-data"
          required
        >
          <textarea
            id="csv-data"
            rows={6}
            required
            disabled={importing}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={
              tab === "species"
                ? "name,scientific_name,description\nTongkol,Euthynnus affinis,Ikan pelagis bernilai ekonomis\nCakalang,Katsuwonus pelamis,Ikan pelagis cepat berenang"
                : "nama_jenis,nama_ikan,berat_kg,catatan\nTongkol,Tongkol Super,1.5,Kualitas ekspor"
            }
            className="w-full border rounded-xl p-3 text-xs font-mono field-input focus:outline-none focus:border-fco-blue resize-none"
          />
        </FormField>
        <div className="pt-2">
          <label className="flex items-center gap-2.5 text-xs text-soft cursor-pointer">
            <input
              type="checkbox"
              disabled={importing}
              checked={clearExisting}
              onChange={(e) => setClearExisting(e.target.checked)}
              className="rounded text-fco-blue accent-[#1A56DB]"
            />
            <span>Hapus data lama sebelum mengimpor (clear_existing)</span>
          </label>
        </div>
        {importing && (
          <div className="flex items-center justify-center gap-2 text-sm text-fco-blue pt-2">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            <span>Memproses baris CSV di backend...</span>
          </div>
        )}
      </CrudModal>
    </div>
  );
}
