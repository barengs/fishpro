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
          <label className="block text-sm font-semibold text-strong mb-2">
            Unggah File CSV <span className="text-red-500">*</span>
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
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-fco-blue bg-fco-blue/5"
                  : "border-fco-border dark:border-fco-border-dark surface-card hover:surface-page"
              }`}
            >
              <UploadCloud
                size={32}
                className="text-fco-blue mx-auto mb-2"
                aria-hidden="true"
              />
              <div className="text-sm font-semibold text-strong">
                Klik untuk memilih file CSV atau seret ke sini
              </div>
              <div className="text-xs text-soft mt-1">
                Format: .csv (Header: {headerFormat})
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3.5 rounded-xl border border-fco-border dark:border-fco-border-dark surface-card">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText
                  size={20}
                  className="text-emerald-600 dark:text-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-strong truncate">
                    {selectedFileName}
                  </div>
                  <div className="text-2xs text-soft">
                    {csvText.split("\n").filter(Boolean).length} baris terbaca
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearFile}
                disabled={submitting}
                aria-label="Hapus file"
                className="p-1 rounded-lg text-soft hover:text-strong hover:surface-page border-none bg-transparent cursor-pointer transition-colors"
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
            className="w-full border dark:border-fco-border-dark rounded-xl p-3 text-xs font-mono field-input focus:outline-hidden focus:border-fco-blue resize-none"
          />
        </FormField>

        {/* Clear existing data checkbox */}
        <div>
          <label className="flex items-center gap-2.5 text-xs text-soft cursor-pointer">
            <input
              type="checkbox"
              disabled={submitting}
              checked={clearExisting}
              onChange={(e) => setClearExisting(e.target.checked)}
              className="rounded text-fco-blue accent-fco-blue"
            />
            <span>Hapus data lama sebelum mengimpor (clear_existing)</span>
          </label>
        </div>

        {submitting && (
          <div className="flex items-center justify-center gap-2 text-sm text-fco-blue pt-1">
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            <span>Memproses file CSV di server...</span>
          </div>
        )}
      </div>
    </CrudModal>
  );
}
