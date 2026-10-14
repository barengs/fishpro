export interface CatchReportFormData {
  catch_date: string
  catch_type: string
  location_latitude: string
  location_longitude: string
  description: string
  fish_species: string
  wpp: string
  quantity: string
  unit: string
  value: string
}

export const emptyCatchForm: CatchReportFormData = {
  catch_date: '2026-10-09',
  catch_type: 'pelagic',
  location_latitude: '-8.740000',
  location_longitude: '115.200000',
  description: '',
  fish_species: '',
  wpp: 'WPP 573',
  quantity: '',
  unit: 'kg',
  value: ''
}
