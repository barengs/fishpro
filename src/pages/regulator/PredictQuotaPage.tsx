import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/PageHeader";
import { PredictQuotaTab } from "./components/PredictQuotaTab";

export function PredictQuotaPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Prediksi Kuota AI (LSTM + NSGA-III)"
        desc="Simulasi proyeksi kuota tangkapan berbasis deep learning LSTM dan optimasi kelestarian perairan NSGA-III."
      />
      <PredictQuotaTab
        onQuotaApplied={() => {
          navigate("/regulator/audit");
        }}
      />
    </div>
  );
}
