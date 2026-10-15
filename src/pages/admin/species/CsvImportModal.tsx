import { useState } from "react";
import { CrudModal } from "../../../components/CrudModal";
import { FormField } from "../../../components/FormField";
import { Loader2 } from "lucide-react";

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
  const [clearExisting, setClearExisting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;
    setSubmitting(true);
    try {
      await onImport(csvText, clearExisting);
      setCsvText("");
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
      onClose={onClose}
      onSubmit={handleSubmit}
      submitLabel={submitting ? "Mengimpor..." : "Mulai Impor CSV"}
    >
      <FormField
        label={`Konten CSV (Header: ${headerFormat})`}
        htmlFor="csv-content"
        required
      >
        <textarea
          id="csv-content"
          rows={6}
          required
          disabled={submitting}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          placeholder={placeholderText}
          className="w-full border rounded-xl p-3 text-xs font-mono field-input focus:outline-none focus:border-fco-blue resize-none"
        />
      </FormField>
      <div className="pt-2">
        <label className="flex items-center gap-2.5 text-xs text-soft cursor-pointer">
          <input
            type="checkbox"
            disabled={submitting}
            checked={clearExisting}
            onChange={(e) => setClearExisting(e.target.checked)}
            className="rounded text-fco-blue accent-[#1A56DB]"
          />
          <span>Hapus data lama sebelum mengimpor (clear_existing)</span>
        </label>
      </div>
      {submitting && (
        <div className="flex items-center justify-center gap-2 text-sm text-fco-blue pt-2">
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          <span>Memproses data CSV di backend...</span>
        </div>
      )}
    </CrudModal>
  );
}
