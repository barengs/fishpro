import { useEffect, useState } from "react";
import { BarChart3, AlertCircle, UserCheck } from "lucide-react";
import { shipsService, type Ship } from "../../../services/ships";
import { authService } from "../../../services/auth";

interface TipItem {
  title: string;
  text: string;
  Icon: typeof BarChart3;
}

const defaultTips: TipItem[] = [
  {
    title: "Kuota armada perlu dipantau",
    text: "Dengan laju tangkapan aktif, beberapa kapal mendekati ambang batas kuota tahunan.",
    Icon: BarChart3,
  },
  {
    title: "Tunjuk nahkoda untuk kapal tanpa awak",
    text: "Kapal belum bisa mengirim laporan tangkapan sah tanpa nahkoda berlisensi.",
    Icon: UserCheck,
  },
  {
    title: "Optimalisasi kuota berbasis AI",
    text: "Gunakan model prediksi NSGA-III untuk merencanakan alokasi musim penangkapan berikutnya.",
    Icon: AlertCircle,
  },
];

export function AiAdviceCard() {
  const [tips, setTips] = useState<TipItem[]>(defaultTips);

  const currentUser = authService.getStoredUser();
  const ownerId = currentUser?.id;

  useEffect(() => {
    async function loadDynamicTips() {
      try {
        let ships: Ship[] = [];
        if (ownerId) {
          ships = await shipsService
            .getByOwner(ownerId)
            .catch(() => shipsService.getAll());
        } else {
          ships = await shipsService.getAll();
        }

        const generated: TipItem[] = [];

        // Check if any ship has low quota
        const lowQuotaShip = ships.find(
          (s) => (s.current_year_quota?.quota_percentage ?? 100) < 25,
        );
        if (lowQuotaShip) {
          generated.push({
            title: `Kuota ${lowQuotaShip.name} menipis (${lowQuotaShip.current_year_quota?.quota_percentage}%)`,
            text: "Dengan laju penangkapan saat ini, kuota diperkirakan habis dalam beberapa minggu.",
            Icon: BarChart3,
          });
        }

        // Check if any ship is missing a captain
        const unassignedShip = ships.find((s) => !s.captain);
        if (unassignedShip) {
          generated.push({
            title: `Tunjuk nahkoda untuk ${unassignedShip.name}`,
            text: "Kapal belum dapat mengirim laporan tangkapan resmi sebelum memiliki nahkoda berlisensi.",
            Icon: UserCheck,
          });
        }

        // Try getting AI recommendations
        const aiRec = await shipsService
          .getAiRecommendations()
          .catch(() => null);
        if (aiRec && aiRec.top_ships && aiRec.top_ships.length > 0) {
          const top = aiRec.top_ships[0];
          generated.push({
            title: `Efisiensi terbaik: ${top.name}`,
            text: `Rekomendasi bulan tangkapan optimal: ${top.best_fishing_months.slice(0, 3).join(", ")}.`,
            Icon: AlertCircle,
          });
        } else {
          generated.push({
            title: "Ajukan penyesuaian kuota",
            text: "Gunakan fitur override regulator jika kuota kapal Anda membutuhkan penyesuaian.",
            Icon: AlertCircle,
          });
        }

        if (generated.length > 0) {
          setTips(generated.slice(0, 3));
        }
      } catch {
        // Fallback to default
      }
    }

    loadDynamicTips();
  }, [ownerId]);

  return (
    <section className="surface-card border rounded-2xl p-6 shadow-xs">
      <h2 className="mt-0 mb-4 text-base font-bold text-strong">
        Rekomendasi & Wawasan AI
      </h2>
      <div className="flex flex-col gap-4">
        {tips.map((t) => (
          <div key={t.title} className="flex gap-3">
            <div className="w-8 h-8 rounded-fco bg-fco-blue-light dark:bg-fco-blue/20 flex items-center justify-center shrink-0">
              <t.Icon
                size={16}
                className="text-fco-blue"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
            <div>
              <div className="text-sm font-semibold mb-0.5 text-strong">
                {t.title}
              </div>
              <div className="text-fco-sm leading-relaxed text-soft">
                {t.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
