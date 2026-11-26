import { useRef, useState } from "react";
import { CrudModal } from "../../../components/CrudModal";
import { FormField } from "../../../components/FormField";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";

interface CsvImportModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  headerFormat: string;
  placeholderText: string;
  onClose: () => void;
  onImport: (csvText: string, clearExisting: boolean) => Promise<void>;
}

export function CsvImportModal({
  open,
  title,
  subtitle,
  headerFormat,
  placeholderText,
  onClose,
  onImport,
}: CsvImportModalProps) {
  const [csvText, setCsvText] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [clearExisting, setClearExisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = (file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      alert("Harap pilih file berformat .csv");
      return;
    }
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) setCsvText(content);
    };
    reader.readAsText(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleClearFile = () => {
    setSelectedFileName(null);
    setCsvText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    setSubmitting(true);
    try {
      await onImport(csvText, clearExisting);
      handleClearFile();
      setClearExisting(false);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const formattedHeaders = headerFormat
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean)
    .join(", ");

  return (
    <CrudModal
      open={open}
      title={title}
      subtitle={subtitle}
      onClose={() => {
        handleClearFile();
        onClose();
      }}
      onSubmit={handleSubmit}
      submitLabel={submitting ? "Mengimpor..." : "Mulai Impor File CSV"}
    >
      <div className="flex flex-col gap-4">
        {/* File Dropzone / Selector */}
        <div>
          <label className="block text-[13px] font-semibold text-[#0f172a] dark:text-[#e8edf7] mb-2">
            Unggah File CSV <span className="text-[#e11d48]">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            disabled={submitting}
            onChange={handleFileInputChange}
            className="hidden"
            id="csv-file-picker"
          />

          {!selectedFileName ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border border-dashed rounded-[12px] p-5 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-[#2563eb] bg-[#eef3ff] dark:border-[#5b94ff] dark:bg-[#14264d]"
                  : "border-[#d9dee8] dark:border-[#2a3753] bg-[#f7f8fa]/70 dark:bg-[#0a101d]/40 hover:bg-[#f1f4f9] dark:hover:bg-[#141d33]"
              }`}
            >
              <UploadCloud
                size={32}
                className="text-[#2563eb] dark:text-[#5b94ff] mx-auto mb-2"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-[#0f172a] dark:text-[#e8edf7]">
                Klik untuk memilih file CSV atau seret ke sini
              </div>
              <div className="text-xs text-[#64718a] dark:text-[#98a6c0] mt-1.5 leading-relaxed [overflow-wrap:anywhere]">
                Format: .csv (Header: {formattedHeaders})
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-[12px] border border-[#e8ebf0] dark:border-[#1f2a42] bg-[#f7f8fa]/60 dark:bg-[#0a101d]/40">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText
                  size={20}
                  className="text-emerald-600 dark:text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#0f172a] dark:text-[#e8edf7] truncate">
                    {selectedFileName}
                  </div>
                  <div className="text-2xs text-[#64718a] dark:text-[#98a6c0]">
                    {csvText.split("\n").filter(Boolean).length} baris terbaca
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearFile}
                disabled={submitting}
                aria-label="Hapus file"
                className="p-1.5 rounded-[8px] text-[#64718a] hover:text-[#0f172a] dark:text-[#98a6c0] dark:hover:text-[#e8edf7] hover:bg-[#e8ebf0]/60 dark:hover:bg-[#1f2a42] border-0 bg-transparent cursor-pointer transition-colors"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Preview / Raw Text Area */}
        <FormField
          label={`Pratinjau / Edit Konten Teks CSV`}
          htmlFor="csv-content"
        >
          <textarea
            id="csv-content"
            rows={4}
            disabled={submitting}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder={placeholderText}
            className="w-full border border-[#d9dee8] dark:border-[#2a3753] bg-white dark:bg-[#0f1729] rounded-[10px] px-3.5 py-3 text-xs font-mono text-[#0f172a] dark:text-[#e8edf7] placeholder:text-[#94a0b8] dark:placeholder:text-[#6b7a96] focus:outline-none focus:border-[#2563eb] dark:focus:border-[#5b94ff] focus:ring-2 focus:ring-[#2563eb]/15 transition-colors resize-none disabled:opacity-60"
          />
        </FormField>

        {/* Clear existing data checkbox */}
        <div>
          <label className="flex items-center gap-2.5 text-xs text-[#64718a] dark:text-[#98a6c0] cursor-pointer">
            <input
              type="checkbox"
              disabled={submitting}
              checked={clearExisting}
              onChange={(e) => setClearExisting(e.target.checked)}
              className="w-4 h-4 rounded border-[#d9dee8] text-[#2563eb] accent-[#2563eb] cursor-pointer"
            />
            <span>Hapus data lama sebelum mengimpor (clear_existing)</span>
          </label>
        </div>

        {submitting && (
          <div className="flex items-center justify-center gap-2 text-sm text-[#2563eb] dark:text-[#5b94ff] pt-1">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            <span>Memproses file CSV di server...</span>
          </div>
        )}
      </div>
    </CrudModal>
  );
}
