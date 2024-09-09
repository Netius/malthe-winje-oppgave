import { useState } from 'react'
import DEVICE_ENTITY_DATA from '../data/DEVICE_ENTITY_DATA';

function InitializeDatabaseButton() {
  const [connected, setConnected] = useState<boolean>(false)
  const [errorDB, setErrorDB] = useState<boolean>(false)

  const initializeDatabase = () => {
    // Checks if IndexedDB is in Chrome 
    // TODO implement support to multiple browse
    const idb = window.indexedDB;

    // Try to open DB if not create
    const request = idb.open("malthewinje-db", 1);

    // Return error 
    request.onerror = function (event) {
      setErrorDB(true);
      console.error("An error occurred with IndexedDB : ", event)
    };

    // Create IndexedDB if not present
     request.onupgradeneeded = function (event) {
      console.log(event);
      const db = request.result;

      if (!db.objectStoreNames.contains("deviceEntity")) {
        const objectStore = db.createObjectStore("deviceEntity", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = function () {
      setConnected(true);

      const db = request.result;
      var tx = db.transaction("deviceEntity", "readwrite");
      var deviceEntity = tx.objectStore("deviceEntity");

      // Loop to add entries i Indexed Database
      const { name, serial_number, last_connection, status } = DEVICE_ENTITY_DATA;
      for (let index = 0; index < 200; index++) {
        deviceEntity.add({
          name: `${name + index}`,
          serial_number: `${serial_number + index}`,
          last_connection,
          status
        })
      }

      return tx.oncomplete;
    };

    return;
  }

  return (
    <>
      <button onClick={initializeDatabase}>Initialize database</button>
      {errorDB && <p>An error occurred with IndexedDB</p>}
      {connected && <p>Database opened successfully</p>}
    </>
  )
}

export default InitializeDatabaseButton;