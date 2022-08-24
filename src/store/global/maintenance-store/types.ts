/* --- STATE --- */
export interface MaintenanceStoreState {
  states: MaintenanceStates;
  loading: boolean;
}

export type ContainerState = MaintenanceStoreState;

export interface MaintenanceStates {
  [id: string]: Maintenance;
}

export interface Maintenance {
  id: number;
  name: string;
  label: string;
  isInMaintenance: boolean;
}
