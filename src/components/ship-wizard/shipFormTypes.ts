export interface ShipFormData {
  name: string;
  registration_number: string;
  owner: string;
  captain: string;
  length: string;
  width: string;
  gross_tonnage: string;
  year_built: string;
  home_port: string;
  active: boolean;
}

export const emptyShipForm: ShipFormData = {
  name: "",
  registration_number: "",
  owner: "",
  captain: "",
  length: "",
  width: "",
  gross_tonnage: "",
  year_built: "",
  home_port: "",
  active: true,
};
