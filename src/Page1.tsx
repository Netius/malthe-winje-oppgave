import { useState } from 'react';
import DEVICE_ENTITY_DATA from './data/DEVICE_ENTITY_DATA';
import { Device, Props } from './utils/deviceType';

const Page1 : React.FC<Props> = ({ setCounterStatus }) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [errorDB, setErrorDB] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initializeDatabase = () => {
    setIsLoading(true);
    // Checks if IndexedDB is in Chrome...needs support to more browser
    const idb = window.indexedDB;

    // Try to open DB if not create
    const request: IDBOpenDBRequest = idb.open("malthewinje-db", 1);

    // Return error 
    request.onerror = function (event: Event) {
      setErrorDB(true);
      console.error("An error occurred with IndexedDB : ", event);
    };

    // Create IndexedDB if not present
    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
      const db: IDBDatabase = request.result;
      if (!db.objectStoreNames.contains("deviceEntity")) {
        const objectStore: IDBObjectStore = db.createObjectStore("deviceEntity", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = function () {
      setConnected(true);
      const db: IDBDatabase = request.result;
      const tx: IDBTransaction = db.transaction("deviceEntity", "readwrite");
      const deviceEntity: IDBObjectStore = tx.objectStore("deviceEntity");

      // Loop to add entries in Indexed Database
      const { name, serial_number, last_connection, status } = DEVICE_ENTITY_DATA;
      for (let index = 0; index < 50000; index++) {
        deviceEntity.add({
          name: `${name + index}`,
          serial_number: `${serial_number + index}`,
          last_connection,
          status
        });   
      }
      const deviceListRequest = deviceEntity.getAll();
      deviceListRequest.onsuccess = (event: Event) => {
        const result = (event.target as IDBRequest<Device[]>).result;
        let activeCounterLength = result.filter(item => item.status === true).length
        let inactiveCounterLength = result.filter(item => item.status === false).length
        setCounterStatus({ activeCount: activeCounterLength, inactiveCount: inactiveCounterLength })
        
      };
      setIsLoading(false)
      return tx.oncomplete;
    };
    
    return;
  }

  return (
    <>
      <h1>Malthe Winje</h1>
      <p>Initialize and create a IndexedDb with 50000 entries</p>
      <button className='btn btn-primary' onClick={initializeDatabase}>
        Initialize database {isLoading &&  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
      </button>
      {errorDB && <p className='alert alert-danger mt-3'>An error occurred with IndexedDB</p>}
      {connected && <p className='alert alert-success mt-3'>Database opened successfully</p>}
    </>
  )
}
export default Page1;

