import { DataTable, type Column } from "../../../components/DataTable";
import { StatusChip } from "../../../components/StatusChip";
import { PageToolbar } from "../../../components/PageToolbar";
import { CrudModal } from "../../../components/CrudModal";
import { DetailModal } from "../../../components/DetailModal";
import { CrudActions } from "../../../components/FormField";
import { AlertBanner, SelectField, TextField } from "../../../components/ui";
import type { Ship } from "../../../services/ships";
import { useShipQuota } from "./hooks/useShipQuota";

export function ShipQuotaTab() {
  const {
    ships,
    loading,
    search,
    setSearch,
    errorMsg,
    setErrorMsg,
    submitting,
    form,
    setForm,
    isModalOpen,
    closeModal,
    handleOpenAdd,
    handleOpenAdjust,
    handleSubmitQuota,
    selectedShip,
    isDetailOpen,
    openDetail,
    closeDetail,
  } = useShipQuota();

  const cols: Column<Ship>[] = [
    {
      key: "ship",
      header: "Kapal / Registrasi",
      flex: 3,
      render: (r) => {
        const q = r.current_year_quota;
        const hasQuota = Boolean(q && typeof q === "object");
        const pct = hasQuota ? q!.quota_percentage : 0;
        const isCritical = hasQuota && pct < 15;

        return (
          <div className="py-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-strong">
                {r.name}
              </span>
              <span className="sm:hidden">
                {!hasQuota ? (
                  <StatusChip
                    label="Belum Diatur"
                    bg="#EEF1F6"
                    color="#4A5872"
                  />
                ) : isCritical ? (
                  <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" />
                ) : (
                  <StatusChip label="Aman" />
                )}
              </span>
            </div>
            <div className="text-xs text-soft tabular-nums mt-0.5 flex items-center gap-1.5">
              <span>{r.registration_number}</span>
              {r.home_port && <span>· {r.home_port}</span>}
              <span className="sm:hidden">
                {hasQuota &&
                  `· Sisa: ${Number(q!.remaining_quota).toLocaleString("id-ID")} kg (${pct}%)`}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "quota",
      header: "Alokasi Kuota",
      flex: 2,
      hideOnMobile: true,
      render: (r) => {
        const q = r.current_year_quota;
        if (!q || typeof q !== "object") {
          return <span className="text-xs text-soft italic">Belum diatur</span>;
        }
        return (
          <div>
            <span className="text-sm font-semibold tabular-nums text-strong">
              {Number(q.total_quota).toLocaleString("id-ID")} kg
            </span>
            <span className="block text-2xs text-soft">
              Tahun {q.year || 2026}
            </span>
          </div>
        );
      },
    },
    {
      key: "rem",
      header: "Sisa Kuota Tahunan",
      flex: 3,
      hideOnMobile: true,
      render: (r) => {
        const q = r.current_year_quota;
        if (!q || typeof q !== "object") {
          return <span className="text-xs text-soft">—</span>;
        }
        const pct = q.quota_percentage;
        const barBg = pct < 15 ? "#EF4444" : pct < 30 ? "#F59E0B" : "#1A56DB";
        return (
          <div className="w-full max-w-56 pr-2">
            <div className="flex items-baseline justify-between gap-2 mb-1.5 tabular-nums">
              <span className="text-sm font-semibold text-strong">
                {Number(q.remaining_quota).toLocaleString("id-ID")} kg
              </span>
              <span
                className={`text-xs font-bold ${
                  pct < 15
                    ? "text-red-600 dark:text-red-400"
                    : pct < 30
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-fco-blue"
                }`}
              >
                {pct}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden border border-fco-border-subtle">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, pct))}%`,
                  backgroundColor: barBg,
                }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "st",
      header: "Status",
      flex: 2,
      align: "center",
      hideOnMobile: true,
      render: (r) => {
        const q = r.current_year_quota;
        if (!q || typeof q !== "object") {
          return (
            <StatusChip label="Belum Diatur" bg="#EEF1F6" color="#4A5872" />
          );
        }
        const pct = q.quota_percentage;
        return pct < 15 ? (
          <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" />
        ) : (
          <StatusChip label="Aman" />
        );
      },
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <CrudActions
          onDetail={() => openDetail(r)}
          onEdit={() => handleOpenAdjust(r)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageToolbar
        searchPlaceholder="Cari kapal atau nomor registrasi..."
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Atur Kuota Baru"
        onAdd={handleOpenAdd}
      />

      {errorMsg && (
        <AlertBanner
          variant="error"
          message={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
      )}

      <section className="surface-card border rounded-xl p-6 shadow-xs">
        <DataTable
          columns={cols}
          rows={ships}
          rowKey={(r) => String(r.id)}
          loading={loading}
          emptyText="Belum ada data kapal terdaftar di server."
          onRowClick={openDetail}
        />
      </section>

      {/* Detail Pop-up */}
      <DetailModal
        open={isDetailOpen}
        title={
          selectedShip ? `Kuota: ${selectedShip.name}` : "Detail Kuota Kapal"
        }
        subtitle="Alokasi kuota penangkapan tahun berjalan dan status kepatuhan kapal."
        badge={
          selectedShip
            ? (() => {
                const q = selectedShip.current_year_quota;
                if (!q || typeof q !== "object") {
                  return (
                    <StatusChip
                      label="Belum Diatur"
                      bg="#EEF1F6"
                      color="#4A5872"
                    />
                  );
                }
                const pct = q.quota_percentage;
                return pct < 15 ? (
                  <StatusChip label="Kritis" bg="#FFF1E0" color="#B54708" />
                ) : (
                  <StatusChip label="Aman" />
                );
              })()
            : undefined
        }
        onClose={closeDetail}
        actions={
          selectedShip && (
            <button
              type="button"
              onClick={() => {
                const target = selectedShip;
                closeDetail();
                handleOpenAdjust(target);
              }}
              className="h-9 px-3.5 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-fco-blue cursor-pointer transition-colors"
            >
              Sesuaikan Kuota
            </button>
          )
        }
        fields={[
          {
            label: "Nama Kapal",
            value: selectedShip?.name,
          },
          {
            label: "Nomor Registrasi",
            value: (
              <span className="font-mono font-bold text-fco-blue">
                {selectedShip?.registration_number}
              </span>
            ),
          },
          {
            label: "Pemilik (Owner)",
            value: selectedShip?.owner_name || "—",
          },
          {
            label: "Gross Tonnage (GT)",
            value: selectedShip?.gross_tonnage
              ? `${selectedShip.gross_tonnage} GT`
              : "—",
          },
          {
            label: "Tahun Berjalan",
            value:
              selectedShip?.current_year_quota &&
              typeof selectedShip.current_year_quota === "object" &&
              selectedShip.current_year_quota.year
                ? String(selectedShip.current_year_quota.year)
                : "2026",
          },
          {
            label: "Alokasi Kuota Total",
            value:
              selectedShip?.current_year_quota &&
              typeof selectedShip.current_year_quota === "object"
                ? `${Number(selectedShip.current_year_quota.total_quota).toLocaleString("id-ID")} kg`
                : "Belum ditetapkan kuota",
          },
          {
            label: "Kuota Terpakai (Realisasi)",
            value:
              selectedShip?.current_year_quota &&
              typeof selectedShip.current_year_quota === "object"
                ? `${Number(selectedShip.current_year_quota.used_quota).toLocaleString("id-ID")} kg`
                : "0 kg",
          },
          {
            label: "Sisa Kuota Resmi",
            value:
              selectedShip?.current_year_quota &&
              typeof selectedShip.current_year_quota === "object"
                ? `${Number(selectedShip.current_year_quota.remaining_quota).toLocaleString("id-ID")} kg (${selectedShip.current_year_quota.quota_percentage}%)`
                : "—",
            fullWidth: true,
          },
        ]}
      />

      {/* Form Modal: Atur Kuota Kapal */}
      <CrudModal
        open={isModalOpen}
        title="Atur Kuota Penangkapan Kapal"
        subtitle="Tetapkan alokasi kuota resmi penangkapan ikan per kapal per tahun."
        onClose={closeModal}
        onSubmit={handleSubmitQuota}
        submitLabel={submitting ? "Menyimpan Kuota..." : "Simpan Kuota"}
      >
        <div className="flex flex-col gap-4">
          <SelectField
            label="Pilih Kapal Terdaftar"
            id="qk-ship"
            required
            searchable
            searchPlaceholder="Ketik nama kapal atau nomor registrasi..."
            value={form.shipReg}
            onChange={(e) => setForm({ ...form, shipReg: e.target.value })}
            placeholder={
              ships.length === 0
                ? "— Belum ada kapal terdaftar di database —"
                : "— Pilih Kapal —"
            }
            options={
              ships.length === 0
                ? [
                    {
                      value: "",
                      label: "Belum ada kapal terdaftar di database",
                      disabled: true,
                    },
                  ]
                : ships.map((s) => ({
                    value: s.registration_number,
                    label: `${s.name} (${s.registration_number}) · ${s.gross_tonnage || 0} GT`,
                  }))
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <TextField
              label="Tahun Kuota"
              id="qk-year"
              type="number"
              required
              disabled={submitting}
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />

            <TextField
              label="Alokasi Kuota (kg)"
              id="qk-amount"
              type="number"
              step="0.01"
              required
              disabled={submitting}
              value={form.quota}
              onChange={(e) => setForm({ ...form, quota: e.target.value })}
              placeholder="Contoh: 15000"
            />
          </div>
        </div>
      </CrudModal>
    </div>
  );
}
