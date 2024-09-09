interface DeviceEntity {
  name: string;
  serial_number: number;
  last_connection: Date;
  status: boolean;
}


const DEVICE_ENTITY_DATA : DeviceEntity = {
  name: "Device",
  serial_number: 123456789,
  last_connection: new Date(),
  status: false
}



export default DEVICE_ENTITY_DATA;