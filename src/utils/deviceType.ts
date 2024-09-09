export interface Device {
  id?: number;
  name: string;
  serial_number: number;
  last_connection: Date | string;
  status: boolean;
}