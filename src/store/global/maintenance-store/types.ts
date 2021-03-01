/* --- STATE --- */
export interface MaintenanceStoreState {
  [id: string]: Maintenance;
}

export type ContainerState = MaintenanceStoreState;

export interface Maintenance {
  id: number;
  name: string;
  label: string;
  maintenance_active: boolean;
  message: string;
}
