import React from 'react'
import { Device, emptyDeviceEntity, HandleDeviceState } from '../../utils/deviceType';

export const ButtonSaveDevice: React.FC<HandleDeviceState> = ({ handlerSetDeviceState, item , handleGetAllData}) => {

  const cleanEditState = () => {
    return handlerSetDeviceState(emptyDeviceEntity);
  }

  const getAllData = () =>{
    return handleGetAllData();
  }

  // Save changes to indexedDB
  const saveChanges = (item: Device) => {
    const deviceEditStatus = handlerSetDeviceState({ ...item });
    console.log(deviceEditStatus)
    const idb = window.indexedDB;
    const dbPromise = idb.open("malthewinje-db", 1);

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("deviceEntity", "readwrite");
      const deviceEntity = tx.objectStore("deviceEntity");

      const selectedDevice = deviceEntity.put({
        id: deviceEditStatus.id,
        name: deviceEditStatus.name,
        serial_number: deviceEditStatus.serial_number,
        last_connection: deviceEditStatus.last_connection,
        status: deviceEditStatus.status,
      });

      selectedDevice.onsuccess = () => {
        tx.oncomplete = function () {
          db.close();
        };
        getAllData();
      };
      cleanEditState();
    };
  };


  return (
    <button
      onClick={() => saveChanges(item)}
      className='btn btn-outline-success btn-sm me-2 mt-1'>
      Save
    </button>
  )
}