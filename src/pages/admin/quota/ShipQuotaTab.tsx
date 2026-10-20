import { DataTable, type Column } from "../../../components/DataTable";
import { ProgressBar } from "../../../components/ProgressBar";
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
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
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
            <div className="text-xs text-soft tabular-nums">
              {r.registration_number}
              {hasQuota &&
                ` · Sisa: ${Number(q!.remaining_quota).toLocaleString("id-ID")} kg (${pct}%)`}
            </div>
          </div>
        );
      },
    },
    {
      key: "quota",
      header: "Alokasi Kuota",
      flex: 2,
      align: "right",
      hideOnMobile: true,
      render: (r) => {
        const q = r.current_year_quota;
        if (!q || typeof q !== "object") {
          return <span className="text-xs text-soft italic">Belum diatur</span>;
        }
        return (
          <span className="text-sm font-semibold tabular-nums">
            {Number(q.total_quota).toLocaleString("id-ID")} kg
          </span>
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
          <div className="w-full max-w-44">
            <div className="flex justify-between text-2xs text-soft mb-1 tabular-nums">
              <span>
                {Number(q.remaining_quota).toLocaleString("id-ID")} kg
              </span>
              <span>{pct}%</span>
            </div>
            <ProgressBar width={`${pct}%`} height={6} barBg={barBg} />
          </div>
        );
      },
    },
    {
      key: "st",
      header: "Status",
      flex: 1,
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
