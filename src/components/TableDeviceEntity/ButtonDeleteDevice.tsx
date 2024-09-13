import React, { useState } from 'react'
import { Device, emptyDeviceEntity, HandleDeviceState } from '../../utils/deviceType';

export const ButtonDeleteDevice : React.FC<HandleDeviceState> = ({handlerSetDeviceState, item, handleGetAllData}) => {
  const cleanEditState = () => {
    return handlerSetDeviceState(emptyDeviceEntity);
  }
  
  const getAllData = () =>{
    return handleGetAllData();
  }
  // Delete devices from indexedDB
  const deleteDevice = (item: Device) => {
    const idb = window.indexedDB;
    const dbPromise = idb.open("malthewinje-db", 1);

    dbPromise.onsuccess = function () {
      const db = dbPromise.result;
      const tx = db.transaction("deviceEntity", "readwrite");
      const deviceEntity = tx.objectStore("deviceEntity");
      const deleteUser = deviceEntity.delete(Number(item.id));

      deleteUser.onsuccess = () => {
        tx.oncomplete = function () {
          db.close();
        };
        getAllData();
      };
      cleanEditState()
    };
  };

  return (
    <button onClick={() => deleteDevice(item)}
    className='btn btn-outline-danger btn-sm me-2 mt-1'>
    Delete
  </button>
  )
}
