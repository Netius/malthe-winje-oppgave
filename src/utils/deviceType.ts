export interface Device {
  id?: number;
  name: string;
  serial_number: number;
  last_connection: Date | string;
  status: boolean;
}

export interface State {
  activeCount: number,
  inactiveCount: number,
}

export type Props = {
  setCounterStatus: React.Dispatch<React.SetStateAction<State>>;
};

export const emptyDeviceEntity : Device = {
  id: 0,
  name: "",
  serial_number: 0,
  last_connection: "",
  status: false
}