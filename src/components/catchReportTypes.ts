export interface CatchReportFormData {
  catch_date: string;
  catch_type: string;
  location_latitude: string;
  location_longitude: string;
  description: string;
  fish_species: string;
  wpp: string;
  quantity: string;
  unit: string;
  value: string;
  entry_mode?: "iot" | "manual";
  scale_reading_id?: string;
  manual_reason?: string;
}

export const emptyCatchForm: CatchReportFormData = {
  catch_date: new Date().toISOString().split("T")[0],
  catch_type: "pelagic",
  location_latitude: "",
  location_longitude: "",
  description: "",
  fish_species: "",
  wpp: "",
  quantity: "",
  unit: "kg",
  value: "",
  entry_mode: "manual",
  scale_reading_id: "",
  manual_reason: "",
};
