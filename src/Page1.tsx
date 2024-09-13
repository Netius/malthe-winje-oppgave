import { useState } from 'react';
import DEVICE_ENTITY_DATA from './data/DEVICE_ENTITY_DATA';
import { Device, Props } from './utils/deviceType';
import { SuccessMessages } from './components/AlertMessages/SuccessMessages';

type ErrorMessage = {
  isError: boolean;
  message: string;
}

type SuccessMessage = {
  isSuccess: boolean;
  message: string;
}

type LoadingSpinner = {
  creating: boolean;
  deleting: boolean;
}

const Page1 : React.FC<Props> = ({ setCounterStatus }) => {
  const [isSuccess, setIsSuccess] = useState<SuccessMessage>({isSuccess:false, message: ""});
  const [isError, setIsError] = useState<ErrorMessage>({isError:false, message: ""});
  const [isLoading, setIsLoading] = useState<LoadingSpinner>({creating:false, deleting:false});

  const initializeDatabase = () => {
    setIsLoading({...isLoading, creating: true});
    // Checks if IndexedDB is in Chrome...needs support to more browser
    const idb = window.indexedDB;

    // Try to open DB if not create
    const request: IDBOpenDBRequest = idb.open("malthewinje-db", 1);

    // Return error 
    request.onerror = function (event: Event) {
      setIsError({isError:true, message: `An error occurred with IndexedDB ${event}`});
      setIsLoading({...isLoading, creating: false});
      
    };

    // Create IndexedDB if not present
    request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
      const db: IDBDatabase = request.result;
      if (!db.objectStoreNames.contains("deviceEntity")) {
        const objectStore: IDBObjectStore = db.createObjectStore("deviceEntity", { keyPath: "id", autoIncrement: true });
      }
      setIsLoading({...isLoading, creating: false});
    };

    request.onsuccess = function () {
      setIsSuccess({isSuccess: true, message: "Database created successful"});
      const db: IDBDatabase = request.result;
      const tx: IDBTransaction = db.transaction("deviceEntity", "readwrite");
      const deviceEntity: IDBObjectStore = tx.objectStore("deviceEntity");

      // Loop to add entries in Indexed Database
      const { name, serial_number, last_connection, status } = DEVICE_ENTITY_DATA;
      for (let index = 0; index < 100000; index++) {
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
      setIsLoading({...isLoading, creating: false});
      return tx.oncomplete;
    };
    
    return;
  }

  const deleteIndexedDb = () => {
    setIsLoading({...isLoading, deleting: true});
      // Checks if IndexedDB is in Chrome...needs support to more browser
    const idb = window.indexedDB;

    const request: IDBOpenDBRequest = idb.deleteDatabase("malthewinje-db");

    request.onerror = function(event: Event) {
       setIsError({isError: true, message: `Error while deleting database: ${event}`});
       setIsLoading({...isLoading, deleting: false});
    };

    request.onsuccess = function(event: Event) {
       setIsSuccess({isSuccess: true, message:`Success while deleting database.${event}`});
       setIsLoading({...isLoading, deleting: false});
    };

  }

  return (
    <>
      <h1>Malthe Winje</h1>
      <p>Initialize and create a IndexedDb with 150000 entries</p>
      <button className='btn btn-primary' onClick={initializeDatabase}>
        Initialize database {isLoading.creating &&  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
      </button>
      <button className='btn btn-danger ms-3' onClick={deleteIndexedDb}>
        Delete database {isLoading.deleting &&  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>}
      </button>
      {/* <SuccessMessages isSuccess={{...isSuccess}} /> */}
      {isError.isError && <p className='alert alert-danger mt-3'>{isError.message}</p>}
      {isSuccess.isSuccess && <p className='alert alert-success mt-3'>{isSuccess.message}</p>}
    </>
  )
}
export default Page1;

