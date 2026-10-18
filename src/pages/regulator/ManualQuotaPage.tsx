import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { ManualQuotaTab } from "./components/ManualQuotaTab";

export function ManualQuotaPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Input Kuota Manual oleh Regulator"
        desc="Kewenangan resmi pengawas KKP menetapkan alokasi kuota kapal penangkap ikan per tahun."
      />
      <ManualQuotaTab
        onQuotaSaved={() => {
          navigate("/regulator/audit");
        }}
      />
    </div>
  );
}
