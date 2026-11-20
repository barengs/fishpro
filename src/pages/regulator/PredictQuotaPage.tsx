import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { PredictQuotaTab } from "./components/PredictQuotaTab";

export function PredictQuotaPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Proyeksi Kuota Penangkapan"
        desc="Perkiraan batas kuota tangkapan berbasis histori kapal dan daya dukung perairan untuk menjaga kelestarian laut."
      />
      <PredictQuotaTab
        onQuotaApplied={() => {
          navigate("/regulator/audit");
        }}
      />
    </div>
  );
}
