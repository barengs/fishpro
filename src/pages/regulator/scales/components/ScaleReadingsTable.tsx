import { RefreshCw } from "lucide-react";
import { DataTable, type Column } from "../../../../components/DataTable";
import { StatusChip } from "../../../../components/StatusChip";
import { DetailModal } from "../../../../components/DetailModal";
import { useDetailModal } from "../../../../components/useDetailModal";
import { type ScaleReading } from "../../../../services/iot";

interface ScaleReadingsTableProps {
  readings: ScaleReading[];
  loading: boolean;
  onRefresh: () => void;
}

export function ScaleReadingsTable({
  readings,
  loading,
  onRefresh,
}: ScaleReadingsTableProps) {
  const {
    selected: selectedDetailReading,
    open: isDetailOpen,
    openDetail,
    closeDetail,
  } = useDetailModal<ScaleReading>();

  const historyCols: Column<ScaleReading>[] = [
    {
      key: "time",
      header: "Waktu Timbang",
      flex: 3,
      render: (r) => (
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-semibold tabular-nums">
              {new Date(r.created_at).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <span className="sm:hidden">
              <StatusChip
                label={
                  r.status === "saved"
                    ? "Tersimpan"
                    : r.status === "discarded"
                      ? "Dilewati"
                      : "Pending"
                }
                bg={r.status === "saved" ? undefined : "#FFF1E0"}
                color={r.status === "saved" ? undefined : "#B54708"}
              />
            </span>
          </div>
          <div className="text-2xs text-soft">
            <span className="sm:hidden font-mono font-bold text-strong">
              {r.device_id} ·{" "}
            </span>
            {new Date(r.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
      ),
    },
    {
      key: "device",
      header: "Timbangan / Pelabuhan",
      flex: 2,
      hideOnMobile: true,
      render: (r) => (
        <div>
          <span className="text-sm font-bold text-strong">{r.device_id}</span>
          <div className="text-2xs text-soft">{r.port_name || "Pelabuhan"}</div>
        </div>
      ),
    },
    {
      key: "weight",
      header: "Berat Terbaca",
      flex: 2,
      align: "right",
      render: (r) => (
        <span className="text-sm sm:text-base font-extrabold text-strong font-mono tabular-nums">
          {Number(r.weight).toLocaleString("id-ID", {
            minimumFractionDigits: 2,
          })}{" "}
          <span className="text-xs text-soft font-normal">{r.unit}</span>
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      flex: 2,
      align: "center",
      hideOnMobile: true,
      render: (r) =>
        r.status === "saved" ? (
          <StatusChip label="Tersimpan Resmi" />
        ) : r.status === "discarded" ? (
          <StatusChip label="Dilewati" bg="#EEF1F6" color="#4A5872" />
        ) : (
          <StatusChip label="Menunggu Input" bg="#FFF1E0" color="#B54708" />
        ),
    },
    {
      key: "aksi",
      header: "Aksi",
      flex: 1,
      align: "right",
      render: (r) => (
        <button
          type="button"
          onClick={() => openDetail(r)}
          className="h-8 px-2.5 sm:px-3 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-fco-blue cursor-pointer transition-colors shrink-0"
        >
          Detail
        </button>
      ),
    },
  ];

  return (
    <section className="surface-card border rounded-xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="m-0 text-base font-bold text-strong">
            Riwayat Pembacaan Sensor Timbangan ({readings.length})
          </h3>
          <p className="m-0 text-xs text-soft mt-0.5">
            GET /api/iot/readings/ — Log audit seluruh sesi penimbangan ikan di
            pelabuhan.
          </p>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 h-8.5 px-3 rounded-lg border border-fco-border-subtle surface-inset hover:surface-page text-xs font-semibold text-strong cursor-pointer"
        >
          <RefreshCw size={13} />
          <span>Muat Ulang</span>
        </button>
      </div>

      <DataTable
        columns={historyCols}
        rows={readings}
        rowKey={(r) => r.id}
        loading={loading}
        emptyText="Belum ada riwayat pembacaan sensor timbangan IoT."
        onRowClick={openDetail}
      />

      <DetailModal
        open={isDetailOpen}
        title={
          selectedDetailReading
            ? `Pembacaan: ${selectedDetailReading.weight} ${selectedDetailReading.unit}`
            : "Detail Pembacaan Timbangan"
        }
        subtitle="Data log mentah yang dikirim oleh sensor timbangan IoT dermaga."
        badge={
          selectedDetailReading ? (
            <StatusChip
              label={
                selectedDetailReading.status === "saved"
                  ? "Tersimpan"
                  : selectedDetailReading.status === "discarded"
                    ? "Dilewati"
                    : "Pending"
              }
              bg={
                selectedDetailReading.status === "saved" ? undefined : "#FFF1E0"
              }
              color={
                selectedDetailReading.status === "saved" ? undefined : "#B54708"
              }
            />
          ) : undefined
        }
        onClose={closeDetail}
        fields={[
          {
            label: "ID Pembacaan (UUID)",
            value: (
              <span className="font-mono text-xs font-bold text-fco-blue break-all">
                {selectedDetailReading?.id}
              </span>
            ),
            fullWidth: true,
          },
          {
            label: "ID Perangkat Timbangan",
            value: selectedDetailReading?.device_id,
          },
          {
            label: "Lokasi Pelabuhan",
            value: selectedDetailReading?.port_name || "Pelabuhan Utama",
          },
          {
            label: "Berat Terbaca",
            value: (
              <span className="font-mono font-extrabold text-strong">
                {selectedDetailReading?.weight} {selectedDetailReading?.unit}
              </span>
            ),
          },
          {
            label: "Stabilitas Sensor",
            value: selectedDetailReading?.is_stable ? "Stabil" : "Fluktuatif",
          },
          {
            label: "Waktu Penerimaan",
            value: selectedDetailReading?.created_at
              ? new Date(selectedDetailReading.created_at).toLocaleString(
                  "id-ID",
                )
              : "—",
          },
          {
            label: "Status Integrasi",
            value:
              selectedDetailReading?.status === "saved"
                ? `Tersimpan ke Tangkapan #${selectedDetailReading.fish_catch || "—"}`
                : "Belum disimpan ke laporan tangkapan",
            fullWidth: true,
          },
        ]}
      />
    </section>
  );
}
