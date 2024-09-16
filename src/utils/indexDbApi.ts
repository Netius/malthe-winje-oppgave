import { Device } from "./deviceType";

export const saveDevice = (device: Device) => {
  const idb = window.indexedDB;
  const dbPromise = idb.open("malthewinje-db", 1);

  dbPromise.onsuccess = () => {
    const db = dbPromise.result;
    const tx = db.transaction("deviceEntity", "readwrite");
    const deviceEntity = tx.objectStore("deviceEntity");

    const selectedDevice = deviceEntity.put({
      id: device.id,
      name: device.name,
      serial_number: device.serial_number,
      last_connection: new Date(device.last_connection),
      status: device.status,
    });

    selectedDevice.onsuccess = () => {
      tx.oncomplete = function () {
        db.close();
      };
    };
  };
};

 // Delete devices from indexedDB
 export const deleteDevice = (item: Device) => {
  const idb = window.indexedDB;
  const dbPromise = idb.open("malthewinje-db", 1);

  dbPromise.onsuccess = function () {
    const db = dbPromise.result;
    const tx = db.transaction("deviceEntity", "readwrite");
    const deviceEntity = tx.objectStore("deviceEntity");
    const deleteDev = deviceEntity.delete(Number(item.id));

    deleteDev.onsuccess = () => {
      tx.oncomplete = function () {
        db.close();
      };
    };
  };
};

 // Get all devices in IndexedDB
 const getAllData = () => {
  const idb = window.indexedDB;
  const dbPromise = idb.open("malthewinje-db", 1);
  dbPromise.onsuccess = () => {
    const db = dbPromise.result;
    const tx = db.transaction("deviceEntity", "readonly");
    const deviceEntity = tx.objectStore("deviceEntity");
    const deviceListRequest = deviceEntity.getAll();

    deviceListRequest.onsuccess = (event: Event) => {
      const result = (event.target as IDBRequest<Device[]>).result;
      // setDeviceList(result);
      let activeCounterLength = result.filter(item => item.status === true).length
      let inactiveCounterLength = result.filter(item => item.status === false).length
      // setCounterStatus({ activeCount: activeCounterLength, inactiveCount: inactiveCounterLength })
      return result;
    };
    tx.oncomplete = () => {
      db.close();
    };
  };
};